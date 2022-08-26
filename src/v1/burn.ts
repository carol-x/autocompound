import { makeApplicationNoOpTxn, makeAssetTransferTxnWithSuggestedParams, SuggestedParams } from "algosdk"
import { TransactionGroup, Transactions } from "../utils"
import { managerStrings } from "../contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

/**
 * Returns a transaction group object representing a burn group
 * transaction against the algofi protocol. Sender burns bank assets by sending them
 * to the account address of the market application for the bank asset which in turn
 * converts them to their underlying asset and sends back.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amount of bank asset to burn
 * @param assetId - asset id of the bank asset's underlying asset
 * @param bankAssetId - id of the bank asset to burn
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the amrekt application for the bank asset
 * @param marketAddress - account address for the market application
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle app ids
 * @returns transaction group object representing a burn group transaction
 */
export function prepareBurnTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  assetId: number,
  bankAssetId: number,
  managerAppId: number,
  marketAppId: number,
  marketAddress: string,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[]
): TransactionGroup {
  const prefixTransactions = getInitTxns(
    Transactions.BURN,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )
  const txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode(managerStrings.burn)])
  const txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.burn)],
    [storageAccount],
    [managerAppId],
    [assetId]
  )
  const txn2 = makeAssetTransferTxnWithSuggestedParams(
    sender,
    marketAddress,
    undefined,
    undefined,
    amount,
    undefined,
    bankAssetId,
    suggestedParams
  )
  return new TransactionGroup([...prefixTransactions, txn0, txn1, txn2])
}
