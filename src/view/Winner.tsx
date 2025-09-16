import styled from "styled-components";
import { Avatar, Backdrop, CrownAvatar, Popover, PopoverText, Spinners } from "./styled";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import rsp from "@vicimpa/rsp";
import { Variables } from "./Variables";
import { useSocketEvent } from "../utils/socket";
import sound from "../utils/sound";

const Animate = styled.div`
  display: contents;
  pointer-events: none;

  &[data-start=true] {
    ${Backdrop} { opacity: 0; transition: 0.3s; }
    ${Spinners} { transform: scale(0); transition: 0.1s;  }
    ${Popover} { opacity: 0; transform: scale(10); transition: 0.2s; }
  }

  &:not([data-start=true]) {
    ${Backdrop} { opacity: 1; transition: 0.3s 1s; }
    ${Spinners} { transform: scale(1); transition: 0.4s 1s;  }
    ${Popover} { opacity: 1; transform: scale(1); transition: 0.2s 1s; }
  }
`;

type WinnerItem = { name: string, avatar?: string; };

export const Winner = () => {
  const current = useSignal<WinnerItem | null>(null);
  const name = useSignal(current.value?.name ?? '');
  const avatar = useSignal(current.value?.avatar ?? '');
  const start = useSignal(!name.value);
  const avatarUrl = useComputed(() => avatar.value ? `url("${avatar.value}")` : null);

  useSocketEvent('update', ({ winner, game, end }: any) => {
    if (game) {
      current.value = winner ?? null;
    }

    if (end) {
      if (winner)
        sound.win.play();
      else
        sound.nowin.play();
    }
  });

  useSignalEffect(() => {
    name.value = current.value?.name ?? name.value;
    avatar.value = current.value?.avatar ?? avatar.value;
    start.value = !current.value;
  });

  return (
    <rsp.$ $target={Animate} data-start={start}>
      <Backdrop />
      <Spinners />
      <Popover onTransitionEnd={() => !start.value && sound.showWIn.play(.5)}>
        <CrownAvatar>
          <Variables image={avatarUrl}>
            <Avatar $size={74} />
          </Variables>
        </CrownAvatar>
        <PopoverText style={{ color: 'var(--green)' }}>{name}</PopoverText>
        <PopoverText data-full>winner!</PopoverText>
      </Popover>
    </rsp.$>
  );
};