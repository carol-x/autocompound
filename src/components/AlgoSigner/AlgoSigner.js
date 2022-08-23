/*global AlgoSigner*/
import React, {useRef} from "react";
import ConnectAlgoSigner from "./ConnectAlgoSigner";
import SignPayTransaction from "./SignPayTransaction";
import algoSignerlogo from '../../assets/images/algosigner.jpeg'
import { AlgoSignerMain } from "./AlgoSigner.styles";
import DisplayAsset from "./DisplayAsset";
import AssetOptin from "./AssetOptin"

const AlgoSigner =  ()  =>{
    const userAccount = useRef()
    const receipient = useRef()
    const amount = useRef()


    return(
      
        <AlgoSignerMain>
            <img src= {algoSignerlogo} alt ="AlgoSigner Logo" height= "70px"/> 
            <ConnectAlgoSigner userAccount = {userAccount}/>           
            <SignPayTransaction userAccount = {userAccount} amount = {amount} receipient = {receipient} />
            <DisplayAsset userAccount = {userAccount} />
            <AssetOptin userAccount = {userAccount} />
        </AlgoSignerMain>
    )
}

export default AlgoSigner
