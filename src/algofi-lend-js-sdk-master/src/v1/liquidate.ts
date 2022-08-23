import {
  makeAssetTransferTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
  makeApplicationNoOpTxn,
  makePaymentTxnWithSuggestedParams
} from "algosdk"
import { TransactionGroup, Transactions } from "../utils"
import { managerStrings } from "../contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

/**
 * Returns a transaction group object representing a liquidation group
 * transaction against the algofi protocol. The sender (liquidator) repays up to
 * 50% of the liquidatee's outstanding borrow and takes collateral of the liquidatee
 * at a premium defined by the market. The liquidator first sends borrow assets to the
 * account address of the borrow market. Then, the account of the collateral market is authorized
 * to credit the liquidator with a greater value of the liquidatee's collateral. The liquidator can
 * then remove collateral to underlying to convert the collateral to assets.
 *
 * @param sender -account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender (liquidator)
 * @param liquidateeStorageAccount - storage account address for liquidatee
 * @param amount - amount of borrow the liquidator repays
 * @param managerAppId - id of the manager application
 * @param borrowMarketAppId - id of the borrow market application
 * @param borrowMarketAddress - account address of the borrow market
 * @param collateralMarketAppId - id of the collateral market application
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle application ids
 * @param collateralBankAssetId - id of the collateral bank asset
 * @param borrowAssetId - id of the borrow asset, defaults to algo
 * @returns transaction group object representing a liquidate group transaction
 */
export function prepareLiquidateTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  liquidateeStorageAccount: string,
  amount: number,
  managerAppId: number,
  borrowMarketAppId: number,
  borrowMarketAddress: string,
  collateralMarketAppId: number,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[],
  collateralBankAssetId: number,
  borrowAssetId: number = null
): TransactionGroup {
  const prefixTransactions = getInitTxns(
    Transactions.LIQUIDATE,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    liquidateeStorageAccount
  )
  const txn0 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    managerAppId,
    [enc.encode(managerStrings.liquidate)],
    undefined,
    supportedMarketAppIds
  )

  const txn1 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    borrowMarketAppId,
    [enc.encode(managerStrings.liquidate)],
    [liquidateeStorageAccount],
    [managerAppId, collateralMarketAppId]
  )

  let txn2: Transaction
  if (borrowAssetId) {
    txn2 = makeAssetTransferTxnWithSuggestedParams(
      sender,
      borrowMarketAddress,
      undefined,
      undefined,
      amount,
      undefined,
      borrowAssetId,
      suggestedParams
    )
  } else {
    txn2 = makePaymentTxnWithSuggestedParams(sender, borrowMarketAddress, amount, undefined, undefined, suggestedParams)
  }

  const txn3 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    collateralMarketAppId,
    [enc.encode(managerStrings.liquidate)],
    [liquidateeStorageAccount, storageAccount],
    [managerAppId, borrowMarketAppId],
    [collateralBankAssetId]
  )

  return new TransactionGroup([...prefixTransactions, txn0, txn1, txn2, txn3])
}
