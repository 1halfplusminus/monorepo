import react, { ReactElement } from 'react';
import ConnectButton, {
  ConnectButtonProps,
} from '../connect-button/connect-button';
import type { Option } from 'fp-ts/Option';
import Maybe from '../../core/maybe/maybe';
import { PropsWithChildren } from 'react';
import Button, { ButtonProps } from 'antd/lib/button/button';
import styled from 'styled-components';
import { Token } from '../types/index';
import { BigNumberish } from 'ethers';
export interface FormSubmitButtonProps {
  connected: Option<boolean>;
  connectButton?: ConnectButtonProps;
  button: Pick<ButtonProps, 'disabled'>;
  tokens: Option<Array<[Option<Token>, Option<BigNumberish>]>>;
  onSwap?: () => void;
}

export const FormSubmitButton = ({
  connected,
  children,
  connectButton,
}: PropsWithChildren<FormSubmitButtonProps>) => {
  return (
    <Maybe
      onNone={() => <ConnectButton {...connectButton} />}
      option={connected}
    >
      {() => <SwapButton />}
    </Maybe>
  );
};

export const SwapButton = styled(Button)``;

SwapButton.defaultProps = {
  children: 'Entrez un montant',
};

export default FormSubmitButton;
