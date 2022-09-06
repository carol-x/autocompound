from time import sleep
from pyteal import * 

ALGO_MARKET_APP = 465814065 # ALGO market on Algofi
App.globalPut(Bytes("Terminated"), Int(0))

def compound(): 

    InnerTxnBuilder.Begin(),
    InnerTxnBuilder.SetFields({
        TxnField.type_enum: TxnType.ApplicationCall,
        TxnField.application_id: Int(ALGO_MARKET_APP), 
        TxnField.application_args: ["Supply"], 
        TxnField.amount: Txn.sender().balance,
    }),
    InnerTxnBuilder.Submit(),
    while not App.globalGet(Bytes("Terminated")):
        reward = App.globalGet(Bytes("reward"))
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.ApplicationCall,
            TxnField.application_id: Int(ALGO_MARKET_APP), 
            TxnField.application_args: ["Claim"],
            TxnField.amount: reward,
        }),
        InnerTxnBuilder.Submit(),

        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.ApplicationCall,
            TxnField.application_id: Int(ALGO_MARKET_APP), 
            TxnField.application_args: ["Supply"],
            TxnField.amount: reward - 0.001,
            TxnField.fee: 0.001,
        }),
        InnerTxnBuilder.Submit(),
        sleep(60*60*24) # 7 days
    return
    
def terminate(): 
    App.globalPut(Bytes("Terminated"), Int(1))
    return 1


def approval():
    return Cond(
        [Txn.application_id() == Int(0), Approve()],
        [Txn.application_args.length() == Int(1), Return(replicate())],
    )


def clear():
    return Approve()
    
## TODO 
# 1. algofi contract abi (aka function call params) 
# 2. for loop aka how to do time delay 
# 3. easiest way to launch the smart contract & interact 
# 4. [optional] connect to a front end through a button click (connect, compound, terminate) 