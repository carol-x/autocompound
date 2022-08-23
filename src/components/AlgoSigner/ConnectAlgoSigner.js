/*global AlgoSigner*/

import React from "react";
import { Button } from "../Button.styles";

const ConnectAlgoSigner = ({userAccount}) => {

    const connectAlgoSigner = async () =>{
        let resp = await AlgoSigner.connect()
        console.log(resp)
        getUserAccount()
      }
  
      const getUserAccount = async () =>{
         userAccount.current =  await AlgoSigner.accounts({
              ledger: 'TestNet'
            })
      // console.log(userAccount.current[0]['address'])
      console.log(userAccount.current)
  
      }
      return(
        (userAccount.current == null && userAccount.current[0].address == null) ?
        <div>
          <Button backgroundColor='blue' onClick={connectAlgoSigner}>
          Connect AlgoSigner
          </Button>
        </div> :
        <div>
        <Button backgroundColor='white' onClick={()=>{}}>
        Connected
        </Button>
        <p>User account: {userAccount.current[0].address}</p>
      </div> 
        
      )
}

export default ConnectAlgoSigner