import React from 'react';
import MemoBassEffectIcon from '../effect-button/bass-effect-icon';
import EffectButton, {
  EffectButtonProps,
} from '../effect-button/effect-button';
import { EffectButtonBass } from '../effect-button/effect-button-bass';
import EffectButtonPiano from '../effect-button/effect-button-piano';
import EffectButtonXylo from '../effect-button/effect-button-xylo';
import { EffectButtonGroups } from './effect-button-groups';

export default {
  component: EffectButtonGroups,
  title: 'EffectButtonGroups',
};

export const primary = () => {
  return (
    <EffectButtonGroups>
      {(selected, select) => (
        <>
          <EffectButtonPiano checked={selected === 0} onChecked={select(0)} />
          <EffectButtonXylo checked={selected === 1} onChecked={select(1)} />
          <EffectButtonBass checked={selected === 2} onChecked={select(2)} />
        </>
      )}
    </EffectButtonGroups>
  );
};
