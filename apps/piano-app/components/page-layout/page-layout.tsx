import React from 'react';
import { PropsWithChildren } from 'react';

import styled from 'styled-components';

/* eslint-disable-next-line */
export interface PageLayoutProps {}

const StyledPageLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(2rem, 1fr));
  grid-gap: 10px;
  grid-auto-rows: minmax(4.5rem, auto);
`;

export const HeaderLayout = styled.div`
  grid-column-start: 1;
  grid-column-end: 4;
`;

export const MainLayout = styled.div`
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-end: 6;
  grid-row-start: 2;
`;

export function PageLayout({ children }: PropsWithChildren<PageLayoutProps>) {
  return <StyledPageLayout>{children}</StyledPageLayout>;
}

export default PageLayout;
