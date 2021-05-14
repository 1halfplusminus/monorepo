import { Meta, Story } from '@storybook/react';
import React from 'react';
import StatsCoronaIcon from './stats-corona-icon';
import { TitleIcon, TitleIconIcon, TitleIconProps } from './title-icon';

export default {
  component: TitleIcon,
  title: 'Covid/Title Icon',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
} as Meta;

export const primary: Story<TitleIconProps> = (props) => {
  return (
    <TitleIcon {...props}>
      <TitleIconIcon>
        <StatsCoronaIcon />
      </TitleIconIcon>
      France
    </TitleIcon>
  );
};
