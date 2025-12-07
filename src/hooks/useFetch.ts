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

export function useFetch<T>({ key, queryFn, retry = 2, retryDelay = 500, enabled = true }: QueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const retriesLeft = useRef(retry);

  const refetch = () => {
    retriesLeft.current = retry;

    return execute();
  };

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const cached = queryCache.get(key);

    if (cached) {
      console.log(`USING CACHED DATA FOR KEY="${key}"`);
      setData(cached.data as T);
      setIsLoading(false);
      return cached.data as T;
    }

    const run = async (attempt = 1): Promise<T> => {
      try {
        const result = await queryFn();

        console.log(`FETCHED FRESH DATA FOR KEY="${key}"`);

        queryCache.set(key, {
          data: result,
          timestamp: Date.now(),
        });

        setData(result);
        return result;
      } catch (err) {
        if (retriesLeft.current > 0) {
          console.warn(
            `fetch failed for key="${key}" on attempt ${attempt};`,
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
  }, [key, queryFn, retryDelay]);

  useEffect(() => {
    if (!enabled) return;
    execute();
  }, [enabled, execute]);

  return { data, isLoading, error, refetch };
}
