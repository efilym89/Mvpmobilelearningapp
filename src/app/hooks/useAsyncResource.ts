import { useEffect, useState } from "react";

export function useAsyncResource<T>(
  loader: () => Promise<T>,
  deps: ReadonlyArray<unknown>,
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isDisposed = false;

    setLoading(true);
    setError(null);

    loader()
      .then((result) => {
        if (!isDisposed) {
          setData(result);
        }
      })
      .catch((reason: unknown) => {
        if (!isDisposed) {
          setError(reason instanceof Error ? reason.message : "Unexpected error");
        }
      })
      .finally(() => {
        if (!isDisposed) {
          setLoading(false);
        }
      });

    return () => {
      isDisposed = true;
    };
    // loader is intentionally controlled by deps from the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, setData };
}
