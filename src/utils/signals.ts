import { effect, signal, Signal, useComputed, useSignal } from "@preact/signals-react";
import { useEffect } from "react";

export type MaybeSignal<T> = T | Signal<T>;

export function getValue<T>(value: MaybeSignal<T>) {
  if (value instanceof Signal)
    return value.value;

  return value;
}

export function useGetValue<T>(value: MaybeSignal<T>) {
  const current = signal(getValue(value));

  useEffect(() => (
    effect(() => {
      current.value = getValue(value);
    })
  ), [value]);

  return useComputed(() => {
    return current.value;
  });
}

export function useCurrentSignal<T>(init: MaybeSignal<T>) {
  const current = useSignal(init);
  useEffect(() => {
    current.value = init;
  }, [init]);
  return useComputed(() => getValue(current.value));
}