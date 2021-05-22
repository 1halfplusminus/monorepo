import React, { PropsWithChildren } from 'react';

import styled from 'styled-components';

/* eslint-disable-next-line */
export interface HeaderProps {}

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 1.1rem;
  background-color: #262629;
  color: white;
  align-items: center;
`;

export const HeaderLogo = styled.div`
  svg {
    fill: white;
    width: 3rem;
    height: 3rem;
  }
`;

export const HeaderTitle = styled.div`
  font-size: 1.6em;
`;

export function Header({ children }: PropsWithChildren<HeaderProps>) {
  return <StyledHeader>{children}</StyledHeader>;
}

export default Header;
