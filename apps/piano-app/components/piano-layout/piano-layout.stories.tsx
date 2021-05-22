import { color } from '@storybook/addon-knobs';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import EffectButtonGroups from '../effect-button-groups/effect-button-groups';
import { EffectButtonBass } from '../effect-button/effect-button-bass';
import EffectButtonPiano from '../effect-button/effect-button-piano';
import EffectButtonXylo from '../effect-button/effect-button-xylo';
import Piano from '../piano/piano';
import {
  EffectLayout,
  KeyboardLayout,
  PianoLayout,
  PianoLayoutProps,
} from './piano-layout';

export default {
  component: PianoLayout,
  title: 'PianoLayout',
} as Meta;

const Filler = styled.div<{ color: string }>`
  height: 100%;
  width: 100%;
  background-color: ${({ color }) => color};
`;

export const primary: Story<PianoLayoutProps> = (props) => {
  return (
    <PianoLayout {...props}>
      <EffectLayout>
        <EffectButtonGroups>
          {(selected, select) => (
            <>
              <EffectButtonPiano
                checked={selected === 0}
                onChecked={select(0)}
              />
              <EffectButtonXylo
                checked={selected === 1}
                onChecked={select(1)}
              />
              <EffectButtonBass
                checked={selected === 2}
                onChecked={select(2)}
              />
            </>
          )}
        </EffectButtonGroups>
      </EffectLayout>
      <KeyboardLayout>
        <Piano startNote={['C', 4]} endNote={['B', 5]} play={() => {}} />
      </KeyboardLayout>
    </PianoLayout>
  );
};
