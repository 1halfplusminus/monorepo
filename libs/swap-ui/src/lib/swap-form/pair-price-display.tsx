import react from 'react';
import * as options from 'fp-ts/Option';
import type { Option } from 'fp-ts/Option';
import { Token } from '../types';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Maybe } from '../../core/maybe/maybe';
import { BigNumber, BigNumberish, utils } from 'ethers';
import { pipe } from 'fp-ts/function';
import { inverseRate } from '../core/rate';
export interface PairPriceDisplayProps {
  tokenA: Option<Token>;
  tokenB: Option<Token>;
  rate: Option<BigNumberish>;
  inversed?: boolean;
  onClick?: () => void;
}

export const StyledWrapper = styled.div`
  ${tw`flex flex-row gap-1 text-white justify-end cursor-pointer`}
`;

export const PairPriceDisplay = ({
  tokenA,
  tokenB,
  rate,
  inversed = false,
  onClick,
}: PairPriceDisplayProps) => {
  return (
    <StyledWrapper onClick={onClick}>
      <MaybeTokenRate
        tokenA={!inversed ? tokenA : tokenB}
        tokenB={!inversed ? tokenB : tokenA}
        rate={pipe(
          rate,
          options.map((rate) => (!inversed ? rate : inverseRate(rate)))
        )}
      ></MaybeTokenRate>
    </StyledWrapper>
  );
};

const MaybeTokenRate = ({
  tokenA,
  tokenB,
  rate,
}: Omit<PairPriceDisplayProps, 'inversed'>) => (
  <Maybe option={tokenA}>
    {(tokenA) => (
      <Maybe option={tokenB}>
        {(tokenB) => (
          <Maybe option={rate}>
            {(rate) => (
              <>
                1 {tokenB.name} = {rate} {tokenA.name}
              </>
            )}
          </Maybe>
        )}
      </Maybe>
    )}
  </Maybe>
);
export default PairPriceDisplay;
