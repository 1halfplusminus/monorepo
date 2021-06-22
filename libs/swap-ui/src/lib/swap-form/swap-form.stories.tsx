import React, { useEffect } from 'react';
import { SwapForm, SwapFormProps } from './swap-form';
import { Meta, Story } from '@storybook/react';
import { none, some } from 'fp-ts/lib/Option';
import { DAI, ETH, USDC } from '../__mocks__/tokens';
import { useSearch, useSelectToken } from '../hooks/tokenList';
import {
  useTokenValues,
  getOrElse,
  modifyAtTaskEither,
} from '../hooks/useTokenValue';
import FormSubmitButton from './form-submit-button';
import {
  fetchBalance,
  fetchOptionTokenBalance,
  useWallets,
  Web3WalletProvider,
} from '../hooks/useWallet';
import { pipe } from 'fp-ts/function';
import * as options from 'fp-ts/Option';
import { Option } from 'fp-ts/Option';
import { Token } from '../types';

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

const valuesByToken = some(new Map());

const ConnectedForm = (props: SwapFormProps) => {
  const { library, connected, isConnected, connect, account } = useWallets();
  const { filteredTokenList, search } = useSearch(props.tokens);
  const { isSelected, first, last, selectAtIndex, inverse } = useSelectToken({
    commonlyUsed: some([some(ETH)]),
    tokens: filteredTokenList,
    selected: some([none, none]),
  });
  const { lookup, modifyAt } = useTokenValues({
    valueByToken: some(new Map()),
  });
  const sold = useTokenValues({
    valueByToken: valuesByToken,
  });
  useEffect(() => {
    console.log(first);
    fetchOptionTokenBalance(library)(first, account).then((r) => {
      sold.modifyAt(first, r);
    });
    /* const r = pipe(
      library,
      options.chain((p) =>
        pipe(
          first,
          options.map((token) =>
            modifyAtTaskEither(
              fetchBalance(p)(token, account),
              sold.modifyAt,
              first
            )()
          )
        )
      ) */
  }, [first, account, library]);
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
          pipe(some(token), (token) =>
            fetchOptionTokenBalance(library)(token, account).then((r) => {
              sold.modifyAt(token, r);
            })
          );
        },
        value: getOrElse(lookup(first)),
        onValueChange: (t, v) => {
          modifyAt(t, v);
        },
        sold: sold.lookup(first),
      }}
      inputB={{
        isSelected,
        selected: last,
        onSelected: (token) => {
          selectAtIndex(token, 1);
          pipe(some(token), (token) =>
            fetchOptionTokenBalance(library)(token, account).then((r) => {
              sold.modifyAt(token, r);
            })
          );
        },
        value: getOrElse(lookup(last)),
        onValueChange: (t, v) => {
          modifyAt(t, v);
        },
        sold: sold.lookup(last),
      }}
    >
      <FormSubmitButton
        loading={some(false)}
        connectButton={{ isConnected: isConnected, connect: connect }}
        tokens={none}
        connected={connected}
        tokenA={some({
          token: first,
          sold: sold.lookup(first),
          amount: lookup(first),
        })}
        tokenB={some({
          token: last,
          sold: sold.lookup(last),
          amount: lookup(last),
        })}
      />
    </SwapForm>
  );
};
export const WithState: Story<SwapFormProps> = (props) => {
  return (
    <Web3WalletProvider>
      <ConnectedForm {...props} />
    </Web3WalletProvider>
  );
};
WithState.args = {
  tokens: tokens,
  commonBases,
};
