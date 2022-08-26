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
 * Returns a transaction group object representing a mint group
 * transaction against the algofi protocol. bAssets are not automatically
 * posted to collateral as in `prepare_mint_to_collateral_transactions`.
 * Sender sends assets to the account of the asset market application which
 * then sends an amount of market bank assets to the user.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amount of asset to supply for minting bank assets
 * @param bankAssetId - asset id of the bank asset to be minted
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application for the bank asset
 * @param marketAddress - account address for the market application
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle application ids
 * @param assetId - asset id of the asset being supplied, defaults to algo
 * @returns transaction group object representing a mint group transaction
 */
export function prepareMintTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  bankAssetId: number,
  managerAppId: number,
  marketAppId: number,
  marketAddress: string,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[],
  assetId: number = null
): TransactionGroup {
  const prefixTransactions = getInitTxns(
    Transactions.MINT,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )

  const txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [enc.encode(managerStrings.mint)])

  const txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.mint)],
    [storageAccount],
    [managerAppId],
    [bankAssetId]
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
