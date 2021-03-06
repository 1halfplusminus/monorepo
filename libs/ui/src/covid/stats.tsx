import React, { PropsWithChildren } from 'react';

import styled from 'styled-components';
import tw from 'twin.macro';

/* eslint-disable-next-line */
export interface StatsProps {}

const StyledStats = styled.div`
  ${tw`px-2 py-2 gap-x-1 gap-y-2 grid-rows-2 grid-cols-2`}
  ${tw`md:grid-cols-2 md:grid-flow-row md:px-5 md:gap-x-5`}
  ${tw`lg:px-12 lg:py-10 lg:gap-x-5 lg:gap-y-4 lg:grid-rows-3 lg:grid-cols-3 `}
  ${tw`xl:gap-x-28`}
  ${tw`grid grid-flow-row w-full bg-gray-200`}
`;

export function Stats({ children, ...rest }: PropsWithChildren<StatsProps>) {
  return <StyledStats>{children}</StyledStats>;
}

export default Stats;
