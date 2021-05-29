import React from 'react';

import styled from 'styled-components';
import tw from 'twin.macro';

/* eslint-disable-next-line */
export interface TokenSymbolProps {
  src: string;
}

const StyledTokenSymbol = styled.img`
  ${tw`h-5 w-5`}
`;

export function TokenSymbol({ src }: TokenSymbolProps) {
  return <StyledTokenSymbol src={src} />;
}

export default TokenSymbol;
