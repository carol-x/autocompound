import { makeApplicationNoOpTxn, SuggestedParams } from "algosdk"
import { TransactionGroup, Transactions, intToBytes } from "../utils"
import { managerStrings } from "../contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

/**
 * Returns a transaction group object representing a remove collateral
 * underlying group transaction against the algofi protocol. Functionally equivalent to
 * remove collateral + burn. The sender requests to remove collateral from a market acount
 * after which the application determines if the removal puts the sender's health ratio
 * below 1. If not, the account sends back the user the amount of asset underlying their posted collateral.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amount of collateral to remove from the market
 * @param assetId - asset id of the asset underlying the collateral
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application of the collateral
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle application ids
 * @returns transaction group object representing a remove collateral underlying group transaction
 */
export function prepareRemoveCollateralUnderlyingTransactions(
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
    Transactions.REMOVE_COLLATERAL_UNDERLYING,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )
  const txn0 = makeApplicationNoOpTxn(sender, suggestedParams, managerAppId, [
    enc.encode(managerStrings.remove_collateral_underlying),
    intToBytes(amount)
  ])
  const txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    marketAppId,
    [enc.encode(managerStrings.remove_collateral_underlying)],
    [storageAccount],
    [managerAppId],
    [assetId]
  )
  return new TransactionGroup([...prefixTransactions, txn0, txn1])
}
