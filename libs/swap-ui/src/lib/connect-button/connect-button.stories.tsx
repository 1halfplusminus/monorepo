import React from 'react';
import { ConnectButton, ConnectButtonProps } from './connect-button';

export default {
  component: ConnectButton,
  title: 'ConnectButton',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: ConnectButtonProps = {};

  return <ConnectButton />;
};
