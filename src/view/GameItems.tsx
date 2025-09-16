import { useComputed, useSignal } from "@preact/signals-react/runtime";
import { Item, ItemText } from "./styled";
import { array } from "../utils/array";
import styled, { keyframes } from "styled-components";
import { useSocketEvent } from "../utils/socket";

type Item = { id: string; name: string, x: boolean; win?: true; } | null;

const click = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(0, 0, 0, 0);}
  30% { transform: scale(0.92); box-shadow: 0 0 12px rgba(0, 150, 255, 0.4); }
  60% { transform: scale(1.04); box-shadow: 0 0 6px rgba(0, 150, 255, 0.2); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(0, 0, 0, 0); }
`;

const space = keyframes`
  0% { transform: scale(0); opacity: 0.6; }
  80% { transform: scale(8); opacity: 0.7; }
  100% { transform: scale(10); opacity: 0; }
`;

const Animate = styled.div`
  display: contents;

  ${Item} {
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 25px;
      border: 4px solid var(--white);
      transform: scale(0);
      filter: blur(5px);
      pointer-events: none;
      z-index: 999;
    }
  }

  &[data-win=true] ${Item}{
    background-color: var(--white);
    transform: scale(1.2);
    z-index: 1;
  }

  &[data-has=true]:not([data-win=true]) {
    ${Item} { animation: ${click} .2s; }
  }

  &[data-has=true] {
    ${Item}::after { animation: ${space} 0.3s linear; }
    ${Item}::before { opacity: 1; }
    ${ItemText} { transform: scale(1) translateY(0px); opacity: 1;  transition: .3s .1s; }
  }

  &:not([data-has=true]) {
    transition: .1s;
    ${Item}::before { opacity: 0; }
    ${ItemText} { transform: scale(2) translateY(200px);  opacity: 0;  transition: 0s 0s; }
  }
`;

export const GameItems = () => {
  const items = useSignal<Item[]>([]);

  useSocketEvent('update', ({ game }: any) => {
    if (game && Array.isArray(game))
      items.value = game;
  });

  return useComputed(() => (
    array(9, (i) => {
      const item = items.value[i] ?? null;

      return (
        <Animate key={i} data-has={!!item} data-win={item?.win}>
          <Item $draw={item ? (item.x ? 'x' : 'o') : undefined}>
            {item ? (
              <ItemText>{item?.name}</ItemText>
            ) : null}
          </Item>
        </Animate>
      );
    })
  ));
};