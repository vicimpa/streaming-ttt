import { signal, useComputed, useSignalEffect } from "@preact/signals-react";
import { type FC, type PropsWithChildren } from "react";
import { LoaderContainer } from "./styled";
import { Variables } from "./Variables";
import { socketConnected } from "../utils/socket";
import sound from "../utils/sound";

export const isLoaded = signal(true);

export const Loader: FC<PropsWithChildren> = ({ children }) => {
  const opacity = useComputed(() => (isLoaded.value || !socketConnected.value) ? 1 : 0);

  useSignalEffect(() => {
    if (!opacity.value)
      return sound.music.loop(.1);
  });

  return (
    <>
      {children}
      {
        <Variables opacity={opacity}>
          <LoaderContainer >
            <div className="loader" />
          </LoaderContainer>
        </Variables>
      }
      {<div className="contents" ref={cur => { isLoaded.value = !cur; }} />}
    </>
  );
};