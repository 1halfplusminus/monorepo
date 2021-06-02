import React, { ReactNode } from 'react';
import { Meta, Story } from '@storybook/react';
import { ConnectWallet, ConnectWalletProps } from './connect-wallet';
import { useWallets, Web3WalletProvider } from '../hooks/useWallet';

export default {
  component: ConnectWallet,
  title: 'ConnectWallet',
} as Meta;

const WalletProvider = ({ children }: { children: ReactNode }) => (
  <Web3WalletProvider>{children}</Web3WalletProvider>
);

const ConnectedWallet = (props: ConnectWalletProps) => {
  const { connect, isConnecting } = useWallets();

  return (
    <ConnectWallet
      {...props}
      connect={(provider) => {
        connect(provider);
      }}
      isConnecting={isConnecting}
    />
  );
};
export const primary: Story<ConnectWalletProps> = (props) => {
  return <ConnectWallet {...props} />;
};
export const connecting: Story<ConnectWalletProps> = (props) => {
  return <ConnectWallet {...props} isConnecting={() => true} />;
};
export const Metamask: Story<ConnectWalletProps> = (props) => {
  return (
    <WalletProvider>
      <ConnectedWallet {...props} />
    </WalletProvider>
  );
};
