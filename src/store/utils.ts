import { Erc20, IClientSideProvider, Wallet } from '@ijstech/eth-wallet';
import {
  EventId,
  IExtendedNetwork,
  ITokenObject,
  SITE_ENV
} from '../global/index';

import { ChainNativeTokenByChainId, WETHByChainId } from '@scom/scom-token-list';
import { Contracts as OpenSwapContracts } from "../contracts/oswap-openswap-contract/index";
import getNetworkList from '@scom/scom-network-list'

import { application } from '@ijstech/components';

export enum WalletPlugin {
  MetaMask = 'metamask',
  Coin98 = 'coin98',
  TrustWallet = 'trustwallet',
  BinanceChainWallet = 'binancechainwallet',
  ONTOWallet = 'onto',
  WalletConnect = 'walletconnect',
  BitKeepWallet = 'bitkeepwallet',
  FrontierWallet = 'frontierwallet',
}

export const nullAddress = "0x0000000000000000000000000000000000000000";
export const INFINITE = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

const TOKENS = "oswap_user_tokens_";

export const getUserTokens = (chainId: number) => {
  let tokens = localStorage[TOKENS + chainId];
  if (tokens) {
    tokens = JSON.parse(tokens);
  } else {
    tokens = [];
  }
  const userTokens = state.userTokens[chainId];
  if (userTokens && userTokens.length) {
    tokens = tokens.concat(userTokens);
  }
  return tokens.length ? tokens : null;
}

export const addUserTokens = (token: ITokenObject) => {
  const chainId = getChainId();
  let tokens = localStorage[TOKENS + chainId];
  let i = -1;
  if (tokens) {
    tokens = JSON.parse(tokens);
    i = tokens.findIndex((item: ITokenObject) => item.address == token.address);
  } else {
    tokens = [];
  }
  if (i == -1) {
    tokens.push(token);
  }
  localStorage[TOKENS + chainId] = JSON.stringify(tokens);
}

export const getSupportedNetworks = () => {
  return Object.values(state.networkMap);
}

const setInfuraId = (infuraId: string) => {
  state.infuraId = infuraId;
}

export const getInfuraId = () => {
  return state.infuraId;
}

export const getSiteSupportedNetworks = () => {
  let networkFullList = Object.values(state.networkMap);
  let list = networkFullList.filter(network => !getNetworkInfo(network.chainId).isDisabled);
  return list;
  // const siteEnv = getSiteEnv();
  // if (siteEnv === SITE_ENV.TESTNET) {
  //   return list.filter((network) => network.isTestnet);
  // }
  // if (siteEnv === SITE_ENV.DEV) {
  //   return list;
  // }
  // return list.filter((network) => !network.isTestnet);
}

const setNetworkList = (networkList: IExtendedNetwork[], infuraId?: string) => {
  const wallet = Wallet.getClientInstance();
  state.networkMap = {};
  const defaultNetworkList = getNetworkList();
  const defaultNetworkMap = defaultNetworkList.reduce((acc, cur) => {
    acc[cur.chainId] = cur;
    return acc;
  }, {});
  for (let network of networkList) {
    const networkInfo = defaultNetworkMap[network.chainId];
    if (!networkInfo) continue;
    if (infuraId && network.rpcUrls && network.rpcUrls.length > 0) {
      for (let i = 0; i < network.rpcUrls.length; i++) {
        network.rpcUrls[i] = network.rpcUrls[i].replace(/{InfuraId}/g, infuraId);
      }
    }
    state.networkMap[network.chainId] = {
      ...networkInfo,
      ...network
    };
    wallet.setNetworkInfo(state.networkMap[network.chainId]);
  }
}

export const getNetworkInfo = (chainId: number) => {
  return state.networkMap[chainId];
}

export const setCurrentChainId = (value: number) => {
  state.currentChainId = value;
}

export const getCurrentChainId = (): number => {
  return state.currentChainId;
}

export const getChainNativeToken = (chainId: number): ITokenObject => {
  return ChainNativeTokenByChainId[chainId];
};

export const getWETH = (chainId: number): ITokenObject => {
  let wrappedToken = WETHByChainId[chainId];
  return wrappedToken;
};

export const setDataFromConfig = (options: any) => {
  if (options.infuraId) {
    setInfuraId(options.infuraId)
  }
  if (options.networks) {
    setNetworkList(options.networks, options.infuraId)
  }
  if (options.proxyAddresses) {
    setProxyAddresses(options.proxyAddresses)
  }
  if (options.ipfsGatewayUrl) {
    setIPFSGatewayUrl(options.ipfsGatewayUrl);
  }
  if (options.apiGatewayUrls) {
    setAPIGatewayUrls(options.apiGatewayUrls);
  }
  if (options.embedderCommissionFee) {
    setEmbedderCommissionFee(options.embedderCommissionFee);
  }
}

export function isWalletConnected() {
  const wallet = Wallet.getClientInstance();
  return wallet.isConnected;
}

export async function switchNetwork(chainId: number) {
  if (!isWalletConnected()) {
    setCurrentChainId(chainId);
    Wallet.getClientInstance().chainId = chainId;
    application.EventBus.dispatch(EventId.chainChanged, chainId);
    return;
  }
  const wallet = Wallet.getClientInstance();
  if (wallet?.clientSideProvider?.name === WalletPlugin.MetaMask) {
    await wallet.switchNetwork(chainId);
  }
}

export function getChainId() {
  return isWalletConnected() ? Wallet.getClientInstance().chainId : state.currentChainId;
}

export function getWalletProvider() {
  return localStorage.getItem('walletProvider') || '';
}

export const hasMetaMask = function () {
  const provider = getWalletPluginProvider(WalletPlugin.MetaMask);
  return provider?.installed();
}

export function getErc20(address: string) {
  const wallet = Wallet.getClientInstance();
  return new Erc20(wallet, address);
}

export const isExpertMode = (): boolean => {
  return state.isExpertMode;
}

export function toggleExpertMode() {
  state.isExpertMode = !state.isExpertMode
}

export const getSlippageTolerance = (): any => {
  return state.slippageTolerance
}

export const setSlippageTolerance = (value: any) => {
  state.slippageTolerance = value
}

export const getTransactionDeadline = (): any => {
  return state.transactionDeadline;
}

export const setTransactionDeadline = (value: any) => {
  state.transactionDeadline = value
}

export type ProxyAddresses = { [key: number]: string };

export const state = {
  siteEnv: SITE_ENV.TESTNET,
  networkMap: {} as { [key: number]: IExtendedNetwork },
  currentChainId: 0,
  isExpertMode: false,
  slippageTolerance: 0.5,
  transactionDeadline: 30,
  infuraId: "",
  userTokens: {} as { [key: string]: ITokenObject[] },
  walletPluginMap: {} as Record<WalletPlugin, IClientSideProvider>,
  proxyAddresses: {} as ProxyAddresses,
  ipfsGatewayUrl: '',
  apiGatewayUrls: {} as Record<string, string>,
  embedderCommissionFee: '0'
}

export const setWalletPluginProvider = (walletPlugin: WalletPlugin, wallet: IClientSideProvider) => {
  state.walletPluginMap[walletPlugin] = wallet;
}

export const getWalletPluginMap = () => {
  return state.walletPluginMap;
}

export const getWalletPluginProvider = (walletPlugin: WalletPlugin) => {
  return state.walletPluginMap[walletPlugin];
}

export const getTokenObject = async (address: string, showBalance?: boolean) => {
  const ERC20Contract = new OpenSwapContracts.ERC20(Wallet.getClientInstance(), address);
  const symbol = await ERC20Contract.symbol();
  const name = await ERC20Contract.name();
  const decimals = (await ERC20Contract.decimals()).toFixed();
  let balance;
  if (showBalance && isWalletConnected()) {
    balance = (await (ERC20Contract.balanceOf(Wallet.getClientInstance().account.address))).shiftedBy(-decimals).toFixed();
  }
  return {
    address: address.toLowerCase(),
    decimals: +decimals,
    name,
    symbol,
    balance
  }
}

export const setUserTokens = (token: ITokenObject, chainId: number) => {
  if (!state.userTokens[chainId]) {
    state.userTokens[chainId] = [token];
  } else {
    state.userTokens[chainId].push(token);
  }
}

export const hasUserToken = (address: string, chainId: number) => {
  return state.userTokens[chainId]?.some((token: ITokenObject) => token.address?.toLocaleLowerCase() === address?.toLocaleLowerCase());
}

export const getNetworkExplorerName = (chainId: number) => {
  if (getNetworkInfo(chainId)) {
    return getNetworkInfo(chainId).explorerName;
  }
  return 'Unknown';
}

export const getNetworkName = (chainId: number) => {
  return getSiteSupportedNetworks().find(v => v.chainId === chainId)?.chainName || '';
}

export const setProxyAddresses = (data: ProxyAddresses) => {
  state.proxyAddresses = data;
}

export const getProxyAddress = (chainId?: number) => {
  const _chainId = chainId || Wallet.getInstance().chainId;
  const proxyAddresses = state.proxyAddresses;
  if (proxyAddresses) {
    return proxyAddresses[_chainId];
  }
  return null;
}

export const setIPFSGatewayUrl = (url: string) => {
  state.ipfsGatewayUrl = url;
}

export const getIPFSGatewayUrl = () => {
  return state.ipfsGatewayUrl;
}

export const setAPIGatewayUrls = (urls: Record<string, string>) => {
  state.apiGatewayUrls = urls;
}

const setEmbedderCommissionFee = (fee: string) => {
  state.embedderCommissionFee = fee;
}

export const getEmbedderCommissionFee = () => {
  return state.embedderCommissionFee;
}