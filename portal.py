'''
The portal aims to establish connection with Algorand wallet, 
display user lending and borrowing information, 
suggest compounding period, 
and execute automatic compounding for the user. 

This interface uses pywebio. 
'''

from pywebio import *
from algosdk import account, encoding 


def connect_wallet(): 
    session.local.account = session.eval_js('''require(["AlgoSigner"], function(AlgoSigner) {
        AlgoSigner.connect()
        .then(() =>AlgoSigner.accounts({
            ledger: 'TestNet'
        })).then((accountData)=>{console.log(accountData); return accountData;})
        .catch((e) => {
            console.error(e);
        }
    }); ''')
    output.put_text(session.local.account)

def autocompound():
    current_url = session.eval_js("window.location.href")
    output.put_text(current_url)

    connect_wallet()

    # value = session.eval_js('''if(typeof AlgoSigner !== 'undefined') {
    #     // connects to the browser AlgoSigner instance
    #     AlgoSigner.connect()
    #     // finds the TestNet accounts currently in AlgoSigner
    #     .then(() => AlgoSigner.accounts({
    #         ledger: 'TestNet'
    #     }))
    #     .then((accountData) => {
    #         // the accountData object should contain the Algorand addresses from TestNet that AlgoSigner currently knows about
    #         console.log(accountData);
    #         accountData; 
    #     })
    #     .catch((e) => {
    #         // handle errors and perform error cleanup here
    #         console.error(e);
    #     }
    # }''')
    # if value != None:
    #     output.put_text(value.current[0].address)

    # session.run_js('''AlgoSigner.connect()
    #     .then((d) => {
    #         console.log(d); 
    #         console.log("Connected!");
    #     })
    #     .catch((e) => {
    #     console.error(e);
    #     });''')

    # session.local.account = session.eval_js('''AlgoSigner.accounts({
    #           ledger: 'TestNet'
    #         })''')

    # output.put_text(session.local.account.current[0].address)

    frequency = input.radio("Frequency of auto compounding: ", 
        options=["Every minute", "Every hour", "Every Day", "Every Week"])

    output.put_table([
        ("Col 1 Title", "Col 2 Title"),
        ("Row 1, Col 1", "Row 1, Col 2"),
        ("Row 2, Col 1", "Row 2, Col2")
    ])

    output.put_text(f'Your choice is {frequency}')

    input.radio("Confirm your selection", ["Yes"])


start_server(autocompound, port=8080, debug=True)