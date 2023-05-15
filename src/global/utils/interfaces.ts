import { IWalletPlugin } from "@scom/scom-wallet-modal";
import { ITokenObject } from "./common";

export interface ICommissionInfo {
  chainId: number;
  walletAddress: string;
  share: string;
}

export interface INetworkConfig {
  chainId: number;
  chainName?: string;
}

export interface IDefaultLotteryTickets {
  wallets: IWalletPlugin[],
  networks: INetworkConfig[],
  tokens?: ITokenObject[],
  defaultChainId: number,
  showHeader?: boolean
}

export interface ILotteryTickets extends IDefaultLotteryTickets {
  chainId?: number,
  commissions?: ICommissionInfo[]
}

export interface IEmbedData {
  commissions?: ICommissionInfo[]
}