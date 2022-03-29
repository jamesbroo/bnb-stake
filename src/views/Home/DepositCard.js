import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from "@material-ui/core";
import styled, { createGlobalStyle } from 'styled-components';
import { useGetUserDepositInfo } from '../../hooks/useBnbStake';
import { getBalanceAccuracy, getBalance } from "../../utils/formatBalance";


const StyledCard = styled(Card)`
    background: #000;
    border: 1px solid #454545;
    border-radius: 8px;
`
const Row = styled.div`
    display: flex;
    justify-content: space-around;
`

function DepositCard({id}) {

    const info = useGetUserDepositInfo(id);
    var startDate = new Date(info?.start * 1000);
    const strStart = (startDate?.getMonth()+1).toString() + '/' + (startDate?.getDate()).toString()

    var finishDate = new Date(info?.finish * 1000);
    const strFinish = (finishDate?.getMonth()+1).toString() + '/' + (finishDate?.getDate()).toString()
    return(
        <Grid item xs={12} sm={4}>
            <StyledCard>
                <Row>
                    <div>
                        <p> plan {info?.plan}</p>
                        <p> percent {info?.percent / 10}</p>
                    </div>
                    <div>
                        <p>From:  {strStart} </p>
                        <p>To:  {strFinish} </p>
                    </div>
                </Row>
                <Row>
                <h2> {getBalanceAccuracy(info?.amount, 18,2) / 100} BNB</h2>
                <h2> {getBalanceAccuracy(info?.profit, 18, 3) / 1000} BNB</h2>
                </Row>

            </StyledCard>
        </Grid>
    )
}

export default DepositCard