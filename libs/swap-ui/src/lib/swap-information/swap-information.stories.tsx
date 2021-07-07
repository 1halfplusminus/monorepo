import { Meta, Story } from '@storybook/react';
import { SwapInformation, SwapInformationProps } from './swap-information';
import { some } from 'fp-ts/Option';
import { DAI, ETH } from '../__mocks__/tokens';
import styled from 'styled-components';
import tw from 'twin.macro';

const Wrapper = styled.div`
  ${tw`w-96`}
`;

export default {
  component: SwapInformation,
  title: 'SwapInformation',
  decorators: [
    (Story) => (
      <Wrapper>
        <Story />
      </Wrapper>
    ),
  ],
} as Meta;

export const primary: Story<SwapInformationProps> = (props) => (
  <SwapInformation {...props} />
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
  liquidityProviderFee: some('0.000007977'),
  priceImpact: some(0.0),
  minimumReceived: some('55246.1'),
  slippageTolerance: 0.5,
};
