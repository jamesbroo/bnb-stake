import React, {useMemo} from 'react';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';

import ListItemLink from '../ListItemLink';
import useBulStats from '../../hooks/useBondStats';
import useBtcStats from '../../hooks/useBtcStats';
import useBnbStats from '../../hooks/useBnbStats';
import useShareStats from '../../hooks/usebulshareStats';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AccountButton from './AccountButton';

import bombLogo from '../../assets/logo.png';
import kycLogo from '../../assets/img/KYC_assure.png';
import {roundAndFormatNumber} from '../../0x';
import Discord from "../../assets/discord.js";
import Twitter from "../../assets/twitter.js";
//import TokenSymbol from '../TokenSymbol';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: '#fba919',
    'background-color': '#250f0d',
    padding: '10px',
    marginBottom: '3rem',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    display: 'flex',
    justifyContent: "space-around",
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  },
  toolbarTitle: {
    fontFamily: 'Rubik',
    fontSize: '0px',
    flexGrow: 1,
  },
  link: {
    textTransform: 'uppercase',
    color: '#fba919',
    fontSize: '18px',
    marginTop: '15px',
    margin: theme.spacing(10, 1, 1, 2),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  brandLink: {
    textDecoration: 'none',
    color: '#fba919',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  social: {
    border: "none",
    display: "flex",
  },
  socialBtn: {
    height: "47px",
    width: "47px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "hsla(0,0%,100%,.1)",
    backdropFilter: "blur(18px)",
    borderRadius: "9999px",
    marginRight: "10px",
    '&:hover': {
      background: 'transparent',
    },
  },
}));


const Social = () => {
  const classes = useStyles();
  return (
    <Box className={classes.social}>
      <a className={classes.socialBtn} href="https://discord.gg/HEDGaXRE" target="_blank">
        <Discord />
      </a>
      <a className={classes.socialBtn} href="https://twitter.com/Ape2earn" target="_blank">
        <Twitter />
      </a>
    </Box>
  );
};

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const bombStats = useBulStats();
  const btcStats = useBtcStats();
  const bnbStats = useBnbStats();
  const shareStats = useShareStats();

 // const [connected, setConnected] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const btcPriceInDollars = useMemo(() => (bnbStats ? Number(bnbStats).toFixed(2) : null), [bnbStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const sharePriceInDollars = useMemo(
    () => (shareStats ? Number(shareStats.priceInDollars).toFixed(2) : null),
    [shareStats],
  );

  return (
    <AppBar position="sticky" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <div className={classes.header}>
            <Typography variant="h6" color="inherit" noWrap style={{flexGrow: '0'}} className={classes.toolbarTitle}>
              {/* <a className={ classes.brandLink } href="/">Bul Finance</a> */}
              <Link to="/" color="inherit" className={classes.brandLink}>
                <img alt="BNB STAKE" src={bombLogo} height="60px" />
              </Link>
            </Typography>
            {/* <Box style={{paddingLeft: '15px', paddingTop: '10px', fontSize: '1rem', flexGrow: '1'}}>
              <Link to="/" className={'navLink ' + classes.link}>
                Home
              </Link>
              <Link to="/farm" className={'navLink ' + classes.link}>
                Farm
              </Link>
              <Link to="/boardroom" className={'navLink ' + classes.link}>
                Boardroom
              </Link>
              <Link to="/xbul" className={'navLink ' + classes.link}>
                xDGN
              </Link>
              <Link to="/bond" className={'navLink ' + classes.link}>
                Bond
              </Link>

              <Link color="textPrimary" to="/sbs" className={classes.link}>
                SBS
              </Link>
              <Link color="textPrimary" to="/liquidity" className={classes.link}>
                Liquidity
              </Link>
              <Link color="textPrimary" to="/regulations" className={classes.link}>
                Regulations
              </Link>
              <a href="https://dragonfinance.gitbook.io/" className={'navLink ' + classes.link} rel="noopener noreferrer" target="_blank">
                Docs
              </a>
                <a href="/" style={{"pointerEvents":"none"}} className={'navLink ' + classes.link} rel="noopener noreferrer" target="_blank">
                  Fantom <span style={{"fontSize":"14px"}}>(Coming soon)</span>
              </a>
            </Box> */}

            {/* <Box
              style={{
                flexGrow: '0',
                paddingLeft: '15px',
                paddingTop: '5px',
                fontSize: '1rem',
                paddingRight: '15px',
                height: '30px',
                display: 'flex',
              }}
            >
              <div className="navTokenIcon dgn"></div>{' '}
              <div className="navTokenPrice">${roundAndFormatNumber(Number(bombPriceInDollars), 2)}</div>
              <div className="navTokenIcon dshare"></div>{' '}
              <div className="navTokenPrice">${roundAndFormatNumber(Number(sharePriceInDollars), 2)}</div>
              <div className="navTokenIcon bnb"></div>{' '}
              <div className="navTokenPrice">${roundAndFormatNumber(Number(btcPriceInDollars), 2)}</div>
            </Box> */}
            <div style={{display:'flex'}}>
              <Social />
              <AccountButton text="Connect" />
            </div>
          </div>
        ) : (
          <>
            {/* <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton> */}

            <img
              alt="BASH STAKE"
              src={bombLogo}
              style={{height: '40px', marginTop: '-10px', marginLeft: '10px', marginRight: '15px'}}
            />
            <AccountButton text="Connect" />
            {/* <Drawer
                className={classes.drawer}
                onClose={handleDrawerClose}
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? (
                    <ChevronRightIcon htmlColor="white" />
                  ) : (
                    <ChevronLeftIcon htmlColor="white" />
                  )}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItem>
                  <AccountButton text="Connect" />
                </ListItem>
                <ListItemLink primary="Home" to="/" />
                  <ListItemLink primary="Farm" to="/farm" />
                       <ListItemLink primary="xDGN" to="/xbul" />
                <ListItemLink primary="Boardroom" to="/boardroom" />
                <ListItemLink primary="Bond" to="/bond" />
                <ListItem button component="a" href="https://dragonfinance.gitbook.io/">
                  <ListItemText>Docs</ListItemText>
                  </ListItem>
                   <ListItem button component="a" href="/" style={{"pointerEvents":"none"}}>
                  <ListItemText>Fantom <span style={{"fontSize":"14px"}}>(Coming soon)</span></ListItemText>
                </ListItem>
              </List>
            </Drawer> */}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
