import { Meta, Story } from '@storybook/react';
import React from 'react';
import { css } from 'styled-components';
import tw from 'twin.macro';
import StatistiqueCard from './statistique-card';
import { Stats, StatsProps } from './stats';

export default {
  component: Stats,
  title: 'Covid/Stats',
  argTypes: { parameters: { actions: { argTypesRegex: '^on.*' } } },
} as Meta;

export const primary: Story<StatsProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onClick = () => {};
  return (
    <div
      css={css`
        ${tw`w-96 h-80`}
      `}
    >
      <Stats {...props}>
        <StatistiqueCard
          {...{
            value: '5 780 379',
            description: 'cas confirmés',
            variation: ['+', 3292],
            type: 'cases',
            onClick,
          }}
        />
        <StatistiqueCard
          {...{
            value: 17829181,
            description: 'cas guéri',
            type: 'recovered',
            onClick,
          }}
        />
        <StatistiqueCard
          {...{
            value: '106 684',
            description: 'cumul des décès',
            variation: ['+', 292],
            type: 'deaths',
            onClick,
          }}
        />
      </Stats>
    </div>
  );
};
