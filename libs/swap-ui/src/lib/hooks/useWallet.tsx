import { Token, WalletProvider } from '../types';

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as options from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { connectors, injected } from './connectors';
import { none, some } from 'fp-ts/Option';
import type { Option } from 'fp-ts/Option';
import * as taskEither from 'fp-ts/TaskEither';
import * as task from 'fp-ts/Task';
import { connectERC20 } from '@halfoneplusminus/redcross-swap-contract';

function getLibrary(
  provider: ethers.providers.ExternalProvider,
  connector: unknown
) {
  return new ethers.providers.Web3Provider(provider);
}

export const Web3WalletProvider = ({ children }: { children: ReactNode }) => (
  <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
);

export const useWallets = () => {
  const context = useWeb3React<ethers.providers.Web3Provider>();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;
  const [connecting, setIsConnecting] = useState<Option<WalletProvider>>(none);
  const [provider, setProvider] = useState<Option<WalletProvider>>(none);
  const connect = useCallback(
    async (provider: WalletProvider) => {
      if (provider) {
        switch (provider) {
          case 'metamask':
            setProvider(some('metamask'));
            setIsConnecting(some('metamask'));
            activate(injected);
            setActivatingConnector(injected);
            break;
          default:
        }
      }
    },
    [activate]
  );
  const [activatingConnector, setActivatingConnector] = useState<any>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector && active) {
      setActivatingConnector(undefined);
      setIsConnecting(none);
    }
  }, [activatingConnector, connector, active]);
  const isConnecting = useCallback(
    (provider: WalletProvider) =>
      pipe(
        connecting,
        options.fold(
          () => false,
          (p) => p === provider
        )
      ),
    [connecting]
  );
  const isConnected = useCallback(
    (provider: WalletProvider) => {
      for (const key in connectors) {
        if (Object.prototype.hasOwnProperty.call(connectors, key)) {
          const element = connectors[key];
          if (connector === element && provider === key) {
            return true;
          }
        }
      }
      return false;
    },
    [connector]
  );
  const connected = useMemo(
    () =>
      pipe(
        options.fromNullable(connector),
        options.map((c) => !!c)
      ),
    [connector]
  );
  useEagerConnect();
  const optionAccount = useMemo(() => options.fromNullable(account), [account]);
  const optionlibrary = useMemo(() => options.fromNullable(library), [library]);
  const chaindId = useMemo(() => options.fromNullable(chainId), [chainId]);
  return {
    connect,
    isConnecting,
    provider: (callback: (provider: WalletProvider) => void) =>
      pipe(provider, options.map(callback)),
    isConnected,
    library: optionlibrary,
    connected,
    account: optionAccount,
    chaindId,
  };
};

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress: boolean) {
  const { active, error, activate } = useWeb3React();

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected);
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}

export const fetchBalance = (p: ethers.providers.Web3Provider) =>
  flow((token: Token, account: Option<string>) =>
    taskEither.tryCatch(
      async () =>
        !token.isNative
          ? pipe(
              connectERC20(p)(token?.address),
              (c) => {
                return () =>
                  Promise.all([
                    c.balanceOf(
                      pipe(
                        account,
                        options.fold(
                          () => '',
                          (account) => account
                        )
                      )
                    ),
                    c.decimals(),
                  ]);
              },
              task.map(([balance, decimal]) =>
                ethers.utils.formatUnits(balance.toString(), decimal)
              )
            )()
          : pipe(
              () =>
                p.getBalance(
                  pipe(
                    account,
                    options.fold(
                      () => '',
                      (account) => account
                    )
                  )
                ),
              task.map((r) => ethers.utils.formatEther(r))
            )(),
      () => ''
    )
  );

export const fetchOptionTokenBalance = (
  library: Option<ethers.providers.Web3Provider>
) => (token: Option<Token>, account: Option<string>): Promise<string> =>
  pipe(
    library,
    options.chain((p) =>
      pipe(
        token,
        options.map((token) =>
          pipe(
            fetchBalance(p)(token, account),
            taskEither.getOrElse(() => task.never)
          )
        )
      )
    ),
    options.getOrElse(() => task.never)
  )();
