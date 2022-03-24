import {useCallback, useEffect, useState} from 'react';
import useBulFinance from '../useBulFinance';
import {useWallet} from 'use-wallet';
import {BigNumber} from 'ethers';
import {parseUnits} from 'ethers/lib/utils';

const useEstimateDShare = (bbondAmount: string) => {
  const [estimateAmount, setEstimateAmount] = useState<string>('');
  const {account} = useWallet();
  const bombFinance = useBulFinance();

  const estimateAmountOfDShare = useCallback(async () => {
    const bbondAmountBn = parseUnits(bbondAmount);
    const amount = await bombFinance.estimateAmountOfDShare(bbondAmountBn.toString());
    setEstimateAmount(amount);
  }, [account]);

  useEffect(() => {
    if (account) {
      estimateAmountOfDShare().catch((err) => console.error(`Failed to get estimateAmountOfDShare: ${err.stack}`));
    }
  }, [account, estimateAmountOfDShare]);

  return estimateAmount;
};

export default useEstimateDShare;
