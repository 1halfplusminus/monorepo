import React, { useState } from 'react';
import { useHotkeys, useIsHotkeyPressed } from 'react-hotkeys-hook';

import styled, { css } from 'styled-components';
import { getToneName, Note } from '../../../libs/audio';

/* eslint-disable-next-line */
export interface TouchProps {
  onMouseDown?: () => void;
  onMouseUp: () => void;
  note: Note;
  hotkeys?: string;
}

const StyledTouch = styled.button<{ accidental: boolean; pressed: boolean }>`
  --pressed-color: #2549d1b3;
  overflow-y: visible;
  width: calc(var(--note-width));
  display: flex;
  flex-direction: column;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  ${({ pressed }) =>
    pressed
      ? css`
          background-color: var(--pressed-color);
        `
      : css`
          transition: background-color 500ms cubic-bezier(0.19, 1, 0.22, 1);
          background-color: inherit;
        `}
  ${({ accidental }) =>
    accidental
      ? css`
      position: relative;
      z-index: 999;
      background-color: black;
      color: white;
      position: : relative;
      left: calc(var(--note-accidental-width-half) - var(--note-width-half));
      height: 75%;
      width: var(--note-accidental-width);
      :hover {
        background-color: #000000b0;
      }
    `
      : css`
          :hover {
            box-shadow: inset 0em -0.1em 0.4em 0.1em #7d7d7d;
          }
        `}
`;

export function Touch({
  onMouseUp,
  onMouseDown,
  note: [tone, octave, accidental],
  hotkeys,
  ...rest
}: TouchProps) {
  const isPressedHotkeyPressed = useIsHotkeyPressed();
  const [isPressed, setPressed] = useState(false);
  const handleMouseOver = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e.buttons === 1) {
      handleMouseUp(e);
    }
  };
  const handleMouseUp = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setPressed(false);
    onMouseUp();
  };
  const handleMouseDown = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setPressed(true);
    if (onMouseDown) {
      onMouseDown();
    }
  };
  useHotkeys(
    hotkeys,
    (e) => {
      if (e.type === 'keyup') {
        handleMouseUp(e);
        console.log('hotkeys pressed');
      } else {
        handleMouseDown(e);
        console.log('hotkeys released');
      }
    },
    { enabled: hotkeys ? true : false, keyup: true, keydown: true },
    [handleMouseUp, handleMouseDown]
  );

  return (
    <StyledTouch
      pressed={isPressed}
      accidental={accidental}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setPressed(false)}
      {...rest}
    >
      {!accidental && (
        <>
          <span unselectable="on">{hotkeys?.toUpperCase()}</span>
          <span unselectable="on">
            {getToneName(tone)} <br /> {octave}
          </span>
        </>
      )}
    </StyledTouch>
  );
}

export default Touch;
