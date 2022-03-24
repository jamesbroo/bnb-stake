import {useEffect, useState} from 'react';
import useBulFinance from '../useBulFinance';
import {DShareSwapperStat} from '../../bomb-finance/types';
import useRefresh from '../useRefresh';

const useDShareSwapperStats = (account: string) => {
  const [stat, setStat] = useState<DShareSwapperStat>();
  const {fastRefresh /*, slowRefresh*/} = useRefresh();
  const bombFinance = useBulFinance();

  useEffect(() => {
    async function fetchDShareSwapperStat() {
      try {
        if (bombFinance.myAccount) {
          setStat(await bombFinance.getDShareSwapperStat(account));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchDShareSwapperStat();
  }, [setStat, bombFinance, fastRefresh, account]);

  return stat;
};

export default useDShareSwapperStats;
