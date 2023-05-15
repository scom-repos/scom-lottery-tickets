import { INetwork } from '@ijstech/eth-wallet';

export interface IExtendedNetwork extends INetwork {
    shortName?: string;
    isDisabled?: boolean;
    isMainChain?: boolean;
    isCrossChainSupported?: boolean;
    explorerName?: string;
    explorerTxUrl?: string;
    explorerAddressUrl?: string;
    isTestnet?: boolean;
    symbol?: string;
    env?: string;
};

export const enum EventId {
    ConnectWallet = 'ConnectWallet',
    ChangeNetwork = 'ChangeNetwork',
    IsWalletConnected = 'isWalletConnected',
    IsWalletDisconnected = 'IsWalletDisconnected',
    Paid = 'Paid',
    chainChanged = 'chainChanged',
    EmitNewToken = 'emitNewToken',
}

export * from './utils/index';
