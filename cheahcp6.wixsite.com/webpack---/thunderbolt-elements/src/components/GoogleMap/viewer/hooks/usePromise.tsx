import * as React from 'react';

type PromiseFactory<P> = () => Promise<P>;
type PromiseResolver<P> = (value?: P) => void;

export function usePromises<P = void>(): [
  PromiseFactory<P>,
  PromiseResolver<P>,
] {
  const promises = React.useRef<Array<PromiseResolver<P>>>([]);

  const createPromise = React.useCallback(
    () =>
      new Promise<P>(resolve =>
        promises.current.push(resolve as PromiseResolver<P>),
      ),
    [],
  );

  const resolvePromises = React.useCallback((data?: P) => {
    promises.current.forEach(resolvePromise => resolvePromise(data));
    promises.current.length = 0;
  }, []);

  return [createPromise, resolvePromises];
}
