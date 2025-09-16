import styled, { keyframes } from "styled-components";
import xSrc from "../images/icon=x.svg";
import oSrc from "../images/icon=o.svg";
import avatarSrc from "../images/avatar.svg";
import spinnerA from "../images/spinnerA.svg";
import spinnerB from "../images/spinnerB.svg";
import crownimageSrc from "../images/crownImage.svg";

export const Main = styled.div<{ $width: number, $height: number; }>`
  position: absolute;
  inset: 0;
  margin: auto;
  width: ${p => p.$width}px;
  height: ${p => p.$height}px;
  border: 5px solid var(--green);
  overflow: hidden;
  border-radius: 100px;
`;

export const Image = styled.div<{ $image: string; }>`
  position: absolute;
  inset: 0;
  background-image: url("${p => p.$image}");
  pointer-events: none;
`;

export const Screen = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

export const Box = styled.div`
  position: relative;
  height: 444px;
  border-radius: 50px;
`;

export const Game = styled(Box)`
  width: 444px;
  background-color: var(--gray);
  padding: 25px;
  gap: 25px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  box-shadow: inset 0px 4px 4px rgba(0,0,0,0.25);
`;

export const Leads = styled(Box)`
  width: 404px;
  padding: 35px;
  background-color: var(--black);
  border: 5px solid var(--green);
`;

export const Title = styled.img`
  position: absolute;
  bottom: calc(100% + 15px);
  left: 0;
  right: 0;
  margin: auto;
`;

export const Item = styled.div<{ $draw?: 'x' | 'o'; }>`
  width: 114px;
  height: 114px;
  background-color: var(--green);
  border-radius: 25px;
  padding: 4px 15px;
  display: flex;
  justify-content: start;
  align-items: end;
  box-shadow: 0 4px 4px rgba(0,0,0,0.25);
  position: relative;

  &::before {
    content: ' ';
    position: absolute;
    inset: 0;
    background-repeat: no-repeat;
    background-position: center;
    ${p => p.$draw ? (
    `background-image: url("${p.$draw === 'x' ? xSrc : oSrc}");`
  ) : ''}
    z-index: 1;
  }
`;

export const ItemText = styled.p`
  display: inline-flex;
  align-items: center;
  color: var(--gray);
  gap: 5px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  &::before {
    content: ' ';
    display: inline-block;
    width: 9px;
    height: 9px;
    background-color: var(--gray);
    border-radius: 100%;
    flex-shrink: 0;
  }
`;

export const LeadsItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 15px;
  font-size: 35px;
  font-weight: 600;
  line-height: 41px;
  text-transform: uppercase;
  gap: 5px;

  & p {
    white-space: nowrap;
  }

  & [data-grow] {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  & [data-center] {
    text-align: center;
  }
`;

export const Avatar = styled.div<{ $size?: number; }>`
  width: ${p => p.$size ?? 30}px;
  height: ${p => p.$size ?? 30}px;
  border-radius: 100%;
  overflow: hidden;
  --default: url("${avatarSrc}");
  background-image: var(--image, var(--default));
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 4px rgba(0,0,0,0.25));
`;

export const LoaderContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background-color: var(--black);
  pointer-events: none;
  opacity: var(--opacity, 1);
  transition-duration: .3s;
  transition-delay: .5s;
`;

const spinA = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const spinB = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
`;

export const Spinners = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 0 10px var(--green)) blur(10px);

  &::before, &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-position: center;
    background-repeat: no-repeat;
  }

  &::before {
    background-image: url("${spinnerB}");
    animation: ${spinA} 20s linear infinite;
  }

  &::after {
    background-image: url("${spinnerA}");
    animation: ${spinB} 10s linear infinite;
  }
`;

export const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(20px);
  background-color: rgba(0,0,0,0.6);
`;

export const Popover = styled.div`
  position: absolute;
  inset: 0;
  margin: auto;
  width: fit-content;
  max-width: 640px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  padding: 25px;
  gap: 10px;
  background-color: var(--gray);
  box-shadow: 0 0 30px 11px var(--green), inset 0 4px 4px rgba(0,0,0,0.25);
`;

export const PopoverText = styled.p`
  font-weight: 600;
  font-size: 35px;
  line-height: 41px;
  text-transform: uppercase;
  white-space: nowrap;
  &:not([data-full] ){
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const CrownAvatar = styled.div`
  position: relative;

  &::before {
    content: ' ';
    position: absolute;
    top: -51.5px;
    left: -31.5px;
    width: 94px;
    height: 75px;
    background-image: url("${crownimageSrc}");
    z-index: 1;
    background-size: contain;
    background-repeat: no-repeat;
    filter: drop-shadow(0 4px 4px rgba(0,0,0,0.25));
  }
`;

export const ShaderContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;

  & canvas {
    position: absolute;
  }
`;