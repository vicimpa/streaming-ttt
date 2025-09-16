import type { PropsWithChildren } from "react";
import { useCurrentSignal, type MaybeSignal } from "../utils/signals";
import { useSignalEffect } from "@preact/signals-react";
import { useSignalRef } from "@preact/signals-react/utils";

export type RectProps<T> = {
  target?: MaybeSignal<T | null>;
} & PropsWithChildren;

export const Rect = <T extends Element>({ children, target }: RectProps<T>) => {
  const ref = useSignalRef<HTMLDivElement | null>(null);
  const currentTarget = useCurrentSignal(target);

  useSignalEffect(() => {
    const { value: div } = ref;
    const { value: target } = currentTarget;

    if (!div || !target)
      return;

    const { x, y, width, height } = target.getBoundingClientRect();

    Object.assign(div.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`
    } as CSSStyleDeclaration);
  });

  return (
    <div ref={ref}>
      {children}
    </div>
  );
};