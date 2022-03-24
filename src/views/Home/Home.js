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
import { Alert } from '@material-ui/lab';
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
import HomeImage from '../../assets/img/background.jpg';
import { DriveEtaOutlined } from '@material-ui/icons';
import useApprove, {ApprovalState} from '../../hooks/useApprove';
import Stake from '../Bank/components/Stake';
import { addTransaction } from '../../state/transactions/actions';
import useWallet from 'use-wallet';
import {ReactComponent as IconCopy} from '../../assets/img/copy.svg';
import { isAddress } from 'ethers/lib/utils';
import usePlanInfo from '../../hooks/useBashStake';



export const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-blend-mode: overlay;
    background-color: #404040 !important;

  }
`;

const TITLE = 'BASH STAKE'

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
  margin-top: 4px;
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
  const [approveStatus, approve] = useApprove(bombFinance.BASH, bombFinance.BASH_STAKE.address);
  const { account, connect } = useWallet();
  const [val, setVal] = useState('');

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
        summary: `Invest  ${Number(val).toFixed(2)} Bash to  ${0} Plan`,
      });
    },
    [bombFinance, addTransaction, val, cref],
  );

  const handleChange = useCallback( e => setVal(e.currentTarget.value));

  let bomb;
  let dshare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    bomb = bombTesting;
    dshare = bulshareTesting;
  } else {
    bomb = bombProd;
    dshare = bulshareProd;
  }

  const planInfo = usePlanInfo(0);
  console.log('debug plan info', planInfo)
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
              <h2>Welcome to BASH STAKE</h2>
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
          <img src={BulImage} alt='BASH STAKE' style={{ maxHeight: '240px' }} />
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
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <Input placeholder='0' onChange={handleChange}/>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              {
                approveStatus !== ApprovalState.APPROVED ? (
                  <StakeBtn
                  onClick={approve}
                  > Approve </StakeBtn>
                ) : (
                  <StakeBtn onClick={handleInvest}> STAKE BASH </StakeBtn>
                )
              }
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
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <Input placeholder='0' />
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <StakeBtn>STAKE BASH</StakeBtn>
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
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <Input placeholder='0' />
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <StakeBtn>STAKE BASH</StakeBtn>
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
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <Input placeholder='0' />
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <StakeBtn>STAKE BASH</StakeBtn>
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
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <Input placeholder='0' />
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <StakeBtn>STAKE BASH</StakeBtn>
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
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 0 % </h2>
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> daily profit</p>
                  <Input placeholder='0' />
                </Box>
                <Box mt={3}>
                  <p> daily profit</p>
                  <h2> 1 % </h2>
                </Box>
              </Row>
              <StakeBtn>STAKE BASH</StakeBtn>
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
                  <p> Total Staked BASH</p>
                  <h2> 0  </h2>
                </Box>
              </Row>
              <Row>
                <Box mt={3}>
                  <p> Available Bash for withdrwal</p>
                  <h2> 0  </h2>
                </Box>
              </Row>
              <StakeBtn>STAKE BASH</StakeBtn>
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
                  <p> Earn for promotion BASH stake </p>
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

      </Grid>
            
    </Page>
  );
};

export default Home;
