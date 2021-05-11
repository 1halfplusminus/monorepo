import React, { ReactNode } from 'react';
import styled from 'styled-components';
import tw, { css } from 'twin.macro';

/** Page */
/* eslint-disable-next-line */
export interface PageProps {
  debug?: boolean;
}

export const Page = styled.main<PageProps>`
  ${tw`h-screen w-screen bg-gray-200`}
  ${({ debug }) =>
    debug &&
    css`
      --debug-bg-color: rgba(156, 163, 175, var(--tw-bg-opacity));
      --debug-bg--section-color: rgba(156, 163, 175, var(--tw-bg-opacity));
      > div,
      > header {
        filter: brightness(70%);
        background-color: var(--debug-bg-color);
      }
      > main > section {
        background-color: var(--debug-bg-color);
      }
      > main {
        filter: brightness(80%);
        background-color: var(--debug-bg-color);
      }
    `}
`;

/** Header */
export const Header = styled.header`
  ${tw`flex-auto h-20`}
`;
/** MainContent */

export const MainContent = styled.main`
  ${tw`inline-flex items-start justify-between w-full h-full`}
`;

const Left = styled.section`
  ${tw`max-h-80 order-2 w-5/12 h-80`}
`;

const Right = styled.section`
  ${tw`space-y-1.5 w-7/12 h-full px-2 py-2.5`}
`;

export interface TwoColumnsProps {
  left: ReactNode;
  right: ReactNode;
}
export const TwoColumns = ({ left, right }: TwoColumnsProps) => {
  return (
    <MainContent>
      <Left>{left}</Left>
      <Right>{right}</Right>
    </MainContent>
  );
};

/* eslint-disable-next-line */
export interface LayoutProps {
  header: ReactNode;
  main: ReactNode;
  debug?: boolean;
}

export function Layout({ header, main, debug = false }: LayoutProps) {
  return (
    <Page debug={debug}>
      <Header>{header}</Header>
      <MainContent>{main}</MainContent>
    </Page>
  );
}

export default Layout;
