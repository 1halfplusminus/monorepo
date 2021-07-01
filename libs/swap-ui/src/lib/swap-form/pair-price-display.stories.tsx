import React from 'react';
import { Meta, Story } from '@storybook/react';
import PairPriceDisplay from './pair-price-display';
import { PairPriceDisplayProps } from './pair-price-display';
import { some } from 'fp-ts/Option';
import { DAI, ETH } from '../__mocks__/tokens';
import styled from 'styled-components';
import tw from 'twin.macro';

const Wrapper = styled.div`
  ${tw`flex w-80`}
`;
export default {
  component: PairPriceDisplay,
  title: 'SwapForm/Components/PairPriceDisplay',
  argTypes: { onClick: { action: 'clicked' } },
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Component) => (
      <Wrapper>
        <Component />
      </Wrapper>
    ),
  ],
} as Meta;

export const primary: Story<PairPriceDisplayProps> = (props) => (
  <PairPriceDisplay {...props} />
);

primary.args = {
  tokenA: some(ETH),
  tokenB: some(DAI),
  rate: some(0.001899),
};
export const inversed: Story<PairPriceDisplayProps> = (props) => (
  <PairPriceDisplay {...props} />
);
inversed.args = {
  tokenA: some(ETH),
  tokenB: some(DAI),
  rate: some(0.001899),
  inversed: true,
};
