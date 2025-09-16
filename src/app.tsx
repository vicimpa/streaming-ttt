import { Backdrop, Game, Image, Leads, Main, Screen, Title } from "./view/styled";

import Display from "./images/display.svg?react";
import Line from "./images/line.svg?react";
import { useSignalRef } from "@preact/signals-react/utils";
import { useComputed } from "@preact/signals-react";
import backFS from "./shader/back.frag";

import deckSrc from "./images/deck.svg";
import coinsSrc from "./images/coins.svg";
import doctorSrc from "./images/doctor.svg";
import moneySrc from "./images/money.svg";
import leaderboardSrc from "./images/leaderboard.svg";
import { Loader } from "./view/Loader";
import { Rect } from "./view/Rect";
import { GameItems } from "./view/GameItems";
import { LeadItems } from "./view/LeadItems";
import { Winner } from "./view/Winner";
import { Chat } from "./view/Chat";
import { Shader } from "./view/Shader";

export const App = () => {
  const ref = useSignalRef<SVGSVGElement | null>(null);
  const view = useComputed(() => ref.value?.getElementById('displayView') ?? null);

  return (
    <Loader>
      <Main $width={1440} $height={1024}>
        <Image $image={deckSrc} />
        <Line className="absolute nomouse" />
        <Rect target={view}>
          <Backdrop />
          <Shader shader={backFS} />
        </Rect>
        <Display ref={ref} className="absolute nomouse" />
        <Rect target={view}>
          <Screen>
            <Game>
              <GameItems />
            </Game>
            <Leads>
              <Title src={leaderboardSrc} />
              <LeadItems />
            </Leads>
          </Screen>
        </Rect>
        <Image $image={doctorSrc} />
        <Image $image={coinsSrc} />
        <Image $image={moneySrc} />
        <Winner />
      </Main>
      <Chat />
    </Loader>
  );
};