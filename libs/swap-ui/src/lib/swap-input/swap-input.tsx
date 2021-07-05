import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import TokenSelect, { TokenSelectProps } from '../token-select/token-select';
import { Token } from '../types';
import * as options from 'fp-ts/Option';
import type { Option } from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { isEmpty } from 'fp-ts/string';
import Maybe from '../../core/maybe/maybe';
import { BigNumberish, BigNumber } from 'ethers';
import { FiatPriceDisplay } from '../swap-form/fiat-price-display';
import { css } from 'styled-components';

/* eslint-disable-next-line */
export type SwapInputProps = TokenSelectProps & {
  onValueChange: (token: Option<Token>, value: string) => void;
  value: string;
  sold: Option<BigNumberish>;
  fiatPrice?: Option<BigNumberish>;
  disabled?: boolean;
};

const StyledSwapInputWrapper = styled.div`
  ${tw`
  text-blue-700  bg-gray-700 flex flex-col p-4 rounded-md border-gray-300 border-2 gap-2`}
  input {
    background-color: transparent;
    border: none;
    text-align: right;
    ${tw`text-2xl text-gray-500`}
    position: relative;
    width: 0;
    flex: 1 1 auto;
  }
`;
const Col = styled.div`
  ${tw`inline-flex flex-col`}
`;
const Row = styled.div`
  ${tw`flex flex-row flex-1`}
`;

const SoldDisplay = styled(
  ({ token, sold, ...rest }: { token: Token; sold: BigNumberish }) => (
    <div {...rest} title={'sold-' + token.name}>
      Solde: {sold.toString()} {token.name}{' '}
    </div>
  )
)`
  ${tw`text-white text-base`}
`;

const isSelected = flow(
  options.fromNullable,
  options.fold(
    () => true,
    () => false
  )
);

export function SwapInput({
  value = '0.0',
  onValueChange,
  sold,
  fiatPrice = options.none,
  disabled,
  ...props
}: SwapInputProps) {
  const handleValueChange = ({ value }: NumberFormatValues) => {
    pipe(
      onValueChange,
      options.fromNullable,
      options.chain((callback) =>
        pipe(
          value,
          options.fromPredicate((v) => !isEmpty(v) && v !== '0.0'),
          options.map((value) => callback(props.selected, value))
        )
      )
    );
  };

  return (
    <StyledSwapInputWrapper>
      <Row>
        <TokenSelect disabled={disabled} {...props} />
        <NumberFormat
          allowNegative={false}
          value={value}
          onValueChange={handleValueChange}
          disabled={isSelected(props.selected) || disabled}
        />
      </Row>
      <Row
        css={[
          sold && options.isSome(sold) ? tw`justify-between` : tw`justify-end`,
        ]}
      >
        <Maybe option={props.selected}>
          {(token) => (
            <>
              <Maybe option={sold}>
                {(sold) => <SoldDisplay token={token} sold={sold} />}
              </Maybe>
              <FiatPriceDisplay
                token={options.some(token)}
                price={fiatPrice}
                amount={options.tryCatch(() => BigNumber.from(value))}
              />
            </>
          )}
        </Maybe>
      </Row>
    </StyledSwapInputWrapper>
  );
}

export default SwapInput;
