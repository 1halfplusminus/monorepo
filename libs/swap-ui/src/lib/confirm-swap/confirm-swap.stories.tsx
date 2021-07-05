import { Meta, Story } from '@storybook/react';
import { DAI, ETH } from '../__mocks__/tokens';
import { ConfirmSwap, ConfirmSwapProps } from './confirm-swap';
import { some } from 'fp-ts/Option';
export default {
  component: ConfirmSwap,
  title: 'ConfirmSwap',
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    backgrounds: { default: 'black' },
  },
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
};
