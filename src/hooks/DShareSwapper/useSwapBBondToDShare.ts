import {useCallback} from 'react';
import useBulFinance from '../useBulFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import {parseUnits} from 'ethers/lib/utils';

const useSwapDBondToDShare = () => {
  const bombFinance = useBulFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapDShare = useCallback(
    (bbondAmount: string) => {
      const bbondAmountBn = parseUnits(bbondAmount, 18);
      handleTransactionReceipt(bombFinance.swapDBondToDShare(bbondAmountBn), `Swap ${bbondAmount} DBond to DShare`);
    },
    [bombFinance, handleTransactionReceipt],
  );
  return {onSwapDShare: handleSwapDShare};
};

export default useSwapDBondToDShare;
