import React from 'react';
import MemoBassEffectIcon from './bass-effect-icon';
import EffectButton, { EffectButtonProps } from './effect-button';

export const EffectButtonBass = (props: EffectButtonProps) => (
  <EffectButton {...props}>
    <MemoBassEffectIcon />
  </EffectButton>
);

export default EffectButton;
