import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import SwapForm from '../swap-form/swap-form';

import { option as O, task as T } from 'fp-ts';
import { SwapInputProps } from '../swap-input/swap-input';
import { constFalse, constVoid, pipe } from 'fp-ts/function';
import { BigNumberish } from 'ethers';
import type { Option } from 'fp-ts/Option';
import Maybe from '../../core/maybe/maybe';
import PairPriceDisplay from '../swap-form/pair-price-display';
import { SwapInformation } from '../swap-information/swap-information';
import { TokenList } from '../hooks/tokenList';

type UsedSwapInputProps = Pick<SwapInputProps, 'selected' | 'value'>;

export interface ConfirmSwapProps {
  tokenA: UsedSwapInputProps;
  tokenB: UsedSwapInputProps;
  rate: Option<BigNumberish>;
  liquidityProviderFee: Option<BigNumberish>;
  minimumReceived: Option<BigNumberish>;
  priceImpact: Option<BigNumberish>;
  routes: TokenList;
  slippageTolerance: number;
  onRateClick: () => void;
}

const Col = styled.div`
  ${tw`flex flex-col gap-1 bg-gray-900 py-3`}
`;
const Row = styled.div`
  ${tw`flex flex-row gap-1 justify-between px-2`}
`;
const Text = styled.div`
  ${tw`text-white text-sm`}
`;

export const ConfirmSwap = ({
  tokenA,
  tokenB,
  rate,
  liquidityProviderFee,
  minimumReceived,
  priceImpact,
  slippageTolerance,
  onRateClick = constVoid,
  routes,
}: ConfirmSwapProps) => (
  <Col>
    <SwapForm
      title={O.none}
      tokens={O.none}
      commonBases={O.none}
      onSearch={T.never}
      onInverse={T.never}
      disabled={true}
      inputA={{
        ...tokenA,
        sold: O.none,
        isSelected: constFalse,
        onValueChange: constVoid,
        onSelected: constVoid,
      }}
      inputB={{
        ...tokenB,
        sold: O.none,
        isSelected: constFalse,
        onValueChange: constVoid,
        onSelected: constVoid,
      }}
    />
    <Maybe option={rate}>
      {(rate) => (
        <Row>
          <Text>Price</Text>
          <PairPriceDisplay
            rate={O.some(rate)}
            tokenA={tokenA.selected}
            tokenB={tokenB.selected}
            onClick={onRateClick}
          />
        </Row>
      )}
    </Maybe>
    <SwapInformation
      tokenB={tokenB}
      tokenA={tokenA}
      liquidityProviderFee={liquidityProviderFee}
      minimumReceived={minimumReceived}
      priceImpact={priceImpact}
      slippageTolerance={slippageTolerance}
      routes={routes}
    />
    <Maybe option={minimumReceived}>
      {(minimumReceived) => (
        <Row>
          <Text>
            Output is estimated. You will receive at least {minimumReceived} DAI
            or the transaction will revert.
          </Text>
        </Row>
      )}
    </Maybe>
  </Col>
);

export default ConfirmSwap;
