import React from 'react';
import EffectButton, { EffectButtonProps } from './effect-button';
import MemoXylophoneEffectIcon from './xylophone-effect-icon';

export const EffectButtonXylo = (props: EffectButtonProps) => (
  <EffectButton {...props}>
    <MemoXylophoneEffectIcon />
  </EffectButton>
);

export default EffectButtonXylo;
