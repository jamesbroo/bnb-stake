import React, { useCallback, useMemo, useState } from 'react';
import Page from '../../components/Page';
import styled, { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBulStats from '../../hooks/useBulStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebulshareStats from '../../hooks/usebulshareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { Bul as bombTesting, DShare as bulshareTesting } from '../../bomb-finance/deployments/deployments.testing.json';
import { Dgn as bombProd, DShare as bulshareProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import { Box, Button, Card, CardContent, Grid, Paper, Typography } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import BUL_BNBZapModal from '../Bank/components/BUL_BNBZapModal';
import { Alert, Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useBulFinance from '../../hooks/useBulFinance';
import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet'
import BulImage from '../../assets/img/dragon.png';
import Input from '../../components/Input'
import copy from 'copy-to-clipboard';
import Cookies from 'universal-cookie';
import { useQueryParam, StringParam } from 'use-query-params';


import kycLogo from '../../assets/img/KYC_assure.png';
import HomeImage from '../../assets/img/bg6.gif';
import { DriveEtaOutlined } from '@material-ui/icons';
import useApprove, {ApprovalState} from '../../hooks/useApprove';
import Stake from '../Bank/components/Stake';
import { addTransaction } from '../../state/transactions/actions';
import useWallet from 'use-wallet';
import {ReactComponent as IconCopy} from '../../assets/img/copy.svg';
import { isAddress } from 'ethers/lib/utils';
// import usePlanInfo from '../../hooks/useBashStake';
import useGetPercent, { useGetUserAmountOfDeposits, useGetUserAvailable, useGetUserTotalDeposits, useTotalStaked, useUserTotalDeposits } from '../../hooks/useBnbStake';
import { getBalance, getBalanceAccuracy } from '../../utils/formatBalance';
import DepositCard from './DepositCard';


export const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-blend-mode: overlay;
    background-color: #404040 !important;

  }
`;

const TITLE = 'BNB STAKE'

const Row = styled.div`
    display: flex;
    justify-content: space-around;
`

const Col = styled.div`
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
`

const InfoCard = styled(Card)`
  background-color: transparent !important;
  padding: 8px;
`

const InfoRow = styled.div`
    display: flex;
    justify-content: left;
`

const StakeBtn = styled.button`
  color: #fff;
  background-color: #f39c12;
  border-color: #f39c12;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  margin-top: 36px;
  cursor: pointer;
`

const CopyBtn  =styled.button`
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    background-color: #f39c12;
    border-color: #f39c12;
    cursor: pointer;
    &:hover {
      background-color: #d19029;
    }
    
`

const InputWrapper = styled.div`
  -webkit-box-flex: 0;
  -ms-flex: 0 0 91.666667%;
  flex: 0 0 91.666667%;
  max-width: 91.666667%;
`

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
`


// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Home = () => {
  
  const [text, setText] = useState("Copy");

  const classes = useStyles();
  const TVL = useTotalValueLocked();
  
  const bombFtmLpStats = useLpStats('DGN-BNB-LP'); 
  const bulshareFtmLpStats = useLpStats('DSHARE-BNB-LP');
  const bombStats = useBulStats();
  const bulshareStats = usebulshareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBulFinance();
  // const [approveStatus, approve] = useApprove(bombFinance.BNB, bombFinance.BASH_STAKE.address);
  const { account, connect } = useWallet();
  const [val, setVal] = useState('');
  const [val2, setVal2] = useState('');
  const [val3, setVal3] = useState('');
  const [val4, setVal4] = useState('');
  const [val5, setVal5] = useState('');
  const [val6, setVal6] = useState('');



  const cookies = new Cookies();
  const [ref, setNum] = useQueryParam('ref', StringParam);

  if(ref) {
    if(isAddress(ref)) {
      // console.log('debug ref set', cookies.set("ref", ref))
      cookies.set("ref", ref)
    }
  }

  let cref
  if(cookies.get('ref')) {
    if(isAddress( cookies.get('ref') )) {
      cref = cookies.get('ref')
    }
  } else {
    cref = "0x0000000000000000000000000000000000000000"
  }

  // const referr = '0x0000000000000000000000000000000000000000';

  const handleInvest = useCallback(
    async () => {
      const tx = await bombFinance.invest(cref, 0, val);
      addTransaction(tx, {
        summary: `Invest  ${Number(val).toFixed(2)} BNB to  ${0} Plan`,
      });
    },
    [bombFinance, addTransaction, val, cref],
  );

  const handleInvest2 = useCallback(
    async () => {
      const tx = await bombFinance.invest(cref, 1, val2);
      addTransaction(tx, {
        summary: `Invest  ${Number(val2).toFixed(2)} BNB to  ${2} Plan`,
      });
    },
    [bombFinance, addTransaction, val2, cref],
  );

  const handleInvest3 = useCallback(
    async () => {
      const tx = await bombFinance.invest(cref, 2, val3);
      addTransaction(tx, {
        summary: `Invest  ${Number(val3).toFixed(2)} BNB to  ${3} Plan`,
      });
    },
    [bombFinance, addTransaction, val3, cref],
  );

  const handleInvest4 = useCallback(
    async () => {
      const tx = await bombFinance.invest(cref, 3, val4);
      addTransaction(tx, {
        summary: `Invest  ${Number(val4).toFixed(2)} BNB to  ${4} Plan`,
      });
    },
    [bombFinance, addTransaction, val4, cref],
  );

  const handleInvest5 = useCallback(
    async () => {
      const tx = await bombFinance.invest(cref, 4, val5);
      addTransaction(tx, {
        summary: `Invest  ${Number(val5).toFixed(2)} BNB to  ${5} Plan`,
      });
    },
    [bombFinance, addTransaction, val5, cref],
  );

  const handleInvest6 = useCallback(
    async () => {
      const tx = await bombFinance.invest(cref, 5, val6);
      addTransaction(tx, {
        summary: `Invest  ${Number(val6).toFixed(2)} BNB to  ${6} Plan`,
      });
    },
    [bombFinance, addTransaction, val6, cref],
  );

  const handleWithdraw = useCallback(
    async () => {
      console.log('debug with')
      const tx = await bombFinance.withdraw();
      addTransaction(tx, {
        summary: `Withdraw`,
      });
    },
    [bombFinance, addTransaction],
  );

  const handleChange = useCallback( e => setVal(e.currentTarget.value));
  const handleChange2 = useCallback( e => setVal2(e.currentTarget.value));
  const handleChange3 = useCallback( e => setVal3(e.currentTarget.value));
  const handleChange4 = useCallback( e => setVal4(e.currentTarget.value));
  const handleChange5 = useCallback( e => setVal5(e.currentTarget.value));
  const handleChange6 = useCallback( e => setVal6(e.currentTarget.value));

  let bomb;
  let dshare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    bomb = bombTesting;
    dshare = bulshareTesting;
  } else {
    bomb = bombProd;
    dshare = bulshareProd;
  }

  const buyDgnAddress =
     'https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=' +
    // 'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=' +
    bomb.address;
  // https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyDShareAddress = 'https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=0x9234aC4E20102da445ec26797F1f617d8D6681CC';
  const dgnChartAddress = 'https://dexscreener.com/bsc/'+bomb.address;
  const dshareChartAddress = 'https://dexscreener.com/bsc/0x9234aC4E20102da445ec26797F1f617d8D6681CC'
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bulshareLPStats = useMemo(() => (bulshareFtmLpStats ? bulshareFtmLpStats : null), [bulshareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);

  const dgnTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const dsharePriceInDollars = useMemo(
    () => (bulshareStats ? Number(bulshareStats.priceInDollars).toFixed(2) : null),
    [bulshareStats],
  );
  const bulsharePriceInBNB = useMemo(
    () => (bulshareStats ? Number(bulshareStats.tokenInFtm).toFixed(4) : null),
    [bulshareStats],
  );
  const bulshareCirculatingSupply = useMemo(
    () => (bulshareStats ? String(bulshareStats.circulatingSupply) : null),
    [bulshareStats],
  );
  const bulshareTotalSupply = useMemo(() => (bulshareStats ? String(bulshareStats.totalSupply) : null), [bulshareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const bombLpZap = useZap({ depositTokenName: 'DGN-BNB-LP' });
  const bulshareLpZap = useZap({ depositTokenName: 'DSHARE-BNB-LP' });

  const [onPresentBulZap, onDissmissBulZap] = useModal(
    <BUL_BNBZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBulZap();
      }}
      tokenName={'DGN-BNB-LP'}
    />,
  );

  const [onPresentBULshareZap, onDissmissBULshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bulshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBULshareZap();
      }}
      tokenName={'DSHARE-BNB-LP'}
    />,
  );

  const onClick = () => {
    copy(`http://localhost:3000/?ref=${account}`);

    setText("Copied");
    setTimeout(() => { 
        setText("Copy"); 
    }, 1000);
}
const plan0Percent = useGetPercent(0);
const plan1Percent = useGetPercent(1);
const plan2Percent = useGetPercent(2);
const plan3Percent = useGetPercent(3);
const plan4Percent = useGetPercent(4);
const plan5Percent = useGetPercent(5);
const totalStaked = useTotalStaked();
const userTotalDeposits = useGetUserTotalDeposits();
const userAvailable = useGetUserAvailable()
const userDepositNumber = useGetUserAmountOfDeposits();
let userDepositIndexes = []
for(let i = 0; i < userDepositNumber?.toNumber(); i++) {
  userDepositIndexes.push(i);
}
  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4} style={{ textAlign: 'center' }}>
              <h2>Welcome to BNB STAKE</h2>
              <p>
                Total income: based on your tarrif plan (from 5% to 8% daily)
              </p>
              <p>
                Basic interest rate: +0.5% every 24 hours - only for new deposits
              </p>
              <p>
                Minimal deposit: 0.05 BNB, no maximal limit
              </p>
              {/* <p>
                <strong>DGN is pegged via algorithm to a 100:1 ratio to BNB.</strong>
                Stake your DGN-BTC LP in the Farm to earn DSHARE rewards. Then stake your earned DSHARE in the
                Boardroom to earn more DGN!
              </p> */}
              <p>
                <IconTelegram alt="telegram" style={{ fill: '#dddfee', height: '15px' }} /> Join our{' '}
                <a
                  href="https://t.me/BashProtocol"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{ color: '#dddfee' }}
                >
                  Telegram
                </a>{' '}
                to find out more!
              </p>
              {/* <p>
                <a href="https://www.assuredefi.io/projects/dragonfinance/"  className={'navLink ' + classes.link} rel="noopener noreferrer" target="_blank">
                KYC processed by
                <img alt="KYC logo" src={kycLogo} height="40px" style={{verticalAlign:"middle"}} />
              </a>
              </p> */}
            </Box>
          </Paper>
        </Grid>
        {/* Logo */}
        <Grid
          item
          xs={12}
          sm={4}
          style={{ display: 'flex', justifyContent: 'center', verticalAlign: 'middle', overflow: 'hidden' }}
        >
          <Col>
            <p style={{color: "white"}}> Total Staked BNB</p>
            {totalStaked ? (<h1> {getBalance(totalStaked)} BNB </h1>) : (<Skeleton type="text" />)}
            {/* <p style={{color: "white"}}> Total Contract Balance</p>
            {totalStaked ? (<h1> {getBalance(totalStaked)} BNB </h1>) : (<Skeleton type="text" />)} */}
          </Col>
        </Grid>

        {/* Plan1 */}
        <Grid item xs={12} sm={4}>

          <Card>
            <div style={{padding: "4px 8px", background: "#454545", position: "absolute", borderTopLeftRadius: "6px", borderBottomRightRadius: "6px", fontSize: "12px"}}>
              <span> Plan1 </span>
            </div>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  {plan0Percent ? (<h2> {plan0Percent.toString()} % </h2>) : (<Skeleton type="text" />)}
                </Box>
                <Box mt={3}>
                  <p> Total Return</p>
                  <h2> {Number.parseFloat(plan0Percent * 14).toFixed(3) } % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Withdraw Time</p>
                  <h2> Any Time </h2>
                </Box>
                <Box mt={3}>
                  <p> Days</p>
                  <h2> 14 </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Enter Amount</p>
                  <Input placeholder='0' onChange={handleChange}/>
                </Box>
                <Box mt={3}>
                  <p> In 14days you will get</p>
                  <h2> {Number.parseFloat(val * plan0Percent * 14 / 100).toFixed(3) } BNB </h2>
                </Box>
              </Row>
              {/* {
                approveStatus !== ApprovalState.APPROVED ? (
                  <StakeBtn
                  onClick={approve}
                  > Approve </StakeBtn>
                ) : (
                  <StakeBtn onClick={handleInvest}> STAKE BNB </StakeBtn>
                )
              } */}
              <StakeBtn onClick={handleInvest}> STAKE BNB </StakeBtn>
            </CardContent>
            
          </Card>
        </Grid>

        {/* Plan2 */}
        <Grid item xs={12} sm={4}>
          <Card>
            <div style={{padding: "4px 8px", background: "#454545", position: "absolute", borderTopLeftRadius: "6px", borderBottomRightRadius: "6px", fontSize: "12px"}}>
              <span> Plan2 </span>
            </div>
            <CardContent align="center" style={{ position: 'relative' }}>
            <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  {plan1Percent ? (<h2> {plan1Percent.toString()} % </h2>) : (<Skeleton type="text" />)}
                </Box>
                <Box mt={3}>
                  <p> Total Return</p>
                  <h2> {Number.parseFloat(plan1Percent * 21).toFixed(3) } % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Withdraw Time</p>
                  <h2> Any Time </h2>
                </Box>
                <Box mt={3}>
                  <p> Days</p>
                  <h2> 21 </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Enter Amount</p>
                  <Input placeholder='0' onChange={handleChange2}/>
                </Box>
                <Box mt={3}>
                  <p> In 21 days you will get</p>
                  <h2> {Number.parseFloat(val2 * plan1Percent * 21 / 100).toFixed(3) } BNB </h2>
                </Box>
              </Row>
              <StakeBtn onClick={handleInvest2}>STAKE BNB</StakeBtn>
            </CardContent>
            
          </Card>
        </Grid>

        {/* Plan3 */}
        <Grid item xs={12} sm={4}>
          <Card>
            <div style={{padding: "4px 8px", background: "#454545", position: "absolute", borderTopLeftRadius: "6px", borderBottomRightRadius: "6px", fontSize: "12px"}}>
              <span> Plan3 </span>
            </div>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  {plan2Percent ? (<h2> {plan2Percent.toString()} % </h2>) : (<Skeleton type="text" />)}
                </Box>
                <Box mt={3}>
                  <p> Total Return</p>
                  <h2> {Number.parseFloat(plan2Percent * 28).toFixed(3) } % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Withdraw Time</p>
                  <h2> End of Plan </h2>
                </Box>
                <Box mt={3}>
                  <p> Days</p>
                  <h2> 28 </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Enter Amount</p>
                  <Input placeholder='0' onChange={handleChange3}/>
                </Box>
                <Box mt={3}>
                  <p> In 28 days you will get</p>
                  <h2> {Number.parseFloat(val3 * plan2Percent * 28 / 100).toFixed(3)} BNB </h2>
                </Box>
              </Row>
              <StakeBtn onClick={handleInvest3}>STAKE BNB</StakeBtn>
            </CardContent>
            
          </Card>
        </Grid>

        {/* Plan4 */}
        <Grid item xs={12} sm={4}>
          <Card>
            <div style={{padding: "4px 8px", background: "#454545", position: "absolute", borderTopLeftRadius: "6px", borderBottomRightRadius: "6px", fontSize: "12px"}}>
              <span> Plan4 </span>
            </div>
            <CardContent align="center" style={{ position: 'relative' }}>
            <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  {plan3Percent ? (<h2> {plan3Percent.toString()} % </h2>) : (<Skeleton type="text" />)}
                </Box>
                <Box mt={3}>
                  <p> Total Return</p>
                  <h2> {Number.parseFloat(Math.pow(1+plan3Percent/100, 14)*100).toFixed(3) } % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Withdraw Time</p>
                  <h2> End of Plan </h2>
                </Box>
                <Box mt={3}>
                  <p> Days</p>
                  <h2> 14 </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Enter Amount</p>
                  <Input placeholder='0' onChange={handleChange4}/>
                </Box>
                <Box mt={3}>
                  <p> In 14 days you will get</p>
                  <h2> {Number.parseFloat(val4 * Math.pow(1+plan3Percent/100, 14)).toFixed(3)} BNB </h2>
                </Box>
              </Row>
              <StakeBtn onClick={handleInvest4}>STAKE BNB</StakeBtn>
            </CardContent>
            
          </Card>
        </Grid>

        {/* Plan5 */}
        <Grid item xs={12} sm={4}>
          <Card>
            <div style={{padding: "4px 8px", background: "#454545", position: "absolute", borderTopLeftRadius: "6px", borderBottomRightRadius: "6px", fontSize: "12px"}}>
              <span> Plan5 </span>
            </div>
            <CardContent align="center" style={{ position: 'relative' }}>
            <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  {plan4Percent ? (<h2> {plan4Percent.toString()} % </h2>) : (<Skeleton type="text" />)}
                </Box>
                <Box mt={3}>
                  <p> Total Return</p>
                  <h2> {Number.parseFloat(Math.pow(1+plan4Percent/100, 21)*100).toFixed(3) } % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Withdraw Time</p>
                  <h2> End of Plan </h2>
                </Box>
                <Box mt={3}>
                  <p> Days</p>
                  <h2> 21 </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Enter Amount</p>
                  <Input placeholder='0' onChange={handleChange5}/>
                </Box>
                <Box mt={3}>
                  <p> In 21 days you will get</p>
                  <h2> {Number.parseFloat(val5 * Math.pow(1+plan4Percent/100, 21)).toFixed(3)} BNB </h2>
                </Box>
              </Row>
              <StakeBtn onClick={handleInvest5}>STAKE BNB</StakeBtn>
            </CardContent>
            
          </Card>
        </Grid>

        {/* Plan6 */}
        <Grid item xs={12} sm={4}>
          <Card>
            <div style={{padding: "4px 8px", background: "#454545", position: "absolute", borderTopLeftRadius: "6px", borderBottomRightRadius: "6px", fontSize: "12px"}}>
              <span> Plan6 </span>
            </div>
            <CardContent align="center" style={{ position: 'relative' }}>
            <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  {plan5Percent ? (<h2> {plan5Percent.toString()} % </h2>) : (<Skeleton type="text" />)}
                </Box>
                <Box mt={3}>
                  <p> Total Return</p>
                  <h2> {Number.parseFloat(Math.pow(1+plan5Percent/100, 28)*100).toFixed(3) } % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Withdraw Time</p>
                  <h2> End of Plan </h2>
                </Box>
                <Box mt={3}>
                  <p> Days</p>
                  <h2> 28 </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Enter Amount</p>
                  <Input placeholder='0' onChange={handleChange6}/>
                </Box>
                <Box mt={3}>
                  <p> In 28days you will get</p>
                  <h2> {Number.parseFloat(val6 * Math.pow(1+plan5Percent/100, 28)).toFixed(3)} BNB </h2>
                </Box>
              </Row>
              <StakeBtn onClick={handleInvest6}>STAKE BNB</StakeBtn>
            </CardContent>
            
          </Card>
        </Grid>

        {/* Description */}
        <Grid item xs={12} sm={12}>
          <InfoCard>
            <InfoRow>
              <span> 1. Important: Plans return are float and daily profit for a new deposit will increase by 0.5% daily </span>
            </InfoRow>
            <InfoRow>
              <span> 2. Minimum deposit amount is 0.05 BNB and you can have multiple deposits </span>
            </InfoRow>
            <InfoRow>
              <span> 3. Earnings every moment, withdraw instantly any time (if you did not use capitalization of interest in Plan 4, Plan 5 and Plan 6) </span>
            </InfoRow>
          </InfoCard>
        </Grid>
        
        {/* Withdraw */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent align="center" style={{ position: 'relative' }}>
              <Row>
                <Box mt={3}>
                  <p> Total Staked BNB</p>
                  {userTotalDeposits ? (<h1> {getBalanceAccuracy(userTotalDeposits,18,3) / 1000} BNB </h1>) : (<Skeleton type="text" />)}
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Available BNB for withdrwal</p>
                  {userAvailable ? (<h1> {getBalanceAccuracy(userAvailable,18,3) / 1000} BNB </h1>) : (<Skeleton type="text" />)}
                </Box>
              </Row>
              <StakeBtn onClick={handleWithdraw}>Withdrw BNB</StakeBtn>
            </CardContent>
          </Card>
        </Grid>

        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper>
            <Box p={4} >
              <p>Your Referral Link</p>
              <LinkContainer>
                <InputWrapper >
                  <Input type='text' value={`https://bash.app/?ref=${account}`} height='46px' />  
                </InputWrapper>
                <div style={{padding: "0px 12px"}}>
                  <CopyBtn onClick={onClick}> <IconCopy style={{fill: '#dddfee', height: '20px'}} /> </CopyBtn>
                </div>
              </LinkContainer>
              <Row>
                <Col>
                  <p> Total Referral Earned </p>
                  <h2> 0 </h2>
                  <p> Invited Users by You </p>
                  <h2> 0 </h2>
                </Col>
                <Col>
                  <p> Total Referral Withdrawn </p>
                  <h2> 0 </h2>
                </Col>
                <Col>
                  <p> Earn for promotion BNB stake </p>
                  <p> You will receive: </p>
                  <p>
                    5% from each level 1 referral depositss
                    2.5% from each level 2 referral deposits
                    0.5% from each level 3 referral deposits
                  </p>
                  
                </Col>
              </Row>
            </Box>
          </Paper>
        </Grid>
        
        { userDepositNumber && 
        (userDepositIndexes.map(index => {
            return(
              <DepositCard id={index} />
            )
        }))

        }
      </Grid>
            
    </Page>
  );
};

export default Home;
