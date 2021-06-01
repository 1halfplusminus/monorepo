import { Meta, Story } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { DAI, ETH, USDC } from '../__mocks__/tokens';
import { SearchToken, SearchTokenProps } from './search-token';
import { useSelectToken } from '../hooks/tokenList';
import { none, some } from 'fp-ts/lib/Option';
export default {
  component: SearchToken,
  title: 'SearchToken',
} as Meta;

const Wrapper = styled.div`
  ${tw`p-3 h-1/2 w-1/2 bg-gray-800 flex flex-col justify-center justify-items-center`}
`;

export const primary: Story<SearchTokenProps> = (props) => {
  return (
    <Wrapper>
      <SearchToken {...props} />
    </Wrapper>
  );
};

primary.args = {
  commonBases: some([ETH]),
  tokens: [ETH],
  isSelected: () => false,
};

export const WithState: Story<SearchTokenProps> = (props) => {
  const { isSelected, select } = useSelectToken({
    commonlyUsed: props.commonBases,
    tokens: props.tokens,
    selected: none,
  });
  return (
    <Wrapper>
      <SearchToken onSelected={select} {...props} isSelected={isSelected} />
    </Wrapper>
  );
};

WithState.args = {
  commonBases: some([ETH]),
  tokens: [ETH, DAI, USDC],
};
