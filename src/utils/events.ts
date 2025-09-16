import { useCallback, useRef } from "react";

class WinnerEvent extends Event {
  constructor(public name: string, public avatar?: string) {
    super('winner');
  }
}

declare global {
  interface WindowEventMap {
    'winner': WinnerEvent;
  }
}

export function emitWinner(name: string, avatar?: string) {
  dispatchEvent(new WinnerEvent(name, avatar));
}

export function useEvents<T extends (...args: any[]) => any>(fn: T) {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((
    (...args: any[]) => {
      return ref.current(...args);
    }
  ) as T, []);
}