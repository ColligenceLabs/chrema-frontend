import { initializeConnector } from '@web3-react/core';
import { Kaikas } from '@colligence/web3-react-kaikas';

export const [kaikas, hooks] = initializeConnector<Kaikas>((actions) => new Kaikas({ actions }));
