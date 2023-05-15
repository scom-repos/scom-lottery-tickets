import Assets from '../assets';
import { tokenStore, assets as tokenAssets } from '@scom/scom-token-list';
import { getChainId, getChainNativeToken, isWalletConnected } from './utils';

export const fallBackUrl = Assets.fullPath('img/tokens/token-placeholder.svg');

export const getTokenIcon = (address: string) => {
  if (!address) return '';
  const tokenMap = tokenStore.tokenMap;
  let ChainNativeToken;
  let tokenObject;
  if (isWalletConnected()){
    ChainNativeToken = getChainNativeToken(getChainId());
    tokenObject = address == ChainNativeToken.symbol ? ChainNativeToken : tokenMap[address.toLowerCase()];
  } else {
    tokenObject = tokenMap[address.toLowerCase()];
  }
  return tokenAssets.fullPath(tokenAssets.getTokenIconPath(tokenObject, getChainId()));
}

export const tokenSymbol = (address: string) => {
  if (!address) return '';
  const tokenMap = tokenStore.tokenMap;
  let tokenObject = tokenMap[address.toLowerCase()];
  if (!tokenObject) {
    tokenObject = tokenMap[address];
  }
  return tokenObject ? tokenObject.symbol : '';
}

export * from './utils';
