import { newAlgofiMainnetClient, newAlgofiTestnetClient } from "../v1/client"
import { printMarketState, printUserState } from "./exampleUtils"
import { mnemonicToSecretKey } from "algosdk"

export async function repayBorrowExample(
  mnemonic: string = ""
) {
  let user = mnemonicToSecretKey(mnemonic)
  let sender = user.addr
  let key = user.sk

  const buffer = "----------------------------------------------------------------------------------------------------"

  // # IS_MAINNET
  // currently hardcoding a test account
  const IS_MAINNET = false
  const client = IS_MAINNET
    ? await newAlgofiMainnetClient(undefined, undefined, sender)
    : await newAlgofiTestnetClient(undefined, undefined, sender)

  const symbol = client.getActiveOrderedSymbols()[0]

  console.log(buffer)
  console.log("Initial State")
  console.log(buffer)

  await printMarketState(client.getMarket(symbol))
  await printUserState(client, symbol, sender)
  const assetBalance = await client.getUserBalance(
    client
      .getMarket(symbol)
      .getAsset()
      .getUnderlyingAssetId()
  )
  if (assetBalance === 0) {
    throw new Error("User has no balance of asset " + symbol)
  }

  console.log(buffer)
  console.log("Processing repay_borrow transaction")
  console.log(buffer)
  console.log("Processing transaction for asset =", symbol)

  let txn = await client.prepareMintToCollateralTransactions(symbol, Math.floor(assetBalance * 0.1), sender)
  txn.signWithPrivateKey(undefined, key)
  await txn.submit(client.algod, true)

  txn = await client.prepareBorrowTransactions(symbol, Math.floor(1000), sender)
  txn.signWithPrivateKey(undefined, key)
  await txn.submit(client.algod, true)

  txn = await client.prepareRepayBorrowTransactions(symbol, Math.floor(1000), sender)
  txn.signWithPrivateKey(undefined, key)
  await txn.submit(client.algod, true)

  console.log(buffer)
  console.log("Final State")
  console.log(buffer)
  await printMarketState(client.getMarket(symbol))
  await printUserState(client, symbol, sender)
}
