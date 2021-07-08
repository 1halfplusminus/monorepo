import React from 'react';
import { option as O, task as T } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { BigNumberish } from 'ethers';
import type { Option } from 'fp-ts/Option';
import Maybe from '../../core/maybe/maybe';
import { TokenRoutes } from '../core/TokenRoutes';
import { array as A } from 'fp-ts';
import { SwapInputProps } from '../swap-input/swap-input';
import styled from 'styled-components';
import { surface } from '../core/classes';
import tw from 'twin.macro';

type UsedSwapInputProps = Pick<SwapInputProps, 'selected' | 'value'>;

const Surface = styled.div`
  ${surface}
  ${tw`mx-2 text-white`}
`;

const Row = styled.div`
  ${tw`flex flex-row gap-1 justify-between px-2`}
`;
const Text = styled.div`
  ${tw`text-white text-sm`}
`;

export const TooltipWrapper = styled.div`
  ${tw`w-96 right-36 relative`}
`;
export interface SwapInformationProps {
  tokenA: UsedSwapInputProps;
  tokenB: UsedSwapInputProps;
  liquidityProviderFee: Option<BigNumberish>;
  minimumReceived: Option<BigNumberish>;
  priceImpact: Option<BigNumberish>;
  slippageTolerance: number;
}

export const SwapInformation = ({
  tokenA,
  tokenB,
  liquidityProviderFee,
  minimumReceived,
  priceImpact,
  slippageTolerance,
}: SwapInformationProps) => (
  <Maybe option={tokenA.selected}>
    {(tokenA) => (
      <Maybe option={tokenB.selected}>
        {(tokenB) => (
          <Surface>
            <Maybe option={liquidityProviderFee}>
              {(liquidityProviderFee) => (
                <Row>
                  <Text>Liquidity Provider Fee </Text>
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
            <Maybe option={priceImpact}>
              {(priceImpact) => (
                <Row>
                  <Text>Price Impact </Text>
                  <Text>{priceImpact}%</Text>
                </Row>
              )}
            </Maybe>
            <Maybe option={minimumReceived}>
              {(minimumReceived) => (
                <Row>
                  <Text>Minimum received </Text>
                  <Text>
                    {minimumReceived} {tokenB.name}
                  </Text>
                </Row>
              )}
            </Maybe>
            <Row>
              <Text>Slippage tolerance </Text>
              <Text>{slippageTolerance}%</Text>
            </Row>
          </Surface>
        )}
      </Maybe>
    )}
  </Maybe>
);
