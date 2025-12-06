import { useEffect, useRef, useState, useCallback } from "react";

const queryCache = new Map<string, { data: any; timestamp: number }>();

interface QueryOptions<T> {
  key: string;
  queryFn: () => Promise<T>;
  retry?: number;
  retryDelay?: number;
  staleTime?: number;
  enabled?: boolean;
}

export function useSmartQuery<T>({
  key,
  queryFn,
  retry = 3,
  retryDelay = 500,
  staleTime = 10000,
  enabled = true,
}: QueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<any>(null);

  const retriesLeft = useRef(retry);

  const refetch = () => {
    retriesLeft.current = retry;
    return execute();
  };

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const cached = queryCache.get(key);

    if (cached && Date.now() - cached.timestamp < staleTime) {
      setData(cached.data);
      setIsLoading(false);
      return cached.data;
    }

    const run = async (): Promise<T> => {
      try {
        const result = await queryFn();

        queryCache.set(key, {
          data: result,
          timestamp: Date.now(),
        });

        setData(result);
        return result;
      } catch (err) {
        if (retriesLeft.current > 0) {
          retriesLeft.current--;
          await new Promise((res) => setTimeout(res, retryDelay));
          return run();
        }
        throw err;
      }
    };

    try {
      const result = await run();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [key, queryFn, staleTime, retryDelay]);

  useEffect(() => {
    if (!enabled) return;
    execute();
  }, [enabled, execute]);

  return { data, isLoading, error, refetch };
}
