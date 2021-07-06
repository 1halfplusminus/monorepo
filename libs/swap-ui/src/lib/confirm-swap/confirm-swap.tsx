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
import { surface } from '../core/classes';
import { TokenRoutes } from '../core/TokenRoutes';
import { array as A } from 'fp-ts';
// eslint-disable-next-line @typescript-eslint/no-empty-interface

type UsedSwapInputProps = Pick<SwapInputProps, 'selected' | 'value'>;

export interface ConfirmSwapProps {
  tokenA: UsedSwapInputProps;
  tokenB: UsedSwapInputProps;
  rate: Option<BigNumberish>;
  liquidityProviderFee: Option<BigNumberish>;
  minimumReceived: Option<BigNumberish>;
  slippageTolerance: number;
  onRateClick: () => void;
}

const Col = styled.div`
  ${tw`flex flex-col gap-1 bg-gray-900`}
`;
const Row = styled.div`
  ${tw`flex flex-row gap-1 justify-between px-2`}
`;
const Text = styled.div`
  ${tw`text-white text-sm`}
`;

const Surface = styled.div`
  ${surface}
  ${tw`mx-2 text-white`}
`;

export const ConfirmSwap = ({
  tokenA,
  tokenB,
  rate,
  liquidityProviderFee,
  onRateClick = constVoid,
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
    <Maybe option={tokenA.selected}>
      {(tokenA) => (
        <Maybe option={tokenB.selected}>
          {(tokenB) => (
            <Surface>
              <Maybe option={liquidityProviderFee}>
                {(liquidityProviderFee) => (
                  <Row>
                    <Text>Liquidity Provider Fee</Text>
                    <Text>
                      {liquidityProviderFee} {tokenA.name}
                    </Text>
                  </Row>
                )}
              </Maybe>

              <Row>
                <Text>Route</Text>
                <TokenRoutes
                  tokens={O.some(
                    pipe(
                      [tokenA, tokenB],
                      A.map((a) => O.some(a))
                    )
                  )}
                ></TokenRoutes>
              </Row>
              <Row>
                <Text>Price Impact</Text>
                <Text>0.00%</Text>
              </Row>
              <Row>
                <Text>Minimum received</Text>
                <Text>1.40502 DAI</Text>
              </Row>
              <Row>
                <Text>Slippage tolerance</Text>
                <Text>0.50%</Text>
              </Row>
            </Surface>
          )}
        </Maybe>
      )}
    </Maybe>
  </Col>
);

export default ConfirmSwap;
