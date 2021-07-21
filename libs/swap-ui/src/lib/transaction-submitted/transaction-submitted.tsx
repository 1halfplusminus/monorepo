import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Button from 'antd/lib/button/button';
import { Token } from '../types';
import type { Option } from 'fp-ts/Option';
import { Maybe } from '../../core/maybe/maybe';
import TransactionSubmittedIcon from '../icon/transaction-submitted';
const Col = styled.div`
  ${tw`flex flex-col gap-3 bg-gray-800  pb-3 pt-6`}
`;

const Row = styled.div`
  ${tw`flex flex-row  justify-center`}
`;

const Title = styled.div`
  ${tw`text-white  text-lg`}
`;

const Link = styled.a`
  ${tw`text-blue-400 `}
`;

const StyledIcon = styled(TransactionSubmittedIcon)`
  ${tw`h-16 mb-6`}
`;

const AddToProviderButton = styled(Button)`
  ${tw`rounded bg-blue-600 bg-opacity-40 border-0 text-blue-300`}
`;

export interface TransactionSubmittedProps {
  tokenA: Option<Token>;
  provider: Option<string>;
  onClickExplorer: () => void;
}

export const TransactionSubmitted = ({
  tokenA,
  provider,
  onClickExplorer,
}: TransactionSubmittedProps) => (
  <Col>
    <Row>
      <StyledIcon />
    </Row>
    <Row>
      <Title>Transaction Submitted </Title>
    </Row>
    <Row>
      <Link onClick={onClickExplorer}>View On Explorer </Link>
    </Row>
    <Maybe option={tokenA}>
      {(tokenA) => (
        <Maybe option={provider}>
          {(provider) => (
            <Row>
              <AddToProviderButton>
                Add {tokenA.name} to {provider}{' '}
              </AddToProviderButton>
            </Row>
          )}
        </Maybe>
      )}
    </Maybe>
  </Col>
);
