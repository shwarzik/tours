import { useEffect, useRef, useState, useCallback } from "react";

import { stopSearchPrices } from "@/api/endpoints";

// Simple in-memory cache keyed by a string. Values persist for the app lifetime.
const queryCache = new Map<string, { data: unknown; timestamp: number }>();

// Options used to initialize a fetch
interface QueryOptions<T> {
  key: string;
  queryFn: () => Promise<T>;
  retry?: number;
  retryDelay?: number;
  enabled?: boolean;
}

// Options used when refetching to override key/queryFn on demand
interface RefetchOptions<T> {
  key?: string;
  queryFn?: () => Promise<T>;
}

export function useFetch<T>({ key, queryFn, retry = 2, retryDelay = 500, enabled = true }: QueryOptions<T>) {
  // Public state returned from the hook
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  // Internal refs that are safe across re-renders
  const retriesLeft = useRef(retry);
  const keyRef = useRef(key);
  const queryFnRef = useRef(queryFn);
  // Incremented for each request; used to ignore late/stale responses
  const requestIdRef = useRef(0);

  // Keep refs updated
  keyRef.current = key;
  queryFnRef.current = queryFn;

  // Core executor: performs fetch, uses cache, handles retries, and guards stale updates
  const execute = useCallback(
    async (options?: RefetchOptions<T>) => {
      const currentKey = options?.key ?? keyRef.current;
      const currentQueryFn = options?.queryFn ?? queryFnRef.current;

      const myRequestId = ++requestIdRef.current;
      setIsLoading(true);
      setError(null);

      const cached = queryCache.get(currentKey);

      if (cached) {
        console.log(`USING CACHED DATA FOR KEY="${currentKey}"`);
        if (myRequestId === requestIdRef.current) {
          setData(cached.data as T);
          setIsLoading(false);
        }
        return cached.data as T;
      }

      // Run a single fetch with retry attempts
      const run = async (attempt = 1): Promise<T> => {
        try {
          const result = await currentQueryFn();

          console.log(`FETCHED FRESH DATA FOR KEY="${currentKey}"`);

          if (myRequestId === requestIdRef.current) {
            queryCache.set(currentKey, {
              data: result,
              timestamp: Date.now(),
            });
            setData(result);
          }
          return result;
        } catch (err) {
          if (retriesLeft.current > 0) {
            console.warn(`${attempt} RETRIES key="${currentKey}"`, err);
            retriesLeft.current--;
            await new Promise((res) => setTimeout(res, retryDelay));
            return run(attempt + 1);
          }
          throw err;
        }
      };

      try {
        const result = await run();
        if (myRequestId === requestIdRef.current) {
          setData(result);
        }
        return result;
      } catch (err) {
        if (myRequestId === requestIdRef.current) {
          setError(err as Error);
        }
        throw err;
      } finally {
        if (myRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [retryDelay],
  );

  // Public refetch: resets retry counter and can override key/queryFn
  const refetch = useCallback(
    (options?: RefetchOptions<T>) => {
      retriesLeft.current = retry;
      return execute(options);
    },
    [execute, retry],
  );

  // Public stop: invalidates current request id to ignore any late responses
  // If activeToken is provided, calls API to stop server-side search and optionally refetches
  const stop = useCallback(
    async (activeToken?: string, refetchOptions?: RefetchOptions<T>) => {
      // Invalidate in-flight request; subsequent resolutions are ignored
      requestIdRef.current++;
      setIsLoading(false);

      if (activeToken) {
        try {
          const result = await stopSearchPrices(activeToken);
          if (result) {
            // After successful stop, optionally refetch
            if (refetchOptions) {
              await refetch(refetchOptions);
            }

            console.log(result);
          }
        } catch {
          // ignore stop errors here; user can handle externally if needed
        }
      }
    },
    [refetch],
  );

  // Auto-run on mount when enabled=true
  useEffect(() => {
    if (!enabled) return;
    execute();
  }, [enabled, execute]);

  return { data, isLoading, error, refetch, stop };
}
