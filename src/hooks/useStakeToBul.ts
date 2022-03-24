import {useCallback} from 'react';
import useBulFinance from './useBulFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToBul = () => {
  const bombFinance = useBulFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(bombFinance.stakeToBul(amount), `Stake ${amount} DGN for xDGN`);
    },
    [bombFinance, handleTransactionReceipt],
  );
  return {onStake: handleStake};
};

export default useStakeToBul;
