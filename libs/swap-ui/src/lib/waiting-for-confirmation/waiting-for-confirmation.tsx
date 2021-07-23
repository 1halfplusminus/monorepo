import React, { ReactNode } from 'react';
import { Token } from '../types/index';
import type { Option } from 'fp-ts/Option';
import { BigNumberish } from 'ethers';
import Maybe from '../../core/maybe/maybe';
import styled, { keyframes } from 'styled-components';
import tw from 'twin.macro';
import Loading from '../icon/loading';

export interface WaitingForConfirmationSwapProps {
  tokenA: Option<Token>;
  tokenB: Option<Token>;
  valueA: Option<BigNumberish>;
  valueB: Option<BigNumberish>;
}
export type MaybeWaitingForConfirmationSwapProps = WaitingForConfirmationSwapProps & {
  children: (
    tokenA: Token,
    tokenB: Token,
    valueA: BigNumberish,
    valuevalueB: BigNumberish
  ) => ReactNode;
};

const Col = styled.div`
  ${tw`flex flex-col gap-2 bg-gray-800 p-3`}
`;
const Row = styled.div`
  ${tw`flex flex-row  justify-center`}
`;

const Title = styled.div`
  ${tw`text-lg text-white`}
`;
const Text = styled.div`
  ${tw`text-sm text-white`}
`;
const SubText = styled.div`
  ${tw`text-sm text-gray-500 italic`}
`;
export const MaybeWaitingForConfirmationSwap = ({
  tokenA,
  tokenB,
  valueA,
  valueB,
  children,
}: MaybeWaitingForConfirmationSwapProps) => (
  <Maybe option={tokenA}>
    {(tokenA) => (
      <Maybe option={tokenB}>
        {(tokenB) => (
          <Maybe option={valueA}>
            {(valueA) => (
              <Maybe option={valueB}>
                {(valueB) => children(tokenA, tokenB, valueA, valueB)}
              </Maybe>
            )}
          </Maybe>
        )}
      </Maybe>
    )}
  </Maybe>
);
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;
const StyledLoading = styled(Loading)`
  ${tw`h-16 text-blue-500 fill-current`}
  animation: ${rotate} 2s linear infinite;
`;

export const WaitingForConfirmationSwap = ({
  tokenA,
  tokenB,
  valueA,
  valueB,
}: WaitingForConfirmationSwapProps) => {
  return (
    <MaybeWaitingForConfirmationSwap
      tokenA={tokenA}
      tokenB={tokenB}
      valueA={valueA}
      valueB={valueB}
    >
      {(tokenA, tokenB, valueA, valueB) => (
        <Col>
          <Row>
            <StyledLoading />
          </Row>
          <Row>
            <Title> Waiting For Confirmation</Title>
          </Row>
          <Row>
            <Text>
              Swapping {valueA} {tokenA.name} for {valueB} {tokenB.name}
            </Text>
          </Row>
          <Row>
            <Text>
              <SubText>Confirm this transaction in your wallet</SubText>
            </Text>
          </Row>
        </Col>
      )}
    </MaybeWaitingForConfirmationSwap>
  );
};
