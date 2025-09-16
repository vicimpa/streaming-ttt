import type { FC, JSX } from "react";
import baseVS from "../shader/base.vert";
import baseFS from "../shader/base.frag";
import { useCurrentSignal, type MaybeSignal } from "../utils/signals";
import { ShaderContainer } from "./styled";
import { useSignalRef } from "@preact/signals-react/utils";
import { useSignalSize } from "../utils/size";
import { useComputed, useSignalEffect } from "@preact/signals-react";
import { createProgramInfo, setUniforms } from "twgl.js";
import { looper } from "../utils/looper";

export type ShaderProps = {
  shader?: MaybeSignal<string>;
} & Omit<JSX.IntrinsicElements['div'], 'children'>;

const context = Symbol('context');

const getContext = (can: (HTMLCanvasElement & { [context]?: WebGLRenderingContext; }) | null) => {
  if (!can) return null;
  return can[context] ?? (
    can[context] = can.getContext('webgl2')!
  );
};

export const Shader: FC<ShaderProps> = ({ shader, ...props }) => {
  const currentShader = useCurrentSignal(shader);
  const ref = useSignalRef<HTMLCanvasElement | null>(null);
  const parent = useComputed(() => ref.value?.parentElement ?? null);
  const glRef = useComputed(() => getContext(ref.value));
  const sizeRef = useSignalSize(parent);
  const infoRef = useComputed(() => glRef.value ? (
    createProgramInfo(glRef.value, [baseVS, currentShader.value ?? baseFS])
  ) : null);

  useSignalEffect(() => {
    const { value: can } = ref;
    const { value: gl } = glRef;
    const { value: size } = sizeRef;
    const { value: info } = infoRef;

    if (!gl || !can || !info)
      return;

    if (size.equals(0))
      return;

    return looper((iTime) => {
      can.width = size.width;
      can.height = size.height;
      gl.viewport(0, 0, size.width, size.height);
      gl.useProgram(info.program);
      setUniforms(info, { iResolution: [...size, 0], iTime });
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });

  });

  return (
    <ShaderContainer {...props}>
      <canvas ref={ref} />
    </ShaderContainer>
  );
};