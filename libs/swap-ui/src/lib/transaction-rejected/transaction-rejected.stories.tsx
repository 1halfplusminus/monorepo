import { Meta, Story } from '@storybook/react';
import {
  TransactionRejected,
  TransactionRejectedProps,
} from './transaction-rejected';
export default {
  component: TransactionRejected,
  title: 'TransactionRejected',
} as Meta;

export const primary: Story<TransactionRejectedProps> = () => (
  <TransactionRejected />
);
