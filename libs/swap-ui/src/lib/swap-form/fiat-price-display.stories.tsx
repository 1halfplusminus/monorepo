import { Meta, Story } from '@storybook/react';
import { FiatPriceDisplay, FiatPriceDisplayProps } from './fiat-price-display';
import { option as O } from 'fp-ts';
import { ETH } from '../__mocks__/tokens';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useFiatPrice, UseFiatPriceProps } from '../hooks/useFiatPrice';
import { useEffect } from 'react';

const Wrapper = styled.div`
  ${tw`w-28`}
`;
export default {
  component: FiatPriceDisplay,
  title: 'SwapForm/Components/FiatPriceDisplay',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <Wrapper>
        <Story />
      </Wrapper>
    ),
  ],
} as Meta;

export const primary: Story<FiatPriceDisplayProps> = (props) => (
  <FiatPriceDisplay {...props} />
);

primary.args = {
  price: O.some(5),
  token: O.some(ETH),
  fiatSymbol: '$',
  amount: O.some(5),
};

export const WithState: Story<FiatPriceDisplayProps & UseFiatPriceProps> = ({
  fetchPrice,
  fiatSymbol,
  ...props
}) => {
  const { getPrice, fetch } = useFiatPrice({ fetchPrice, fiatSymbol });
  useEffect(() => {
    fetch([props.token]);
  }, []);
  return (
    <FiatPriceDisplay
      {...props}
      fiatSymbol={fiatSymbol}
      price={getPrice(props.token)}
    />
  );
};

WithState.args = {
  price: O.some(5),
  token: O.some(ETH),
  fiatSymbol: '$',
  fetchPrice: async () => '2500',
  amount: O.some(5),
};
