import React from 'react';
import styled from 'styled-components';
import Touch from '../piano/touch/touch';
import { useInstrument } from '../libs/AudioContext';

const StyledPage = styled.div`
  .page {
  }
`;

export function Index() {
  const { play } = useInstrument({ instrumentName: 'acoustic_grand_piano' });
  const playNote = async () => {
    play('C4');
  };
  return (
    <StyledPage>
      <Touch onTouch={playNote} />
    </StyledPage>
  );
}

export default Index;
