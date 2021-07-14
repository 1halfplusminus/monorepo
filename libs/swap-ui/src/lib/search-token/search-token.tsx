import React, { ChangeEvent } from 'react';
import { Input, Space, Tag } from 'antd';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Tooltip } from 'antd';
import { Token } from '../types';
import TokenSymbol from '../token-symbol/token-symbol';
import TokenList, { TokenListItem } from '../token-list/token-list';
import { none, Option } from 'fp-ts/Option';
import Maybe from '../../core/maybe/maybe';
import type { TokenList as ITokenList } from '../hooks/tokenList';
/* eslint-disable-next-line */
export interface SearchTokenProps {
  commonBases: ITokenList;
  tokens: ITokenList;
  onSelected?: (token: Token) => void;
  isSelected: (token: Token) => boolean;
  onSearch?: (query: string) => void;
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
  onSearch,
}: SearchTokenProps) {
  const handleClick = (token: Token) => () => {
    if (onSelected) {
      onSelected(token);
    }
  };
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  return (
    <StyledSearchToken>
      <Space direction="vertical">
        <StyledSearch onChange={handleSearch} placeholder="Search name" />
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
              {commonBases.map((t, index) => (
                <Maybe option={t} key={index}>
                  {(t) => (
                    <TokenTag key={t.name} selected={isSelected(t)} token={t} />
                  )}
                </Maybe>
              ))}
            </TokenTags>
          </>
        )}
      </Maybe>
      <Maybe option={tokens}>
        {(tokens) => (
          <TokenList
            itemLayout="horizontal"
            dataSource={tokens}
            renderItem={(item: Option<Token>) => (
              <Maybe option={item}>
                {(item) => (
                  <TokenListItem
                    key={item.name}
                    selected={isSelected(item)}
                    onClick={handleClick(item)}
                    token={item}
                  />
                )}
              </Maybe>
            )}
          />
        )}
      </Maybe>
    </StyledSearchToken>
  );
}

export default SearchToken;
