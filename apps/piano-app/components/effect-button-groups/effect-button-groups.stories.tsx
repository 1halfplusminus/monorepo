import React from 'react';
import MemoBassEffectIcon from '../effect-button/bass-effect-icon';
import EffectButton, {
  EffectButtonProps,
} from '../effect-button/effect-button';
import MemoPianoEffectIcon from '../effect-button/piano-effect-icon';
import MemoXylophoneEffectIcon from '../effect-button/xylophone-effect-icon';
import {
  EffectButtonGroups,
  EffectButtonGroupsProps,
} from './effect-button-groups';

export default {
  component: EffectButtonGroups,
  title: 'EffectButtonGroups',
};

const EffectButtonPiano = (props: EffectButtonProps) => (
  <EffectButton {...props}>
    <MemoPianoEffectIcon />
  </EffectButton>
);

const EffectButtonXylo = (props: EffectButtonProps) => (
  <EffectButton {...props}>
    <MemoXylophoneEffectIcon />
  </EffectButton>
);

const EffectButtonBass = (props: EffectButtonProps) => (
  <EffectButton {...props}>
    <MemoBassEffectIcon />
  </EffectButton>
);

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
