import { Wallet, BigNumber, Utils, Erc20, IWallet } from "@ijstech/eth-wallet";
import { Contracts } from "../contracts/oswap-openswap-contract/index";
import {
  ERC20ApprovalModel,
  IERC20ApprovalEventOptions,
} from "../global/index";

const getApprovalModelAction = (contractAddress: string, options: IERC20ApprovalEventOptions) => {
  const approvalOptions = {
    ...options,
    spenderAddress: contractAddress
  };
  const approvalModel = new ERC20ApprovalModel(approvalOptions);
  let approvalModelAction = approvalModel.getAction();
  return approvalModelAction;
}

const buyTickets = () => {

}

export {
  getApprovalModelAction,
  buyTickets
}