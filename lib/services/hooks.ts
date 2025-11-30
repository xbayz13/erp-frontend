import { DependencyList, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncDataOptions {
  skip?: boolean;
}

export function useAsyncData<T>(
  factory: () => Promise<T>,
  deps: DependencyList = [],
  options?: UseAsyncDataOptions,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: !options?.skip,
    error: null,
  });

  useEffect(() => {
    if (options?.skip) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let isMounted = true;
    setState((current) => ({ ...current, loading: true, error: null }));

    factory()
      .then((result) => {
        if (!isMounted) return;
        setState({ data: result, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!isMounted) return;
        setState({
          data: null,
          loading: false,
          error: error.message ?? 'Unknown error',
        });
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, options?.skip]);

  return state;
}


