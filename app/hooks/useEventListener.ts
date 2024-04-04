import type { RefObject } from 'react';
import { useSyncExternalStore } from 'react';

export function useEventListener<T extends HTMLElement, V>(ref: RefObject<T | null>, event: keyof HTMLElementEventMap, initialValue: V, getSnapshot: (element: T) => V) {
  return useSyncExternalStore((onChange) => {
    ref.current?.addEventListener(event, onChange);

    return () => ref.current?.removeEventListener(event, onChange);
  }, () => ref.current ? getSnapshot(ref.current) : initialValue);
}
