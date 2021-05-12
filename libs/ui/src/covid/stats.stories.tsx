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
            value: '5 780 379',
            description: 'cas confirmés',
            variation: ['+', 3292],
            type: 'cases',
          }}
        />
        <StatistiqueCard
          {...{
            value: 17829181,
            description: 'cas guéri',
            type: 'recovered',
          }}
        />
        <StatistiqueCard
          {...{
            value: '106 684',
            description: 'cumul des décès',
            variation: ['+', 292],
            type: 'deaths',
          }}
        />
      </Stats>
    </div>
  );
};
