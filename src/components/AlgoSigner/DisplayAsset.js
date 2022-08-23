/*global AlgoSigner*/
import React, {useRef, useState} from "react";
import { FormStyle } from "../Form.style";
import { TransactionButton } from "../Button.styles";
import { BodyText } from "../MyAlgoWallet/MyAlgoWallet.styles";
import { TOKEN, ALGOD_SERVER, PORT, RECEIVER } from "../../constants";
const algosdk = require("algosdk");
import { Market } from "../../algofi-lend-js-sdk-master/src/v1/market"
import { Client } from "../../algofi-lend-js-sdk-master/src/v1/client"

const DisplayAsset = ({userAccount}) => {

    const data = 1
    const underlying_cash =  Market.getUnderlyingCash()
    const bank_circulation = Market.getBankCirculation()
    const active_collateral = Market.getActiveCollateral()
    const underlying_borrowed =  Market.getUnderlyingBorrowed()
    const total_borrow_interest_rate =  Market.getTotalBorrowInterestRate()
    

    return(
    <div>
        <div>
            <BodyText>Your assets</BodyText>
            <table>
                <tr>
                <th>Underlying Cash</th>
                <th>Bank Circulation</th>
                <th>Active Collateral</th>
                <th>Total Borrow Interest Rate</th>
                </tr>
                <tr>
                <th>{underlying_cash}</th>
                <th>{bank_circulation}</th>
                <th>{active_collateral}</th>
                <th>{total_borrow_interest_rate}</th>
                </tr>
            </table>
        </div>
    </div>
    )
}

export default DisplayAsset