import React, {useCallback, useMemo} from 'react';
import Page from '../../components/Page';
import {createGlobalStyle} from 'styled-components';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {useWallet} from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
//import useBulStats from '../../hooks/useBulStats';
import useBulFinance from '../../hooks/useBulFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import {useTransactionAdder} from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import {getDisplayBalance} from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import { Alert } from '@material-ui/lab';
import { Grid, Box } from '@material-ui/core';
import { Helmet } from 'react-helmet';

import {BackgroundImage} from '../Home/Home.js';
const TITLE = 'BASH STAKE'

const Bond: React.FC = () => {
  const {path} = useRouteMatch();
  const {account} = useWallet();
  const bombFinance = useBulFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  //const bombStat = useBulStats();
  const cashPrice = useCashPriceInLastTWAP();

  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(bombFinance?.DBOND);
  //const scalingFactor = useMemo(() => (cashPrice ? Number(cashPrice) : null), [cashPrice]);
  
  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} DBOND with ${amount} DGN`,
      });
    },
    [bombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, {summary: `Redeem ${amount} DBOND`});
    },
    [bombFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  const isBondPayingPremium = useMemo(() => Number(bondStat?.tokenInFtm) >= 1.1, [bondStat]);
  const bondScale = (Number(cashPrice) / 10000000000000000).toFixed(2); 

  return (
    <Switch>
      <Page>
        <BackgroundImage />
              <Helmet>
        <title>{TITLE}</title>
      </Helmet>
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader icon={'💣'} title="Buy &amp; Redeem Bonds" subtitle="Earn premiums upon redemption" />
            </Route>
            {isBondPayingPremium === false ? (


              <Box mt={5}>
                <Grid item xs={12} sm={12} justify="center" style={{ margin: '18px', display: 'flex' }}>
                <Alert variant="filled" severity="error">
                    <b>
                      Claiming below 1.1 peg will not receive a redemption bonus, claim wisely!</b>
              </Alert>
            
              </Grid>
              </Box>
            ) : <></>}
          
            <StyledBond>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Purchase"
                  fromToken={bombFinance.DGN}
                  fromTokenName="DGN"
                  toToken={bombFinance.DBOND}
                  toTokenName="DBOND"
                  priceDesc={
                    !isBondPurchasable
                      ? 'DGN is over peg'
                      : getDisplayBalance(bondsPurchasable, 18, 2) + ' DBOND available for purchase'
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="100 DGN"
                  description="Last-Hour TWAP Price"
                  //price={Number(bombStat?.tokenInFtm).toFixed(4) || '-'}
                 price={bondScale || '-'}

                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="100 DBOND"
                  description="Current Price: (DGN)^2"
                  price={Number(bondStat?.tokenInFtm).toFixed(4) || '-'}
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={bombFinance.DBOND}
                  fromTokenName="DBOND"
                  toToken={bombFinance.DGN}
                  toTokenName="DGN"
                  priceDesc={`${getDisplayBalance(bondBalance)} DBOND Available in wallet`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                  disabledDescription={!isBondRedeemable ? `Enabled when 100 DGN > ${BOND_REDEEM_PRICE}BNB` : null}
                />
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Bond;
