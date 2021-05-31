import { Meta, Story } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { ETH } from '../__mocks__/tokens';
import { SearchToken, SearchTokenProps } from './search-token';

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
  commonBases: [ETH],
  tokens: [ETH],
};
