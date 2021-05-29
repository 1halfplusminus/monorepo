import React from 'react';

import styled from 'styled-components';

/* eslint-disable-next-line */
export interface SwapUiProps {}

const StyledSwapUi = styled.div`
  color: pink;
`;

export function SwapUi(props: SwapUiProps) {
  return (
    <StyledSwapUi>
      <h1>Welcome to swap-ui!</h1>
    </StyledSwapUi>
  );
}

export default SwapUi;
