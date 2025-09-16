
import { computed, effect, signal } from "@preact/signals-react";
import { vec2 } from "@vicimpa/glm";
import { resizeObserver } from "@vicimpa/observers";
import { useMemo } from "react";
import { getValue, type MaybeSignal } from "./signals";

export function signalSize<T extends HTMLElement>(el: MaybeSignal<T | null>) {
  var _dispose = () => { };
  const size = signal(vec2(), {
    watched() {
      _dispose = effect(() => {
        return resizeObserver(getValue(el), ({ contentRect: { width, height } }) => {
          const newSize = vec2(width, height);
          if (size.value.equals(newSize))
            return;
          size.value = newSize;
        });
      });
    },
    unwatched() {
      _dispose();
    }
  });

  return computed(() => size.value);
}

export function useSignalSize<T extends HTMLElement>(el: MaybeSignal<T | null>) {
  return useMemo(() => signalSize(el), [el]);
}