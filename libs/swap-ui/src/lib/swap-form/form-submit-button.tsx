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
import { loading, soldInsufficient } from './form-submit-button.stories';
import { css } from 'styled-components';
export interface FormSubmitButtonProps {
  connected: Option<boolean>;
  loading: Option<boolean>;
  tokenA: Option<{
    sold: Option<BigNumberish>;
    token: Option<Token>;
    amount: Option<BigNumberish>;
  }>;
  tokenB: Option<{
    sold: Option<BigNumberish>;
    token: Option<Token>;
    amount: Option<BigNumberish>;
  }>;
  connectButton?: ConnectButtonProps;
  button?: Pick<ButtonProps, 'disabled'>;
  tokens: Option<Array<[Option<Token>, Option<BigNumberish>]>>;
  onSwap?: () => void;
}
const MaybeTokenB = ({ token }: { token: FormSubmitButtonProps['tokenB'] }) => {
  return (
    <Maybe
      option={token}
      onNone={() => <Button disabled={true}> Select a token </Button>}
    >
      {({ token }) => (
        <Maybe
          option={token}
          onNone={() => <Button disabled={true}> Select a token </Button>}
        >
          {() => <Button> Swap </Button>}
        </Maybe>
      )}
    </Maybe>
  );
};
const MaybeSwap = ({
  tokenA,
  tokenB,
}: {
  tokenA: FormSubmitButtonProps['tokenA'];
  tokenB: FormSubmitButtonProps['tokenB'];
}) => {
  return (
    <Maybe option={tokenA} onNone={() => <SwapButton />}>
      {(tokenA) => (
        <Maybe option={tokenA.token}>
          {(token) => (
            <Maybe option={tokenA.amount}>
              {(amount) => (
                <Maybe option={tokenA.sold}>
                  {(sold) =>
                    amount > sold ? (
                      <LoadingButton>
                        Insufficient {token.name} balance
                      </LoadingButton>
                    ) : (
                      <MaybeTokenB token={tokenB} />
                    )
                  }
                </Maybe>
              )}
            </Maybe>
          )}
        </Maybe>
      )}
    </Maybe>
  );
};
export const FormSubmitButton = ({
  connected,
  connectButton,
  tokenA,
  tokenB,
  loading,
}: PropsWithChildren<FormSubmitButtonProps>) => {
  return (
    <Maybe
      onNone={() => <ConnectButton {...connectButton} />}
      option={connected}
    >
      {() => (
        <Maybe
          option={loading}
          onNone={() => <MaybeSwap tokenA={tokenA} tokenB={tokenB} />}
        >
          {(loading) =>
            loading ? (
              <LoadingButton />
            ) : (
              <MaybeSwap tokenA={tokenA} tokenB={tokenB} />
            )
          }
        </Maybe>
      )}
    </Maybe>
  );
};

const buttonStyle = css``;

export const SwapButton = styled(Button)`
  ${buttonStyle}
`;

SwapButton.defaultProps = {
  children: 'Entrez un montant',
};
export const LoadingButton = styled(Button)`
  ${buttonStyle}
`;

LoadingButton.defaultProps = {
  children: 'Loading...',
  disabled: true,
};

export default FormSubmitButton;
