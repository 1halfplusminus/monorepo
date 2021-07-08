import react from 'react';
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

const MaybeTokenB = ({
  token,
  onSwap,
}: {
  token: FormSubmitButtonProps['tokenB'];
  onSwap: FormSubmitButtonProps['onSwap'];
}) => {
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
          {() => <SwapButton onClick={onSwap} />}
        </Maybe>
      )}
    </Maybe>
  );
};
const MaybeSwap = ({
  tokenA,
  tokenB,
  onSwap,
}: {
  tokenA: FormSubmitButtonProps['tokenA'];
  tokenB: FormSubmitButtonProps['tokenB'];
  onSwap: FormSubmitButtonProps['onSwap'];
}) => {
  return (
    <Maybe option={tokenA} onNone={() => <EnterAmountButton />}>
      {(tokenA) => (
        <Maybe option={tokenA.token}>
          {(token) => (
            <Maybe option={tokenA.amount} onNone={() => <EnterAmountButton />}>
              {(amount) => (
                <Maybe
                  option={tokenA.sold}
                  onNone={() => <EnterAmountButton />}
                >
                  {(sold) =>
                    amount > sold ? (
                      <LoadingButton>
                        Insufficient {token.name} balance
                      </LoadingButton>
                    ) : (
                      <MaybeTokenB token={tokenB} onSwap={onSwap} />
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
  onSwap,
}: PropsWithChildren<FormSubmitButtonProps>) => {
  return (
    <Maybe
      onNone={() => <ConnectButton {...connectButton} />}
      option={connected}
    >
      {(connected) =>
        connected ? (
          <Maybe
            option={loading}
            onNone={() => (
              <MaybeSwap tokenA={tokenA} tokenB={tokenB} onSwap={onSwap} />
            )}
          >
            {(loading) =>
              loading ? (
                <LoadingButton />
              ) : (
                <MaybeSwap tokenA={tokenA} tokenB={tokenB} onSwap={onSwap} />
              )
            }
          </Maybe>
        ) : (
          <ConnectButton {...connectButton} />
        )
      }
    </Maybe>
  );
};

const buttonStyle = css``;

export const EnterAmountButton = styled(Button)`
  ${buttonStyle}
`;

EnterAmountButton.defaultProps = {
  children: 'Entrez un montant',
  disabled: true,
};
export const LoadingButton = styled(Button)`
  ${buttonStyle}
`;

LoadingButton.defaultProps = {
  children: 'Loading...',
  disabled: true,
};

const SwapButton = styled(Button)`
  ${buttonStyle}
`;
SwapButton.defaultProps = {
  children: 'Swap',
};
export default FormSubmitButton;
