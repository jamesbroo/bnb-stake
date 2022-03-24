import ERC20 from './ERC20';

export type ContractName = string;

export interface BankInfo {
  name: string;
  poolId: number;
  sectionInUI: number;
  contract: ContractName;
  depositTokenName: ContractName;
  earnTokenName: ContractName;
  sort: number;
  finished: boolean;
  closedForStaking: boolean;
}

export interface Bank extends BankInfo {
  address: string;
  depositToken: ERC20;
  earnToken: ERC20;
}

export type PoolStats = {
  dailyAPR: string;
  yearlyAPR: string;
  TVL: string;
};

export type TokenStat = {
  tokenInFtm: string;
  priceInDollars: string;
  totalSupply: string;
  circulatingSupply: string;
};

export type LPStat = {
  tokenAmount: string;
  ftmAmount: string;
  priceOfOne: string;
  totalLiquidity: string;
  totalSupply: string;
};

export type AllocationTime = {
  from: Date;
  to: Date;
};

export type DShareSwapperStat = {
  bulshareBalance: string;
  bbondBalance: string;
  // bombPrice: string;
  // bulsharePrice: string;
  rateDSharePerBul: string;
};

export type PlanInfo = {
  time: string;
  percent: string;
};

export type ResultInfo = {
  percent: string;
  profit: string;
  finish: string;
};

export type DepositInfo = {
  plan: number;
  percent: string;
  amount: string;
  profit: string;
  start: string;
  finish: string;
}