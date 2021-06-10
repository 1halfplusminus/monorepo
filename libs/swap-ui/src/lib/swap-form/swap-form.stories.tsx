import React from 'react';
import { SwapForm, SwapFormProps } from './swap-form';
import { Meta, Story } from '@storybook/react';
import { none, some } from 'fp-ts/lib/Option';
import { DAI, ETH, USDC } from '../__mocks__/tokens';
import { useSearch, useSelectToken } from '../hooks/tokenList';
import { useTokenValues, getOrElse } from '../hooks/useTokenValue';
import FormSubmitButton from './form-submit-button';

export default {
  component: SwapForm,
  title: 'SwapForm/Form',
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as Meta;

const commonBases = some([some(ETH), some(DAI)]);
const tokens = some([some(ETH), some(DAI), some(USDC)]);

export const primary: Story<SwapFormProps> = (props) => {
  return <SwapForm {...props} />;
};

export const WithState: Story<SwapFormProps> = (props) => {
  const { filteredTokenList, search } = useSearch(props.tokens);
  const { isSelected, first, last, selectAtIndex, inverse } = useSelectToken({
    commonlyUsed: some([some(DAI)]),
    tokens: filteredTokenList,
    selected: some([none, none]),
  });
  const { lookup, modifyAt } = useTokenValues({
    valueByToken: some(new Map()),
  });
  return (
    <SwapForm
      {...props}
      tokens={filteredTokenList}
      onSearch={search}
      onInserse={inverse}
      inputA={{
        isSelected,
        selected: first,
        onSelected: (token) => {
          selectAtIndex(token, 0);
        },
        value: getOrElse(lookup(first)),
        onValueChange: (t, v) => {
          modifyAt(t, v);
        },
      }}
      inputB={{
        isSelected,
        selected: last,
        onSelected: (token) => {
          selectAtIndex(token, 1);
        },
        value: getOrElse(lookup(last)),
        onValueChange: (t, v) => {
          modifyAt(t, v);
        },
      }}
    >
      <FormSubmitButton tokens={none} connected={none} />
    </SwapForm>
  );
};
WithState.args = {
  tokens: tokens,
  commonBases,
};
