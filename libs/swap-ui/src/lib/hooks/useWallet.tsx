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
import { Contract } from 'ethers/lib/ethers';

function getLibrary(provider: unknown, connector: unknown) {
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
  return {
    connect,
    isConnecting,
    provider: (callback: (provider: WalletProvider) => void) =>
      pipe(provider, options.map(callback)),
    isConnected,
    library: options.fromNullable(library),
    connected,
    account: options.fromNullable(account),
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
const ERC20ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (boolean)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
];
export const fetchBalance = (p: ethers.providers.Web3Provider) =>
  flow((token: Token, account: Option<string>) =>
    taskEither.tryCatch(
      async () =>
        (!token.isNative
          ? await new Contract(token?.address, ERC20ABI, p).balanceOf(
              pipe(
                account,
                options.fold(
                  () => '',
                  (account) => account
                )
              )
            )
          : await p.getBalance(
              pipe(
                account,
                options.fold(
                  () => '',
                  (account) => account
                )
              )
            )
        ).toString(),
      () => ''
    )
  );

export const fetchBalanceOption = (p: ethers.providers.Web3Provider) => (
  token: Option<Token>
) =>
  pipe(
    token,
    options.fold(
      () => taskEither.left(''),
      (t) => fetchBalance(p)(t)
    )
  );
