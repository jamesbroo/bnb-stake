import {useEffect, useState} from 'react';
import useBulFinance from './useBulFinance';
import {BigNumber} from 'ethers';
import useRefresh from './useRefresh';
import { DepositInfo, PlanInfo, ResultInfo } from '../bomb-finance/types';

const usePlanInfo = (plan : string) => {
  const [currentEpoch, setCurrentEpoch] = useState<PlanInfo>();
  const bombFinance = useBulFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setCurrentEpoch(await bombFinance.getPlanInfo(plan));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setCurrentEpoch, bombFinance, slowRefresh, plan]);

  return currentEpoch;
};

export const useResultInfo = (plan : string, deposit : string) => {
  const [currentEpoch, setCurrentEpoch] = useState<ResultInfo>();
  const bombFinance = useBulFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setCurrentEpoch(await bombFinance.getResult(plan, deposit));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setCurrentEpoch, bombFinance, slowRefresh, plan, deposit]);

  return currentEpoch;
};

const useUserAmountDeposits = (address : string) => {
  const [currentEpoch, setCurrentEpoch] = useState<BigNumber>(BigNumber.from(0));
  const bombFinance = useBulFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setCurrentEpoch(await bombFinance.getUserAmountOfDeposits(address));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setCurrentEpoch, bombFinance, slowRefresh, address]);

  return currentEpoch;
};

const useUserAvailable = (address : string) => {
  const [currentEpoch, setCurrentEpoch] = useState<BigNumber>(BigNumber.from(0));
  const bombFinance = useBulFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setCurrentEpoch(await bombFinance.getUserAvailable(address));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setCurrentEpoch, bombFinance, slowRefresh, address]);

  return currentEpoch;
};

const useUserDepositInfo = (address : string, index : string) => {
  const [currentEpoch, setCurrentEpoch] = useState<DepositInfo>();
  const bombFinance = useBulFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setCurrentEpoch(await bombFinance.getUserDepositInfo(address, index));
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setCurrentEpoch, bombFinance, slowRefresh, address]);

  return currentEpoch;
};


export default usePlanInfo;
