import { newAlgofiMainnetClient, newAlgofiTestnetClient } from "../v1/client"
import { printMarketState, printUserState } from "./exampleUtils"
import { mnemonicToSecretKey } from "algosdk"


export async function liquidateExample(
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

  const collateralSymbol = client.getActiveOrderedSymbols()[0]
  const borrowSymbol = client.getActiveOrderedSymbols()[1]

  const targetAddress = "ENTER ADRESS HERE"
  const targetStorageAddress = "ENTER STORAGE ADDRESS HERE"

  const amount = 100

  console.log(buffer)
  console.log("Initial State")
  console.log(buffer)

  printUserState(client, borrowSymbol, targetAddress)
  printUserState(client, collateralSymbol, targetAddress)
  printMarketState(client.getMarket(borrowSymbol))
  printMarketState(client.getMarket(collateralSymbol))

  const assetBalance = await client.getUserBalance(
    client
      .getMarket(borrowSymbol)
      .getAsset()
      .getUnderlyingAssetId()
  )
  if (assetBalance === 0) {
    throw new Error("User has no balance of asset " + borrowSymbol)
  }

  console.log(buffer)
  console.log("Processing liquidation transaction")
  console.log(buffer)
  console.log(`Processing transaction for borrow asset = ${borrowSymbol} and collateral asset = ${collateralSymbol}`)

  let txn = await client.prepareLiquidateTransactions(targetStorageAddress, borrowSymbol, amount, collateralSymbol)
  txn.signWithPrivateKey(key)
  await txn.submit(client.algodClient, true)

  console.log(buffer)
  console.log("Final State")
  console.log(buffer)
  printMarketState(client.getMarket(borrowSymbol))
  printUserState(client, borrowSymbol, sender)
}
