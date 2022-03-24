import React, {/*useCallback, useEffect, */ useMemo, useState} from 'react';
import Page from '../../components/Page';
import BondImage from '../../assets/img/pit.png';
import {createGlobalStyle} from 'styled-components';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {useWallet} from 'use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import {Box, /* Paper, Typography,*/ Button, Grid} from '@material-ui/core';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBulFinance from '../../hooks/useBulFinance';
import {getDisplayBalance /*, getBalance*/} from '../../utils/formatBalance';
import {BigNumber /*, ethers*/} from 'ethers';
import useSwapDBondToDShare from '../../hooks/DShareSwapper/useSwapBBondToDShare';
import useApprove, {ApprovalState} from '../../hooks/useApprove';
import useDShareSwapperStats from '../../hooks/DShareSwapper/useDShareSwapperStats';
import TokenInput from '../../components/TokenInput';
import Card from '../../components/Card';
import CardContent from '../../components/CardContent';
import TokenSymbol from '../../components/TokenSymbol';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${BondImage}) no-repeat !important;
    background-size: cover !important;
    background-color: #322221e4;
  }
`;

function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const Sbs: React.FC = () => {
  const {path} = useRouteMatch();
  const {account} = useWallet();
  const bombFinance = useBulFinance();
  const [bbondAmount, setBbondAmount] = useState('');
  const [bulshareAmount, setBULshareAmount] = useState('');

  const [approveStatus, approve] = useApprove(bombFinance.DBOND, bombFinance.contracts.DShareSwapper.address);
  const {onSwapDShare} = useSwapDBondToDShare();
  const bulshareSwapperStat = useDShareSwapperStats(account);

  const bulshareBalance = useMemo(
    () => (bulshareSwapperStat ? Number(bulshareSwapperStat.bulshareBalance) : 0),
    [bulshareSwapperStat],
  );
  const bondBalance = useMemo(
    () => (bulshareSwapperStat ? Number(bulshareSwapperStat.bbondBalance) : 0),
    [bulshareSwapperStat],
  );

  const handleDBondChange = async (e: any) => {
    if (e.currentTarget.value === '') {
      setBbondAmount('');
      setBULshareAmount('');
      return;
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setBbondAmount(e.currentTarget.value);
    const updateDShareAmount = await bombFinance.estimateAmountOfDShare(e.currentTarget.value);
    setBULshareAmount(updateDShareAmount);
  };

  const handleDBondSelectMax = async () => {
    setBbondAmount(String(bondBalance));
    const updateDShareAmount = await bombFinance.estimateAmountOfDShare(String(bondBalance));
    setBULshareAmount(updateDShareAmount);
  };

  const handleDShareSelectMax = async () => {
    setBULshareAmount(String(bulshareBalance));
    const rateDSharePerBul = (await bombFinance.getDShareSwapperStat(account)).rateDSharePerBul;
    const updateDBondAmount = BigNumber.from(10)
      .pow(30)
      .div(BigNumber.from(rateDSharePerBul))
      .mul(Number(bulshareBalance) * 1e6);
    setBbondAmount(getDisplayBalance(updateDBondAmount, 18, 6));
  };

  const handleDShareChange = async (e: any) => {
    const inputData = e.currentTarget.value;
    if (inputData === '') {
      setBULshareAmount('');
      setBbondAmount('');
      return;
    }
    if (!isNumeric(inputData)) return;
    setBULshareAmount(inputData);
    const rateDSharePerBul = (await bombFinance.getDShareSwapperStat(account)).rateDSharePerBul;
    const updateDBondAmount = BigNumber.from(10)
      .pow(30)
      .div(BigNumber.from(rateDSharePerBul))
      .mul(Number(inputData) * 1e6);
    setBbondAmount(getDisplayBalance(updateDBondAmount, 18, 6));
  };

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader icon={'💣'} title="DBond -> DShare Swap" subtitle="Swap DBond to DShare" />
            </Route>
            <Box mt={5}>
              <Grid container justify="center" spacing={6}>
                <StyledBoardroom>
                  <StyledCardsWrapper>
                    <StyledCardWrapper>
                      <Card>
                        <CardContent>
                          <StyledCardContentInner>
                            <StyledCardTitle>DBonds</StyledCardTitle>
                            <StyledExchanger>
                              <StyledToken>
                                <StyledCardIcon>
                                  <TokenSymbol symbol={bombFinance.DBOND.symbol} size={54} />
                                </StyledCardIcon>
                              </StyledToken>
                            </StyledExchanger>
                            <Grid item xs={12}>
                              <TokenInput
                                onSelectMax={handleDBondSelectMax}
                                onChange={handleDBondChange}
                                value={bbondAmount}
                                max={bondBalance}
                                symbol="DBond"
                              ></TokenInput>
                            </Grid>
                            <StyledDesc>{`${bondBalance} DBOND Available in Wallet`}</StyledDesc>
                          </StyledCardContentInner>
                        </CardContent>
                      </Card>
                    </StyledCardWrapper>
                    <Spacer size="lg" />
                    <StyledCardWrapper>
                      <Card>
                        <CardContent>
                          <StyledCardContentInner>
                            <StyledCardTitle>DShare</StyledCardTitle>
                            <StyledExchanger>
                              <StyledToken>
                                <StyledCardIcon>
                                  <TokenSymbol symbol={bombFinance.DSHARE.symbol} size={54} />
                                </StyledCardIcon>
                              </StyledToken>
                            </StyledExchanger>
                            <Grid item xs={12}>
                              <TokenInput
                                onSelectMax={handleDShareSelectMax}
                                onChange={handleDShareChange}
                                value={bulshareAmount}
                                max={bulshareBalance}
                                symbol="DShare"
                              ></TokenInput>
                            </Grid>
                            <StyledDesc>{`${bulshareBalance} DSHARE Available in Swapper`}</StyledDesc>
                          </StyledCardContentInner>
                        </CardContent>
                      </Card>
                    </StyledCardWrapper>
                  </StyledCardsWrapper>
                </StyledBoardroom>
              </Grid>
            </Box>

            <Box mt={5}>
              <Grid container justify="center">
                <Grid item xs={8}>
                  <Card>
                    <CardContent>
                      <StyledApproveWrapper>
                        {approveStatus !== ApprovalState.APPROVED ? (
                          <Button
                            disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                            color="primary"
                            variant="contained"
                            onClick={approve}
                            size="medium"
                          >
                            Approve DBOND
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={() => onSwapDShare(bbondAmount.toString())}
                            size="medium"
                          >
                            Swap
                          </Button>
                        )}
                      </StyledApproveWrapper>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
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
    width: 100%;
  }
`;

const StyledApproveWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`;
const StyledCardTitle = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  height: 64px;
  justify-content: center;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledCardIcon = styled.div`
  background-color: ${(props) => props.theme.color.grey[900]};
  width: 72px;
  height: 72px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledDesc = styled.span``;

export default Sbs;
