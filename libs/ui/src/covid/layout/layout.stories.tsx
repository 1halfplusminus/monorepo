import React from 'react';
import CovidMap from '../map';
import StatistiqueCard from '../statistique-card';
import Stats from '../stats';
import { Header, Layout, LayoutProps, Page, TwoColumns } from './layout';

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
export const primary = () => {
  /* eslint-disable-next-line */
  const props: LayoutProps = {
    debug: true,
    main: <Content />,
    header: '',
  };

  return <Layout {...props} />;
};

export const header = () => {
  return (
    <Page debug={true}>
      <Header />
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
