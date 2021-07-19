import { some } from '.pnpm/fp-ts@2.10.5/node_modules/fp-ts/lib/Option';
import { Meta, Story } from '@storybook/react';
import { ETH } from '../__mocks__/tokens';
import {
  TransactionSubmitted,
  TransactionSubmittedProps,
} from './transaction-submitted';

export default {
  component: TransactionSubmitted,
  title: 'TransactionSubmitted',
} as Meta;

export const primary: Story<TransactionSubmittedProps> = (props) => (
  <TransactionSubmitted {...props} />
);

primary.args = {
  tokenA: some(ETH),
  provider: some('Metamask'),
};
