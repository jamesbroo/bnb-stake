import React from 'react';

//Graveyard ecosystem logos
import bombLogo from '../../assets/img/dragon.png';
import tShareLogo from '../../assets/img/dshares.png';
import bombLogoPNG from '../../assets/img/dragon.png';
import xbulLogo from '../../assets/img/xbul.png';

import tShareLogoPNG from '../../assets/img/dshares.png';
import tBondLogo from '../../assets/img/dbond.png';

import bombFtmLpLogo from '../../assets/img/bomb-bitcoin-LP.png';
import bulshareFtmLpLogo from '../../assets/img/dshare-bnb-LP.png';
import usdcLogo from '../../assets/img/USDC.png';
import bnbLogo from '../../assets/img/bnb.png';
import btcLogo from '../../assets/img/BCTB-icon.png';
import dogeLogo from '../../assets/img/DOGE-icon.png';
import ethLogo from '../../assets/img/ETH-icon.png';
import FtmLogo from '../../assets/img/WFTM.png';
import BusdLogo from '../../assets/img/BUSD.png';
const logosBySymbol: {[title: string]: string} = {
  //Real tokens
  //=====================
  DGN: bombLogo,
  BULPNG: bombLogoPNG,
  DSHAREPNG: tShareLogoPNG,
  XBUL: xbulLogo,
  DSHARE: tShareLogo,
  DBOND: tBondLogo,
  WBNB: bnbLogo,
  BOO: bnbLogo,
  ZOO: bnbLogo,
  CAKE: bnbLogo,
  SUSD: bnbLogo,
  SBTC: btcLogo,
  BTCB: btcLogo,
  BTC: btcLogo,
  SVL: bnbLogo,
  DOGE: dogeLogo,
  ETH: ethLogo,
  USDC: usdcLogo,
  FTM: FtmLogo,
  BUSD: BusdLogo,
  'DGN-BNB-LP': bombFtmLpLogo,
  'DGN-BTCB-LP': bombFtmLpLogo,
  'DSHARE-BNB-LP': bulshareFtmLpLogo,
  'DSHARE-BNB-APELP': bulshareFtmLpLogo,
  'DGN-BTCB-APELP': bombFtmLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({symbol, size = 64}) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
