import { SuggestedParams, makeApplicationNoOpTxn } from "algosdk"
import { Transactions, intToBytes, TransactionGroup } from "../utils"
import { managerStrings } from "../contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

/**
 * Returns a transaction group object representing an borrow group
 * transaction against the algofi protocol. Protocol sends requested borrow asset
 * to the sender account provided sufficient collateral has been posted
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage address for the sender
 * @param amount - amount of asset to borrow
 * @param assetId - asset id of the asset to be borrowed
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application for the borrow asset
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle applicaiton ids
 * @returns transaction group representing a borrow group transaction
 */
export function prepareBorrowTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  assetId: number,
  managerAppId: number,
  marketAppId: number,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[]
): TransactionGroup {
  const prefixTransactions = getInitTxns(
    Transactions.BORROW,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )
  const txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.borrow),
    intToBytes(amount)
  ])

  const txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.borrow)],
    [storageAccount],
    [managerAppId],
    [assetId]
  )
  return new TransactionGroup([...prefixTransactions, txn0, txn1])
}
