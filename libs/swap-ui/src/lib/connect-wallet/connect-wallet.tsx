import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Spinner from '../spinner/spinner';
import { WalletProvider } from '../types';
import metamask from './icons/metamask';
/* eslint-disable-next-line */
export interface ConnectWalletProps {
  connect?: (provider: WalletProvider) => void;
  isConnecting?: (provider: WalletProvider) => boolean;
  isConnected?: (provider: WalletProvider) => boolean;
}
const StyledSearchToken = styled.div`
  ${tw`flex flex-col gap-4 bg-gray-800 p-3`}
`;
const Text = styled.span`
  ${tw`text-white`}
`;

const Surface = styled.div`
  ${tw`rounded-lg border-white border-2 p-2`}
`;
const WalletList = styled.div`
  ${tw`flex flex-col gap-4 `}
`;
const WalletListItem = styled.div<{ disabled: boolean }>`
  ${tw`rounded-lg border-white border-2 px-3 py-2 inline-flex justify-between items-center`}
  ${({ disabled }) =>
    disabled
      ? tw`text-gray-600 cursor-not-allowed pointer-events-none`
      : tw`text-white cursor-pointer `}
`;
const WalletListItemText = styled.span`
  ${tw`inline-flex gap-3 items-center `}
`;
const WalletListItemImg = styled.img`
  ${tw`h-7`}
`;

const ConnectionStatus = styled.span`
  ${tw`inline-block h-3 w-3 rounded-2xl bg-green-500`}
`;

const icons: Partial<{ [key in WalletProvider] }> = { metamask: metamask };

const providers: [[string, WalletProvider]] = [['Metamask', 'metamask']];

export function ConnectWallet({
  connect,
  isConnecting = () => false,
  isConnected = () => false,
}: ConnectWalletProps) {
  const handleConnect = (provider: WalletProvider) => () => {
    if (connect) {
      connect(provider);
    }
  };
  return (
    <StyledSearchToken>
      <Surface>
        <Text>
          En vous connectant à un portefeuille, vous acceptez les conditions de
          service et reconnaissez que vous avez lu et compris l’exclusion de
          responsabilité.
        </Text>
      </Surface>
      <WalletList>
        {providers.map(([name, id]) => (
          <WalletListItem
            disabled={isConnected(id)}
            key={id}
            onClick={handleConnect(id)}
          >
            <WalletListItemText>
              {isConnected(id) && <ConnectionStatus />} {name}{' '}
              {isConnecting(id) && <Spinner />}
            </WalletListItemText>
            <WalletListItemImg as={icons[id]} />
          </WalletListItem>
        ))}
      </WalletList>
    </StyledSearchToken>
  );
}

export default ConnectWallet;
