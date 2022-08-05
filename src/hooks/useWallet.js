import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected, kaikas, walletconnect } from '../connectors';

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    const connectorId = window.localStorage.getItem('wallet') ?? 'injected';
    // TODO: 이거 뭐지?
    // if (!connectorId || connectorId === 'klayton') {
    //   if (!window.klayton) {
    //     window.localStorage.removeItem('chainId');
    //     return;
    //   }
    //   window.klayton.enable();
    // }
    if (!connectorId || connectorId === 'injected') {
      injected.isAuthorized().then((isAuthorized: boolean) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    }
    if (!connectorId || connectorId === 'kaikas') {
      injected.isAuthorized().then((isAuthorized: boolean) => {
        if (isAuthorized) {
          activate(kaikas, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    }
    if (!connectorId || connectorId === 'walletconnect') {
      const wc = walletconnect(false);
      activate(wc);
    }
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        activate(injected);
      };
      const handleChainChanged = (chainId: string | number) => {
        activate(injected);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        activate(injected);
        console.log('Network changed to ', networkId);
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
