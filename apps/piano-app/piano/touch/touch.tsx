import React from 'react';

import styled, { css } from 'styled-components';
import { getToneName, Note } from '../../libs/audio';

/* eslint-disable-next-line */
export interface TouchProps {
  onMouseDown?: () => void;
  onMouseUp: () => void;
  note: Note;
}

const StyledTouch = styled.button<{ accidental: boolean }>`
  overflow-y: visible;
  width: calc(var(--note-width));
  display: flex;
  flex-direction: column-reverse;
  cursor: pointer;
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
  ...rest
}: TouchProps) {
  return (
    <StyledTouch
      accidental={accidental}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      {...rest}
    >
      {!accidental && `${getToneName(tone)} ${octave}`}
    </StyledTouch>
  );
}

export default Touch;
