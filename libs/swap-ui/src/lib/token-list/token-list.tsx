import { List, Avatar } from 'antd';
import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Token } from '../types';

export interface TokenListItem {
  token: Token;
  onClick: () => void;
}
export const TokenListItem = ({ token, onClick }: TokenListItem) => (
  <List.Item
    onClick={() => {
      onClick();
    }}
  >
    <List.Item.Meta
      avatar={<Avatar src={token.symbol} />}
      title={token.name}
      description={token.fullName}
    />
  </List.Item>
);

const TokenList = styled(List)`
  .ant-list-item-meta-title {
    ${tw`text-white`}
  }
  .ant-list-item-meta-description {
    ${tw`text-gray-400`}
  }
  .ant-list-item {
    ${tw`cursor-pointer`}
  }
  .ant-list-item:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

export default TokenList;
