import { SuggestedParams, makeApplicationNoOpTxn, Transaction } from "algosdk"
import { Transactions, getRandomInt, intToBytes } from "../utils"
import { managerStrings } from "../contractStrings"

const NUM_DUMMY_TXNS = 9
const dummyTxnNumToWord = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten"
}

/**
 * Returns a transaction group object representing the initial transactions
 * executed by the algofi protocol during a standard group transaction. The transactions are
 * (1) fetch market variables, (2) update prices, (3) update protocol data, and (4) degenerate ("dummy")
 * transactions to increase the number of cost units allowed (currently each transactions affords 700
 * additional cost units).
 *
 * @param transactionType - transactions enum representing the group transaction the init transactions are used for
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param managerAppId - id of the manager application
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle application ids
 * @param storageAccount - account address for the storage account
 * @returns account address for the storage account
 */
export function getInitTxns(
  transactionType: Transactions,
  sender: string,
  suggestedParams: SuggestedParams,
  managerAppId: number,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[],
  storageAccount: string
): Transaction[] {
  const suggestedParamsModified = JSON.parse(JSON.stringify(suggestedParams))
  const listTxnTypes = [
    Transactions.MINT,
    Transactions.BURN,
    Transactions.REMOVE_COLLATERAL,
    Transactions.REMOVE_COLLATERAL_UNDERLYING,
    Transactions.BORROW,
    Transactions.REPAY_BORROW,
    Transactions.LIQUIDATE,
    Transactions.CLAIM_REWARDS
  ]
  if (listTxnTypes.includes(transactionType)) {
    suggestedParamsModified.fee = 2000
  }

  const enc = new TextEncoder()

  const txn0 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    managerAppId,
    [enc.encode(managerStrings.fetch_market_variables)],
    undefined,
    supportedMarketAppIds,
    undefined,
    intToBytes(getRandomInt(1000000))
  )

  const txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParamsModified,
    managerAppId,
    [enc.encode(managerStrings.update_prices)],
    undefined,
    supportedOracleAppIds
  )

  const txn2 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    managerAppId,
    [enc.encode(managerStrings.update_protocol_data)],
    [storageAccount],
    supportedMarketAppIds
  )

  const dummyTxns = []

  for (let i = 1; i < NUM_DUMMY_TXNS + 1; i++) {
    const txn = makeApplicationNoOpTxn(
      sender,
      suggestedParams,
      managerAppId,
      [enc.encode(`dummy_${dummyTxnNumToWord[i]}`)],
      undefined,
      supportedMarketAppIds
    )
    dummyTxns.push(txn)
  }
  return [txn0, txn1, txn2, ...dummyTxns]
}
