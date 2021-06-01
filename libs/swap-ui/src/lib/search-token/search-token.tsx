import React from 'react';
import { Input, Space, Tag } from 'antd';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Tooltip } from 'antd';
import { Token } from '../types';
import TokenSymbol from '../token-symbol/token-symbol';
import TokenList, { TokenListItem } from '../token-list/token-list';
import { none, Option } from 'fp-ts/Option';
import Maybe from '../../core/maybe/maybe';

/* eslint-disable-next-line */
export interface SearchTokenProps {
  commonBases: Option<Token[]>;
  tokens: Token[];
  onSelected?: (token: Token) => void;
  isSelected: (token: Token) => boolean;
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
  }
`;
export interface TokenTag {
  token: Token;
  selected?: boolean;
}

const StyledTag = styled(Tag)<{ selected?: boolean }>`
  ${tw`inline-flex flex-row  bg-gray-900 p-2 gap-2 border-0 text-white text-lg items-center cursor-pointer`}
  ${({ selected }) =>
    selected &&
    tw`
    text-gray-400 bg-gray-400 bg-opacity-10
  `}
`;
const TokenTag = ({ token, selected }: TokenTag) => (
  <StyledTag selected={selected} key={token.name}>
    <TokenSymbol src={token.symbol} />
    {token.name}
  </StyledTag>
);

export function SearchToken({
  commonBases = none,
  tokens,
  onSelected,
  isSelected,
}: SearchTokenProps) {
  const handleClick = (token: Token) => () => {
    if (onSelected) {
      console.log('here');
      onSelected(token);
    }
  };
  return (
    <StyledSearchToken>
      <Space direction="vertical">
        <StyledSearch placeholder="Search name" />
      </Space>
      <Maybe option={commonBases}>
        {(commonBases) => (
          <>
            <Title>
              Common base
              <Tooltip title="These token are commenly paired with another token">
                <QuestionMark />
              </Tooltip>
            </Title>
            <TokenTags>
              {commonBases.map((t) => (
                <TokenTag key={t.address} selected={isSelected(t)} token={t} />
              ))}
            </TokenTags>
          </>
        )}
      </Maybe>

      <TokenList
        itemLayout="horizontal"
        dataSource={tokens}
        renderItem={(item: Token) => (
          <TokenListItem
            selected={isSelected(item)}
            onClick={handleClick(item)}
            token={item}
          />
        )}
      />
    </StyledSearchToken>
  );
}

export default SearchToken;
