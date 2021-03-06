import { Meta, Story } from '@storybook/react';
import { DAI, ETH } from '../__mocks__/tokens';
import { ConfirmSwap, ConfirmSwapProps } from './confirm-swap';
import { some } from 'fp-ts/Option';
import styled from 'styled-components';
import tw from 'twin.macro';

const Wrapper = styled.div`
  ${tw`w-96`}
`;

export default {
  component: ConfirmSwap,
  title: 'ConfirmSwap',
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    backgrounds: { default: 'black' },
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <Story />
      </Wrapper>
    ),
  ],
} as Meta;

export const primary: Story<ConfirmSwapProps> = (props) => (
  <ConfirmSwap {...props} />
);
primary.args = {
  tokenA: {
    selected: some(ETH),
    value: '100',
  },
  tokenB: {
    selected: some(DAI),
    value: '100',
  },
  rate: some('0.001883'),
  liquidityProviderFee: some('0.000007977'),
  priceImpact: some(0.0),
  minimumReceived: some('55246.1'),
  slippageTolerance: 0.5,
};
