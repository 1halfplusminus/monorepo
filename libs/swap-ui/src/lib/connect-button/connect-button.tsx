import React, { PropsWithChildren } from 'react';
import Button from 'antd/lib/button/button';
import styled from 'styled-components';
import { useModal } from '../popup/hooks';
import { DarkModal } from '../popup/popup';
import ConnectWallet, {
  ConnectWalletProps,
} from '../connect-wallet/connect-wallet';
/* eslint-disable-next-line */
export type ConnectButtonProps = ConnectWalletProps;

const StyledButton = styled(Button)``;

export function ConnectButton({
  children,
  ...props
}: PropsWithChildren<ConnectButtonProps>) {
  const { showModal, isModalVisible, handleCancel } = useModal();

  return (
    <>
      <StyledButton onClick={showModal}>Connecter le portefeuille</StyledButton>
      <DarkModal
        onCancel={handleCancel}
        title="Se connecter à un portefeuille"
        visible={isModalVisible}
        footer={null}
      >
        <ConnectWallet {...props} />
      </DarkModal>
    </>
  );
}

export default ConnectButton;
