import { Meta, Story } from '@storybook/react';
import React from 'react';
import { StatistiqueCard, StatistiqueCardProps } from './statistique-card';
import Stats from './stats';

export default {
  component: StatistiqueCard,
  title: 'Covid/StatistiqueCard',
  argTypes: { onClick: { action: 'clicked' } },
} as Meta;

export const info: Story<StatistiqueCardProps> = (props) => {
  return (
    <Stats>
      <StatistiqueCard {...props} />
    </Stats>
  );
};

info.args = {
  value: 1125,
  description: 'nouveaux patients hospitalisés',
  variation: ['+', 598],
  type: 'info',
};

export const danger: Story<StatistiqueCardProps> = (props) => {
  return (
    <Stats>
      <StatistiqueCard {...props} />
    </Stats>
  );
};

danger.args = {
  value: '106 684',
  description: 'cumul des décès',
  variation: ['+', 292],
  type: 'danger',
};
