import { useEffect, useRef } from 'react';

export function useInterval(fn: () => void, delay: number | null) {
  const fnRef = useRef(fn);

  fnRef.current = fn;

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setInterval(() => fnRef.current(), delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}
