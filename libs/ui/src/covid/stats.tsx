import React, { PropsWithChildren } from 'react';

import styled from 'styled-components';
import tw from 'twin.macro';

/* eslint-disable-next-line */
export interface StatsProps {}

const StyledStats = styled.div`
  ${tw`inline-flex space-x-2 items-start justify-between w-full h-full px-1 bg-gray-200`}
`;

export function Stats({ children, ...rest }: PropsWithChildren<StatsProps>) {
  return <StyledStats>{children}</StyledStats>;
}

export default Stats;
