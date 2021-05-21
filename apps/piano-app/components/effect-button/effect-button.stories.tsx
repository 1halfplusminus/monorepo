import { Meta, Story } from '@storybook/react';
import React from 'react';
import { EffectButton, EffectButtonProps } from './effect-button';
import MemoPianoEffectIcon from './piano-effect-icon';

export default {
  component: EffectButton,
  title: 'EffectButton',
} as Meta;

export const primary: Story<EffectButtonProps> = (props) => {
  return (
    <EffectButton {...props}>
      <MemoPianoEffectIcon />
    </EffectButton>
  );
};

export const checked: Story<EffectButtonProps> = (props) => {
  return (
    <EffectButton {...props}>
      <MemoPianoEffectIcon />
    </EffectButton>
  );
};

checked.args = {
  checked: true,
};
