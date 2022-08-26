import { Indexer, Algodv2 } from "algosdk"
import { addCollateralExample } from "./addCollateral"
import { borrowExample } from "./borrow"
import { burnExample } from "./burn"
import { mintExample } from "./mint"
import { mintToCollateralExample } from "./mintToCollateral"
import { removeCollateralExample } from "./removeCollateral"
import { repayBorrowExample } from "./repayBorrow"


let algodClient = new Algodv2("", "https://api.testnet.algoexplorer.io", "")
let indexerClient = new Indexer("", "https://algoindexer.testnet.algoexplorerapi.io", "")
async function foo() {

  // // Uncomment to run add collateral example
  // await addCollateralExample()

  // // Uncomment to run borrow example
  // await borrowExample()

  // // Uncomment to run burn example
  // await burnExample() 

  // // Uncomment to run liquidate example
  // NOT TESTED YET BC NOONE LIQUIDATABLE READILY AVAILABLE

  // // Uncomment to run mint example
  // await mintExample()

  // // Uncomment to run mint to collateral example
  // await mintToCollateralExample()

  // // Uncomment to run remove collateral example
  // await removeCollateralExample()

  // // Uncomment to run repay borrow example
  // await repayBorrowExample()
}

foo()

