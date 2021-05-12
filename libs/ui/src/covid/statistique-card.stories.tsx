import React from 'react';
import { StatistiqueCard, StatistiqueCardProps } from './statistique-card';
import Stats from './stats';

export default {
  component: StatistiqueCard,
  title: 'Covid/StatistiqueCard',
};

export const info = () => {
  /* eslint-disable-next-line */
  const props: StatistiqueCardProps = {
    value: 1125,
    description: 'nouveaux patients hospitalisés',
    variation: ['+', 598],
    type: 'info',
  };

  return (
    <Stats>
      <StatistiqueCard {...props} />
    </Stats>
  );
};

export const danger = () => {
  /* eslint-disable-next-line */
  const props: StatistiqueCardProps = {
    value: '106 684',
    description: 'cumul des décès',
    variation: ['+', 292],
    type: 'danger',
  };

  return (
    <Stats>
      <StatistiqueCard {...props} />
    </Stats>
  );
};
