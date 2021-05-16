import { Story } from '@storybook/react';
import React from 'react';
import CovidMap from '../map';
import StatistiqueCard from '../statistique-card';
import Stats from '../stats';
import { LayoutHeader, Layout, LayoutProps, Page, TwoColumns } from './layout';

export default {
  component: Layout,
  title: 'Covid/Layout',
};

const Content = () => (
  <TwoColumns
    left={<CovidMap zoom={1} />}
    right={
      <Stats>
        <StatistiqueCard
          {...{
            value: '5 780 379',
            description: 'cas confirmés',
            variation: ['+', 3292],
            type: 'warning',
          }}
        />
        <StatistiqueCard
          {...{
            value: 17829181,
            description: 'premières doses injectées (au total)',
            type: 'success',
          }}
        />
        <StatistiqueCard
          {...{
            value: '106 684',
            description: 'nouveaux patients hospitalisés',
            variation: ['+', 292],
            type: 'danger',
          }}
        />
      </Stats>
    }
  />
);
export const primary: Story<LayoutProps> = (props) => {
  return <Layout {...props} />;
};

primary.args = {
  debug: true,
  main: <Content />,
  header: '',
};

export const header = () => {
  return (
    <Page debug={true}>
      <LayoutHeader />
    </Page>
  );
};

export const twoColumns = () => {
  return (
    <Page debug={true}>
      <Content />
    </Page>
  );
};
