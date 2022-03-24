import {useCallback} from 'react';
import useBulFinance from './useBulFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import {parseUnits} from 'ethers/lib/utils';
import {TAX_OFFICE_ADDR} from '../utils/constants';

const useProvideBulFtmLP = () => {
  const bombFinance = useBulFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideBulFtmLP = useCallback(
    (ftmAmount: string, bombAmount: string) => {
      const bombAmountBn = parseUnits(bombAmount);
      handleTransactionReceipt(
        bombFinance.provideBulFtmLP(ftmAmount, bombAmountBn),
        `Provide DGN-BTCB LP ${bombAmount} ${ftmAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [bombFinance, handleTransactionReceipt],
  );
  return {onProvideBulFtmLP: handleProvideBulFtmLP};
};

export default useProvideBulFtmLP;
