import { useEffect, useId, useMemo, type FC, type PropsWithChildren } from "react";
import { getValue, useCurrentSignal } from "../utils/signals";
import { createPortal } from "react-dom";
import { useComputed } from "@preact/signals-react";

export type VariablesProps = PropsWithChildren & Record<string, any>;

export const Variables: FC<VariablesProps> = ({ children, ..._props }) => {
  const id = useId();
  const props = useCurrentSignal(_props);
  const style = useMemo(() => document.createElement('style'), []);

  const content = useComputed(() => {
    const body = Object.entries(props.value)
      .map(([key, value]) => [`--${key}`, getValue(value)])
      .filter(e => e[1] !== undefined && e[1] !== null && e[1] !== '')
      .map(([key, value]) => `${key}:${value};`)
      .join('');
    return `#${id}{${body}}`;
  });

  useEffect(() => {
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [style]);

  return (
    <>
      {createPortal(<>{content}</>, style)}
      <div id={id} className="contents">
        {children}
      </div>
    </>
  );
};