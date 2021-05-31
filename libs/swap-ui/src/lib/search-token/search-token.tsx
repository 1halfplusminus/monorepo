import React from 'react';
import { Avatar, Input, List, Space, Tag } from 'antd';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';
import { Tooltip } from 'antd';
import { Token } from '../types';
import TokenSymbol from '../token-symbol/token-symbol';
import TokenList, { TokenListItem } from '../token-list/token-list';

/* eslint-disable-next-line */
export interface SearchTokenProps {
  commonBases?: Token[];
  tokens: Token[];
  onSelected?: (token: Token) => void;
}

const StyledSearchToken = styled.div`
  ${tw`flex gap-4 flex-col`}
`;

const StyledSearch = styled(Input)`
  ${tw`text-blue-700 h-16 bg-gray-700 flex-row p-4 rounded-md`}
  border: none;
  height: 100%;
  width: 100%;
  ${tw`text-2xl text-gray-500`}
`;

const Title = styled.h2`
  ${tw`text-xl text-white inline-flex flex-row items-center  gap-2`}
`;

const QuestionMark = styled.span`
  ${tw`rounded-xl bg-gray-900  inline-block text-center px-2 text-sm  cursor-pointer`}
  ::after {
    content: '?';
  }
`;

const TokenTags = styled.section`
  ${tw`flex flex-row`}
  .ant-tag {
    ${tw`inline-flex flex-row  bg-gray-900 p-2 gap-2 border-0 text-white text-lg items-center`}
  }
`;
export interface TokenTag {
  token: Token;
}

const TokenTag = ({ token }: TokenTag) => (
  <Tag key={token.name}>
    <TokenSymbol src={token.symbol} />
    {token.name}
  </Tag>
);

export function SearchToken({
  commonBases = [],
  tokens,
  onSelected,
}: SearchTokenProps) {
  const handleClick = (token: Token) => () => {
    if (onSelected) {
      onSelected(token);
    }
  };
  return (
    <StyledSearchToken>
      <Space direction="vertical">
        <StyledSearch placeholder="Search name" />
      </Space>
      <Title>
        Common base
        <Tooltip title="These token are commenly paired with another token">
          <QuestionMark />
        </Tooltip>
      </Title>
      <TokenTags>
        {commonBases.map((t) => (
          <TokenTag token={t} />
        ))}
      </TokenTags>
      <TokenList
        itemLayout="horizontal"
        dataSource={tokens}
        renderItem={(item: Token) => (
          <TokenListItem onClick={handleClick(item)} token={item} />
        )}
      />
    </StyledSearchToken>
  );
}

export default SearchToken;
