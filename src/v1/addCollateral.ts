import { SuggestedParams, makeApplicationNoOpTxn, makeAssetTransferTxnWithSuggestedParams } from "algosdk"
import { Transactions, TransactionGroup } from "../utils"
import { managerStrings } from "../contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

/**
 *
 * Returns a TransactionGroup object representing an add collateral group
 * transaction against the algofi protocol. Sender adds bank assets to collateral by sending
 * them to the account address of the market application that generates the bank assets.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for the sender
 * @param amount - amount of bank asset to add to collateral
 * @param bankAssetId - asset ids of the bank asset
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application for the bank asset
 * @param marketAddress - account address for the market application
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle application ids
 * @returns TransactionGroup object representing an add collateral group transaction
 */
export function prepareAddCollateralTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  bankAssetId: number,
  managerAppId: number,
  marketAppId: number,
  marketAddress: string,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[]
): TransactionGroup {
  const prefixTransactions = getInitTxns(
    Transactions.ADD_COLLATERAL,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )

  const txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.add_collateral)
  ])

  const txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.add_collateral)],
    [storageAccount],
    [managerAppId]
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
