import React from 'react';
import { useWallets, Web3WalletProvider } from '../hooks/useWallet';
import { ConnectButton, ConnectButtonProps } from './connect-button';

export default {
  component: ConnectButton,
  title: 'ConnectButton',
};
const ConnectedButton = (props: ConnectButtonProps) => {
  const { connect, isConnecting, isConnected } = useWallets();

  return (
    <ConnectButton
      {...props}
      connect={(provider) => {
        connect(provider);
      }}
      isConnecting={isConnecting}
      isConnected={isConnected}
    />
  );
};
export const primary = () => {
  /* eslint-disable-next-line */
  const props: ConnectButtonProps = {};

  return <ConnectButton />;
};
export const WithState = () => {
  return (
    <Web3WalletProvider>
      <ConnectedButton />
    </Web3WalletProvider>
  );
};
