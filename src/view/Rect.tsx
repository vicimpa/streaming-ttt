import type { PropsWithChildren } from "react";
import { useCurrentSignal, type MaybeSignal } from "../utils/signals";
import { useSignalEffect } from "@preact/signals-react";
import { useSignalRef } from "@preact/signals-react/utils";
import { useSignalRect } from "../utils/rect";

export type RectProps<T> = {
  target?: MaybeSignal<T | null>;
} & PropsWithChildren;

export const Rect = <T extends Element>({ children, target }: RectProps<T>) => {
  const ref = useSignalRef<HTMLDivElement | null>(null);
  const rect = useSignalRect(target ?? null);

  useSignalEffect(() => {
    const { value: div } = ref;
    const { value: { x, y, width, height } } = rect;

    if (!div)
      return;

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