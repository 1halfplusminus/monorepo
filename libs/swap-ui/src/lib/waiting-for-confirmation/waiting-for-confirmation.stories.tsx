import { Meta, Story } from '@storybook/react';
import {
  WaitingForConfirmationSwap,
  WaitingForConfirmationSwapProps,
} from './waiting-for-confirmation';
import { option as O } from 'fp-ts';
import { ETH, DAI } from '../__mocks__/tokens';
export default {
  component: WaitingForConfirmationSwap,
  title: 'WaitingForConfirmation',
} as Meta;

export const primary: Story<WaitingForConfirmationSwapProps> = (props) => (
  <WaitingForConfirmationSwap {...props} />
);

primary.args = {
  tokenA: O.some(ETH),
  tokenB: O.some(DAI),
  valueA: O.some('10000'),
  valueB: O.some('5000'),
};
