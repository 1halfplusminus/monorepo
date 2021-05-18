import React from 'react';

import styled from 'styled-components';

/* eslint-disable-next-line */
export interface TouchProps {
  onTouch: () => void;
}

const StyledTouch = styled.button`
  color: pink;
`;

export function Touch({ onTouch }: TouchProps) {
  return <StyledTouch onClick={onTouch}>Play</StyledTouch>;
}

export default Touch;
