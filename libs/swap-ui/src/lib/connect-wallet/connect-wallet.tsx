import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import Spinner from '../spinner/spinner';
import { WalletProvider } from '../types';
import metamask from './icons/metamask.svg';
/* eslint-disable-next-line */
export interface ConnectWalletProps {
  connect?: (provider: WalletProvider) => void;
  isConnecting?: (provider: WalletProvider) => boolean;
}
const StyledSearchToken = styled.div`
  ${tw`flex flex-col gap-4`}
`;
const Text = styled.span`
  ${tw`text-white`}
`;
const Title = styled.h2`
  ${tw`text-xl text-white inline-flex flex-row items-center  gap-2`}
`;
const Surface = styled.div`
  ${tw`rounded-lg border-white border-2 p-2`}
`;
const WalletList = styled.div`
  ${tw`flex flex-col gap-4 `}
`;
const WalletListItem = styled.div`
  ${tw`cursor-pointer rounded-lg border-white border-2 px-3 py-2 inline-flex justify-between items-center`}
`;
const WalletListItemText = styled.span`
  ${tw`inline-flex gap-3 items-center`}
`;
const WalletListItemImg = styled.img`
  ${tw`h-7`}
`;
export function ConnectWallet({
  connect,
  isConnecting = () => false,
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
          service d’Uniswap et reconnaissez que vous avez lu et compris
          l’exclusion de responsabilité.
        </Text>
      </Surface>
      <WalletList>
        <WalletListItem onClick={handleConnect('metamask')}>
          <WalletListItemText>
            Metamask {isConnecting('metamask') && <Spinner />}
          </WalletListItemText>
          <WalletListItemImg src={metamask} />
        </WalletListItem>
      </WalletList>
    </StyledSearchToken>
  );
}

export default ConnectWallet;
