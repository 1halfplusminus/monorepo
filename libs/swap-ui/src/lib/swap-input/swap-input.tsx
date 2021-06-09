import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import TokenSelect, { TokenSelectProps } from '../token-select/token-select';
import { Token } from '../types';
import * as options from 'fp-ts/Option';
import type { Option } from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { isEmpty } from 'fp-ts/string';
/* eslint-disable-next-line */
export type SwapInputProps = TokenSelectProps & {
  onValueChange: (token: Option<Token>, value: string) => void;
  value: string;
};

const StyledSwapInputWrapper = styled.div`
  ${tw`
  text-blue-700 h-16 bg-gray-700 flex flex-row p-4 rounded-md border-gray-300 border-2`}
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

export function SwapInput({
  value = '0.0',
  onValueChange,
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
      <TokenSelect {...props} />
      <NumberFormat
        allowNegative={false}
        value={value}
        onValueChange={handleValueChange}
        disabled={
          props.selected &&
          pipe(
            props.selected,
            options.fold(
              () => true,
              () => false
            )
          )
        }
      />
    </StyledSwapInputWrapper>
  );
}

export default SwapInput;
