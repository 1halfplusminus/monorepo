import { List, Avatar } from 'antd';
import React from 'react';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';
import { Token } from '../types';

export interface TokenListItem {
  token: Token;
  onClick: () => void;
  selected: boolean;
}
const StyledListItem = styled(List.Item)<{ selected: boolean }>`
  --background-color-hover: rgba(0, 0, 0, 0.3);
  ${tw`cursor-pointer flex items-center`}
  ${({ selected }) =>
    selected &&
    css`
      background-color: var(--background-color-hover);
    `}
  :hover {
    background-color: var(--background-color-hover);
  }
  .ant-list-item-meta {
    ${tw`flex items-center`}
  }
`;
export const TokenListItem = ({ token, onClick, selected }: TokenListItem) => (
  <StyledListItem
    selected={selected}
    onClick={() => {
      onClick();
    }}
  >
    <List.Item.Meta
      avatar={<Avatar src={token.symbol} />}
      title={token.name}
      description={token.fullName}
    />
  </StyledListItem>
);

const TokenList = styled(List)`
  .ant-list-item-meta-title {
    ${tw`text-white`}
  }
  .ant-list-item-meta-description {
    ${tw`text-gray-400`}
  }
`;

export default TokenList;
