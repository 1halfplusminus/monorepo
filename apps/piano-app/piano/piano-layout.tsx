import React, { PropsWithChildren } from 'react';

import styled, { css } from 'styled-components';
import { Note } from '../libs/audio';

/* eslint-disable-next-line */
export interface PianoLayoutProps {
  startNote: Note;
  endNote: Note;
}

const StyledPianoLayout = styled.div<{ repeat: number }>`
  --note-width: 3rem;
  --note-accidental-width: 1.4rem;
  --note-width-half: calc(var(--note-width) / 2);
  --note-accidental-width-half: calc(var(--note-accidental-width) / 2);
  color: pink;
  width: 100%;
  display: grid;
  ${({ repeat }) => css`
    grid-template-columns: repeat(
      ${repeat},
      var(--note-width) 0 var(--note-width) 0 var(--note-width)
        var(--note-width) 0 var(--note-width) 0 var(--note-width) 0
        var(--note-width) 0 var(--note-width)
    );
  `}

  grid-template-rows: repeat(1, 250px 90px);
  position: relative;
`;

export function PianoLayout({
  children,
  startNote,
  endNote,
}: PropsWithChildren<PianoLayoutProps>) {
  return (
    <StyledPianoLayout repeat={endNote[1] - startNote[1] + 1}>
      {children}
    </StyledPianoLayout>
  );
}

export default PianoLayout;
