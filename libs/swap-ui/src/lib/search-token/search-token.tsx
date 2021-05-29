import React from 'react';
import { Input, Space } from 'antd';

import styled from 'styled-components';
import tw from 'twin.macro';

/* eslint-disable-next-line */
export interface SearchTokenProps {}

const StyledSearchToken = styled.div`
  color: pink;
`;

const StyledSearch = styled(Input)`
  ${tw`text-blue-700 h-16 bg-gray-700 flex-row p-4 rounded-md border-gray-300 border-2`}
  border: none;
  height: 100%;
  width: 100%;
  text-align: right;
  ${tw`text-2xl text-gray-500`}
`;

export function SearchToken(props: SearchTokenProps) {
  return (
    <StyledSearchToken>
      <Space direction="vertical">
        <StyledSearch placeholder="input search text" />
      </Space>
    </StyledSearchToken>
  );
}

export default SearchToken;
