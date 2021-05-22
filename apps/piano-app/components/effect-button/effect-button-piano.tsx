import React from 'react';
import EffectButton, { EffectButtonProps } from './effect-button';
import MemoPianoEffectIcon from './piano-effect-icon';

export const EffectButtonPiano = (props: EffectButtonProps) => (
  <EffectButton {...props}>
    <MemoPianoEffectIcon />
  </EffectButton>
);

export default EffectButtonPiano;
