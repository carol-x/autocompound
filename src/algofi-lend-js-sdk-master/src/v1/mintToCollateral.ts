import {
  SuggestedParams,
  Transaction,
  makeApplicationNoOpTxn,
  makeAssetTransferTxnWithSuggestedParams,
  makePaymentTxnWithSuggestedParams
} from "algosdk"
import { TransactionGroup, Transactions } from "../utils"
import { managerStrings } from "../contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

/**
 * Returns a transaction group object representing a mint to collateral group
 * transaction against the algofi protocol. Functionality equivalent to mint + add_collateral.
 * The sender sends assets to the account of the asset market application which then calculates
 * and credits the user with an amount of collateral.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amount of asset to supply for minting collateral
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the asset market application
 * @param marketAddress - account address for the market application
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle application ids
 * @param assetId - asset id of the asset being supplied, defaults to algo
 * @returns transaction group representing a mitn to collateral group transaction
 */
export function prepareMintToCollateralTransactions(
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
    Transactions.MINT_TO_COLLATERAL,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )

  const txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.mint_to_collateral)
  ])

  const txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.mint_to_collateral)],
    [storageAccount],
    [managerAppId]
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
