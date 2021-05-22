import React, { PropsWithChildren } from 'react';

import styled from 'styled-components';

/* eslint-disable-next-line */
export interface PianoLayoutProps {}

const StyledPianoLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #262629;
`;

export const EffectLayout = styled.div`
  grid-row: 1;
  grid-column-end: 4;
  grid-column-start: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  justify-items: center;
  align-content: center;
  padding: 1.2rem;
`;

export const KeyboardLayout = styled.div`
  grid-column-end: 4;
  grid-column-start: 1;
  padding: 0.2rem;
  justify-content: center;
  justify-items: center;
  align-content: center;
`;

export function PianoLayout({ children }: PropsWithChildren<PianoLayoutProps>) {
  return <StyledPianoLayout>{children}</StyledPianoLayout>;
}

export default PianoLayout;
