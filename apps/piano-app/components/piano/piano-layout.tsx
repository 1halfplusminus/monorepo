import React, { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { Note } from '../../libs/audio';

export interface PianoLayoutProps {
  startNote: Note;
  endNote: Note;
}

const StyledPianoLayout = styled.div<{ repeat: number }>`
  --note-width: 3rem;
  --note-accidental-width: 1.4rem;
  --note-width-half: calc(var(--note-width) / 2);
  --note-accidental-width-half: calc(var(--note-accidental-width) / 2);
  width: 100%;
  display: grid;
  ${({ repeat }) => css`
    grid-template-columns: repeat(
      auto-fill,
      var(--note-width) 0 var(--note-width) 0 var(--note-width)
        var(--note-width) 0 var(--note-width) 0 var(--note-width) 0
        var(--note-width) 0 var(--note-width)
    );
  `}
  position: relative;
  background: white;
`;

export function PianoKeyboardLayout({
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

export default PianoKeyboardLayout;
