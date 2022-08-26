import {
  SuggestedParams,
  makeApplicationOptInTxn,
  makePaymentTxnWithSuggestedParams,
  getApplicationAddress,
  makeAssetTransferTxnWithSuggestedParams
} from "algosdk"
import { TransactionGroup, getRandomInt, intToBytes } from "../utils"

const OPT_IN_MIN_BALANCE = 3.5695

/**
 * Returns a transactiong roup object representing a manager opt in
 * group transaction. The sender and storage account opt in to the manager application
 * and the storage account is rekeyed to the manager account address, rendering it
 * unable to be transacted against by the sender and therefore immutable.
 *
 * @param managerAppId - id of the manager application
 * @param getMaxAtomicOptInMarketAppIds - max opt in market app ids
 * @param sender - account address for the sender
 * @param storageAddress - address of the storage account
 * @param suggestedParams - suggested transaction params
 * @returns transaction group object representing a managet opt in group transaction
 */
export function prepareManagerAppOptinTransactions(
  managerAppId: number,
  getMaxAtomicOptInMarketAppIds: number[],
  sender: string,
  storageAddress: string,
  suggestedParams: SuggestedParams
): TransactionGroup {
  const txnPayment = makePaymentTxnWithSuggestedParams(
    sender,
    storageAddress,
    Math.floor(OPT_IN_MIN_BALANCE * 1e6),
    undefined,
    undefined,
    suggestedParams
  )

  const marketOptinTransactions = []
  for (const marketAppId of getMaxAtomicOptInMarketAppIds) {
    marketOptinTransactions.push(makeApplicationOptInTxn(sender, suggestedParams, marketAppId))
  }

  const txnUserOptinManager = makeApplicationOptInTxn(sender, suggestedParams, managerAppId)

  const appAddress = getApplicationAddress(managerAppId)
  const txnStorageOptinManager = makeApplicationOptInTxn(
    storageAddress,
    suggestedParams,
    managerAppId,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    appAddress
  )
  return new TransactionGroup([txnPayment, ...marketOptinTransactions, txnUserOptinManager, txnStorageOptinManager])
}

/**
 * Returns a transaction group object representing a market opt in
 * group transaction.
 *
 * @param marketAppId -id of the market application
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @returns transaction group object representing a market opt in group transaction
 */
export function prepareMarketAppOptinTransactions(
  marketAppId: number,
  sender: string,
  suggestedParams: SuggestedParams
): TransactionGroup {
  return new TransactionGroup([
    makeApplicationOptInTxn(sender, suggestedParams, marketAppId, [intToBytes(getRandomInt(1000000))])
  ])
}

/**
 * Returns a transaction group object representing an asset opt in
 * group transaction.
 *
 * @param assetId - id of the asset to opt into
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @returns transaction group object representing an asset opt in group transaction
 */
export function prepareAssetOptinTransactions(
  assetId: number,
  sender: string,
  suggestedParams: SuggestedParams
): TransactionGroup {
  const txn = makeAssetTransferTxnWithSuggestedParams(
    sender,
    sender,
    undefined,
    undefined,
    0,
    undefined,
    assetId,
    suggestedParams
  )
  return new TransactionGroup([txn])
}
