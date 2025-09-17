
import { computed, effect, signal } from "@preact/signals-react";
import { vec4 } from "@vicimpa/glm";
import { useMemo } from "react";
import { getValue, type MaybeSignal } from "./signals";
import { looper } from "./looper";

export function signalRect<T extends Element>(el: MaybeSignal<T | null>) {
  var _dispose = () => { };
  const size = signal(vec4(), {
    watched() {
      _dispose = effect(() => {
        const target = getValue(el);

        if (!target) {
          if (!size.peek().equals(0))
            size.value = vec4();
          return;
        }

        return looper(() => {
          const { x, y, width, height } = target.getBoundingClientRect();
          const newSize = vec4(x, y, width, height);

          if (!size.value.equals(newSize))
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

export function useSignalRect<T extends Element>(el: MaybeSignal<T | null>) {
  return useMemo(() => signalRect(el), [el]);
}