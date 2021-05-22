import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Piano, PianoProps } from './piano';

export default {
  component: Piano,
  title: 'Piano',
} as Meta;

export const primary: Story<PianoProps> = (props) => {
  return <Piano {...props} />;
};

primary.args = {
  startNote: ['C', 4],
  endNote: ['B', 5],
};
