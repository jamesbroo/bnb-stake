import {useEffect, useState} from 'react';
import useBulFinance from './useBulFinance';
import useRefresh from './useRefresh';
import {BigNumber} from 'ethers';
import useWallet from 'use-wallet';
import { DepositInfo } from '../bomb-finance/types';

const useGetPercent = (index: number) => {
  const [percent, setPercent] = useState<number>(0);
  const {slowRefresh} = useRefresh();
  const bombFinance = useBulFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setPercent(await bombFinance.getPercent(index));
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setPercent, bombFinance, slowRefresh]);

  return percent / 10;
};

export const useTotalStaked = () => {
  const [total, setTotal] = useState<BigNumber>();
  const {slowRefresh} = useRefresh();
  const bombFinance = useBulFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotal(await bombFinance.totalStaked());
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotal, bombFinance, slowRefresh]);

  return total;
};

export const useGetUserTotalDeposits = () => {
  const {account} = useWallet();
  const [total, setTotal] = useState<BigNumber>();
  const {slowRefresh} = useRefresh();
  const bombFinance = useBulFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotal(await bombFinance.getUserTotalDeposits(account));
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotal, bombFinance, slowRefresh, account]);

  return total;
};

export const useGetUserAvailable = () => {
  const {account} = useWallet();
  const [total, setTotal] = useState<BigNumber>();
  const {slowRefresh} = useRefresh();
  const bombFinance = useBulFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotal(await bombFinance.getUserAvailable(account));
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotal, bombFinance, slowRefresh, account]);

  return total;
};

export const useGetUserAmountOfDeposits = () => {
  const {account} = useWallet();
  const [total, setTotal] = useState<BigNumber>();
  const {slowRefresh} = useRefresh();
  const bombFinance = useBulFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotal(await bombFinance.getUserAmountOfDeposits(account));
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotal, bombFinance, slowRefresh, account]);

  return total;
};

export const useGetUserDepositInfo = (index: number) => {
  const {account} = useWallet();
  const [total, setTotal] = useState<DepositInfo>();
  const {slowRefresh} = useRefresh();
  const bombFinance = useBulFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotal(await bombFinance.getUserDepositInfo(account, index));
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotal, bombFinance, slowRefresh, account, index]);

  return total;
};


export default useGetPercent;
