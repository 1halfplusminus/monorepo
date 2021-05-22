import React from 'react';
import styled from 'styled-components';
import { Note, useInstrument, usePlayNote } from '../libs/audio';
import Piano from '../components/piano/piano';
import PianoLayout, {
  EffectLayout,
  KeyboardLayout,
} from '../components/piano-layout/piano-layout';
import EffectButtonGroups from '../components/effect-button-groups/effect-button-groups';
import EffectButtonPiano from '../components/effect-button/effect-button-piano';
import EffectButtonXylo from '../components/effect-button/effect-button-xylo';
import { EffectButtonBass } from '../components/effect-button/effect-button-bass';
import useSelectInstrument from '../libs/useInstrument';

const StyledPage = styled.div``;

export function Index() {
  const startNote: Note = ['C', 4];
  const endNote: Note = ['B', 5];
  const { selectedInstrument, selectInstrument } = useSelectInstrument(
    'acoustic_grand_piano'
  );
  const { play: playInstrument } = useInstrument({
    instrumentName: selectedInstrument,
  });
  const { play } = usePlayNote({
    onPlay: (n, delay) => {
      playInstrument(n, delay);
    },
  });
  const handleEffectButton = (index: 0 | 1 | 2, select: () => void) => () => {
    switch (index) {
      case 0:
        selectInstrument('acoustic_grand_piano');
        break;
      case 1:
        selectInstrument('xylophone');
        break;
      case 2:
        selectInstrument('slap_bass_1');
        break;
    }
    select();
  };
  return (
    <StyledPage>
      <PianoLayout>
        <EffectLayout>
          <EffectButtonGroups selected={0}>
            {(selected, select) => (
              <>
                <EffectButtonPiano
                  checked={selected === 0}
                  onChecked={handleEffectButton(0, select(0))}
                />
                <EffectButtonXylo
                  checked={selected === 1}
                  onChecked={handleEffectButton(1, select(1))}
                />
                <EffectButtonBass
                  checked={selected === 2}
                  onChecked={handleEffectButton(2, select(2))}
                />
              </>
            )}
          </EffectButtonGroups>
        </EffectLayout>
        <KeyboardLayout>
          <Piano startNote={startNote} endNote={endNote} play={play} />
        </KeyboardLayout>
      </PianoLayout>
    </StyledPage>
  );
}

export default Index;
