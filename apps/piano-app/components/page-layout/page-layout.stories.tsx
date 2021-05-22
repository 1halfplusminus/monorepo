import React from 'react';
import styled from 'styled-components';
import { HeaderLayout, MainLayout, PageLayout } from './page-layout';

export default {
  component: PageLayout,
  title: 'PageLayout',
};

const Filler = styled.div<{ color: string }>`
  height: 100%;
  width: 100%;
  background-color: ${({ color }) => color};
`;

export const primary = () => {
  return (
    <PageLayout>
      <HeaderLayout>
        <Filler color="gray" />
      </HeaderLayout>
      <MainLayout>
        <Filler color="gainsboro" />
      </MainLayout>
    </PageLayout>
  );
};
