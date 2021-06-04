import React, { ReactNode } from 'react';
import { Meta, Story } from '@storybook/react';
import { ConnectWallet, ConnectWalletProps } from './connect-wallet';
import { useWallets, Web3WalletProvider } from '../hooks/useWallet';

export default {
  component: ConnectWallet,
  title: 'ConnectWallet',
} as Meta;

const ConnectedWallet = (props: ConnectWalletProps) => {
  const { connect, isConnecting, isConnected } = useWallets();

  return (
    <ConnectWallet
      {...props}
      connect={(provider) => {
        connect(provider);
      }}
      isConnecting={isConnecting}
      isConnected={isConnected}
    />
  );
};
export const primary: Story<ConnectWalletProps> = (props) => {
  return <ConnectWallet {...props} />;
};
export const connecting: Story<ConnectWalletProps> = (props) => {
  return <ConnectWallet {...props} isConnecting={() => true} />;
};
export const connected: Story<ConnectWalletProps> = (props) => {
  return <ConnectWallet {...props} isConnected={() => true} />;
};
export const Metamask: Story<ConnectWalletProps> = (props) => {
  return (
    <Web3WalletProvider>
      <ConnectedWallet {...props} />
    </Web3WalletProvider>
  );
};
