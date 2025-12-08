import { useEffect, useRef, useState, useCallback } from "react";

const queryCache = new Map<string, { data: unknown; timestamp: number }>();

export function getCachedQuery<T>(key: string): T | null {
  const entry = queryCache.get(key);
  return entry ? (entry.data as T) : null;
}

interface QueryOptions<T> {
  key: string;
  queryFn: () => Promise<T>;
  retry?: number;
  retryDelay?: number;
  enabled?: boolean;
}

interface RefetchOptions<T> {
  key?: string;
  queryFn?: () => Promise<T>;
}

export function useFetch<T>({ key, queryFn, retry = 2, retryDelay = 500, enabled = true }: QueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const retriesLeft = useRef(retry);
  const keyRef = useRef(key);
  const queryFnRef = useRef(queryFn);

  // Keep refs updated
  keyRef.current = key;
  queryFnRef.current = queryFn;

  const execute = useCallback(async (options?: RefetchOptions<T>) => {
    const currentKey = options?.key ?? keyRef.current;
    const currentQueryFn = options?.queryFn ?? queryFnRef.current;

    setIsLoading(true);
    setError(null);

    const cached = queryCache.get(currentKey);

    if (cached) {
      console.log(`USING CACHED DATA FOR KEY="${currentKey}"`);
      setData(cached.data as T);
      setIsLoading(false);
      return cached.data as T;
    }

    const run = async (attempt = 1): Promise<T> => {
      try {
        const result = await currentQueryFn();

        console.log(`FETCHED FRESH DATA FOR KEY="${currentKey}"`);

        queryCache.set(currentKey, {
          data: result,
          timestamp: Date.now(),
        });

        setData(result);
        return result;
      } catch (err) {
        if (retriesLeft.current > 0) {
          console.warn(
            `fetch failed for key="${currentKey}" on attempt ${attempt};`,
            err
          );
          retriesLeft.current--;
          await new Promise((res) => setTimeout(res, retryDelay));
          return run(attempt + 1);
        }
        throw err;
      }
    };

    try {
      const result = await run();
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [retryDelay]);

  const refetch = useCallback((options?: RefetchOptions<T>) => {
    retriesLeft.current = retry;
    return execute(options);
  }, [execute, retry]);

  useEffect(() => {
    if (!enabled) return;
    execute();
  }, [enabled, execute]);

  return { data, isLoading, error, refetch };
}
