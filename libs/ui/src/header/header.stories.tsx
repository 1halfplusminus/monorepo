import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Header, HeaderProps } from './header';
import { date, text } from '@storybook/addon-knobs';
import { useHeaderDatePickerState } from './hooks';

export default {
  component: Header,
  title: 'Covid/Header',
  argTypes: {
    onClick: { action: 'clicked' },
    title: { defaultValue: 'Covid Pacifique' },
  },
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta<HeaderProps>;

export const primary: Story<HeaderProps> = (args) => {
  return <Header {...args} />;
};

export const Controlled: Story<HeaderProps> = ({ date, onClick, ...args }) => {
  return (
    <Header
      {...args}
      {...useHeaderDatePickerState({ date, onDateChange: onClick })}
    />
  );
};
