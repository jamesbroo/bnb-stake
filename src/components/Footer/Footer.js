import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Container, Grid, Typography, Link} from '@material-ui/core';

import {ReactComponent as IconTelegram} from '../../assets/img/telegram.svg';
import {ReactComponent as IconTwitter} from '../../assets/img/twitter.svg';
import {ReactComponent as IconGithub} from '../../assets/img/github.svg';
import {ReactComponent as IconDiscord} from '../../assets/img/discord.svg';
import {ReactComponent as IconMedium} from '../../assets/img/medium.svg';
import {ReactComponent as IconReddit} from '../../assets/img/reddit.svg';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '15px',
    paddingBottom: '15px',
    width: '100%',
    color: 'white',
    backgroundColor: '#250f0d',
    textAlign: 'center',
    height: '1.3rem',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  link: {
    width: '24px',
    height: '24px',
    display: 'inline',
    marginLeft: '20px',
  },

  img: {
    width: '24px',
    height: '24px',
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body2" color="textPrimary" align="left">
              {'Copyright © '}
              <Link color="inherit" href="/">
                BASH STAKE
              </Link>{' '}
              {new Date().getFullYear()}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{textAlign: 'right', height: '20px'}}>
            <a
              href="https://twitter.com/bash_protocol"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <IconTwitter style={{fill: '#dddfee'}} />
            </a>
            {/* <a href="https://github.com/DGNfinance" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <IconGithub style={{fill: '#dddfee', height: '20px'}} />
            </a> */}
            <a href="https://t.me/BashProtocol" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <IconTelegram style={{fill: '#dddfee', height: '20px'}} />
            </a>
            <a href="https://discord.gg/F3vJ4RT9" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <IconDiscord style={{fill: '#dddfee', height: '20px'}} />
            </a>
            <a href="https://www.reddit.com/r/Bash_Protocol" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <IconReddit style={{fill: '#dddfee', height: '20px'}} />
            </a>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
