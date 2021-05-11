import React from 'react';
import { css } from 'styled-components';
import tw from 'twin.macro';
import StatistiqueCard from './statistique-card';
import { Stats, StatsProps } from './stats';

export default {
  component: Stats,
  title: 'Covid/Stats',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: StatsProps = {};

  return (
    <div
      css={css`
        ${tw`w-96 h-80`}
      `}
    >
      <Stats>
        <StatistiqueCard
          {...{
            number: '5 780 379',
            description: 'cas confirmés',
            variation: ['+', 3292],
            type: 'warning',
          }}
        />
        <StatistiqueCard
          {...{
            number: 17829181,
            description: 'premières doses injectées (au total)',
            type: 'success',
          }}
        />
        <StatistiqueCard
          {...{
            number: '106 684',
            description: 'nouveaux patients hospitalisés',
            variation: ['+', 292],
            type: 'danger',
          }}
        />
      </Stats>
    </div>
  );
};
