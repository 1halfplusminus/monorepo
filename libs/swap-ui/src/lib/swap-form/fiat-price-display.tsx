import type { Option } from 'fp-ts/Option';
import { Token } from '../types';
import type { BigNumberish } from 'ethers';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Maybe } from '../../core/maybe/maybe';
import { BigNumber } from 'ethers';
export interface FiatPriceDisplayProps {
  token: Option<Token>;
  price: Option<BigNumberish>;
  sold: Option<BigNumberish>;
  fiatSymbol?: string;
}

export const StyledWrapper = styled.div`
  ${tw`flex flex-row gap-1 text-white justify-end cursor-pointer`}
`;

export const FiatPriceDisplay = ({
  sold,
  token,
  price,
  fiatSymbol = '$',
}: FiatPriceDisplayProps) => (
  <Maybe option={token}>
    {(token) => (
      <Maybe option={price}>
        {(price) => (
          <Maybe option={sold}>
            {(sold) => (
              <StyledWrapper>
                ~{fiatSymbol} {BigNumber.from(sold).mul(price).toString()}
              </StyledWrapper>
            )}
          </Maybe>
        )}
      </Maybe>
    )}
  </Maybe>
);
