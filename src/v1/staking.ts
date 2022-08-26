import {
  SuggestedParams,
  Transaction,
  makeApplicationOptInTxn,
  getApplicationAddress,
  makePaymentTxnWithSuggestedParams,
  makeApplicationNoOpTxn,
  makeAssetTransferTxnWithSuggestedParams
} from "algosdk"
import { getInitTxns } from "./prepend"
import { Transactions, intToBytes, TransactionGroup } from "../utils"
import { managerStrings } from "../contractStrings"

const OPT_IN_MIN_BALANCE = 0.65
const enc = new TextEncoder()

/**
 * Returns a transaction group object representing a staking contract opt in
 * group transaction. The sender and storage account opt in to the staking application
 * and the storage account is rekeyed to the manager account address, rendering it
 * unable to be transacted against by the sender and therefore immutable.
 *
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application
 * @param sender - account address of the sender
 * @param storageAddress - address of the storage account
 * @param suggestedParams - suggested transaction params
 * @returns transaction group object representing a manger opt in group transaction
 */
export function prepareStakingContractOptinTransactions(
  managerAppId: number,
  marketAppId: number,
  sender: string,
  storageAddress: string,
  suggestedParams: SuggestedParams
): TransactionGroup {
  const txnPayment = makePaymentTxnWithSuggestedParams(
    sender,
    storageAddress,
    Math.floor(1000000 * OPT_IN_MIN_BALANCE),
    undefined,
    undefined,
    suggestedParams
  )

  const txnMarket = makeApplicationOptInTxn(sender, suggestedParams, marketAppId)

  const txnUserOptInManager = makeApplicationOptInTxn(sender, suggestedParams, managerAppId)

  const appAddress = getApplicationAddress(managerAppId)

  const txnStorageOptInManager = makeApplicationOptInTxn(
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

  return new TransactionGroup([txnPayment, txnMarket, txnUserOptInManager, txnStorageOptInManager])
}

/**
 * Returns a transaction group object representing a stake
 * transaction against the algofi protocol. The sender sends assets to the
 * staking account and is credited with a stake.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amount of asset to supply for minting collateral
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the asset market application
 * @param marketAddress - account address for the market application
 * @param oracleAppId - id of the aset market application
 * @param assetId - asset id of the asset being supplied, defaults to algo
 * @returns transaction group object representing a mint to collateral group transaction
 */
export function prepareStakeTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  managerAppId: number,
  marketAppId: number,
  marketAddress: string,
  oracleAppId: number,
  assetId: number = null
): TransactionGroup {
  const supportedOracleAppIds = [oracleAppId]
  const supportedMarketAppIds = [marketAppId]
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

/**
 * Returns a :class:`TransactionGroup` object representing a remove stake
 * group transaction against the algofi protocol. The sender requests to remove stake
 * from a stake acount and if successful, the stake is removed.
 *
 * @param sender - account addres for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param amount - amount of collateral to remove from the market
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application of the collateral
 * @param oracleAppId - id of the oracle application of the collateral
 * @param assetId - id of the asset to unstake
 * @returns transaction group object representing a unstake group transaction
 */
export function prepareUnstakeTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  amount: number,
  managerAppId: number,
  marketAppId: number,
  oracleAppId: number,
  assetId: number = null
): TransactionGroup {
  const supportedMarketAppIds = [marketAppId]
  const supportedOracleAppIds = [oracleAppId]
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
  let txn1: Transaction
  if (assetId) {
    txn1 = makeApplicationNoOpTxn(
      sender,
      suggestedParams,
      marketAppId,
      [enc.encode(managerStrings.remove_collateral_underlying)],
      [storageAccount],
      [managerAppId],
      [assetId]
    )
  } else {
    txn1 = makeApplicationNoOpTxn(
      sender,
      suggestedParams,
      marketAppId,
      [enc.encode(managerStrings.remove_collateral_underlying)],
      [storageAccount],
      [managerAppId]
    )
  }

  return new TransactionGroup([...prefixTransactions, txn0, txn1])
}

/**
 * Returns a transaction group object representing a claim rewards
 * underlying group transaction against the algofi protocol. The sender requests
 * to claim rewards from the manager acount. If not, the account sends
 * back the user the amount of asset underlying their posted collateral.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - astorage account address for sender
 * @param managerAppId - id of the manager application
 * @param marketAppId - id of the market application of the collateral
 * @param oracleAppId - id of the oracle application
 * @param foreignAssets - list of reward assets in the staking contract
 * @returns transaction group obejct representing a claim rewards transaction
 */
export function prepareClaimStakingRewardsTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  managerAppId: number,
  marketAppId: number,
  oracleAppId: number,
  foreignAssets: number[]
): TransactionGroup {
  const supportedMarketAppIds = [marketAppId]
  const supportedOracleAppIds = [oracleAppId]
  const prefixTransactions = getInitTxns(
    Transactions.CLAIM_REWARDS,
    sender,
    suggestedParams,
    managerAppId,
    supportedMarketAppIds,
    supportedOracleAppIds,
    storageAccount
  )
  const txn0 = makeApplicationNoOpTxn(
    sender,
    suggestedParams,
    managerAppId,
    [enc.encode(managerStrings.claim_rewards)],
    [storageAccount],
    undefined,
    foreignAssets
  )

  return new TransactionGroup([...prefixTransactions, txn0])
}
