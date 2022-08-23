import {
  makeApplicationNoOpTxn,
  makeAssetTransferTxnWithSuggestedParams,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction
} from "algosdk"
import { TransactionGroup, Transactions } from "../utils"
import { managerStrings } from "../contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

/**
 * Returns a transaction group object representing a repay borrow
 * group transaction against the algofi protocol. The sender repays assets to the
 * market of the borrow asset after which the market application decreases the
 * outstanding borrow amount for the sender.
 *
 * @param sender - account address for sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amoutn of borrow asset to repay
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application of the borrow asset
 * @param marketAddress - account address for the market application
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle application ids
 * @param assetId - asset id of the borrow asset, defaults to algo
 * @returns transaction group object representing a repay borrow group transaction
 */
export function prepareRepayBorrowTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  managerAppId: number,
  marketAppId: number,
  marketAddress: string,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[],
  assetId: number = null
): TransactionGroup {
  const prefixTransactions = getInitTxns(
    Transactions.REPAY_BORROW,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )

  const txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode(managerStrings.repay_borrow)])

  const txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.repay_borrow)],
    [storageAccount],
    [managerAppId],
    assetId ? [assetId] : []
  )

  let txn2: Transaction
  if (assetId) {
    txn2 = makeAssetTransferTxnWithSuggestedParams(
      sender,
      marketAddress,
      undefined,
      undefined,
      amount,
      undefined,
      assetId,
      suggestedParams
    )
  } else {
    txn2 = makePaymentTxnWithSuggestedParams(sender, marketAddress, amount, undefined, undefined, suggestedParams)
  }

  return new TransactionGroup([...prefixTransactions, txn0, txn1, txn2])
}
