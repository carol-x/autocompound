import { makeApplicationNoOpTxn, SuggestedParams } from "algosdk"
import { TransactionGroup, Transactions } from "../utils"
import { managerStrings } from "../contractStrings"
import { getInitTxns } from "./prepend"

const enc = new TextEncoder()

/**
 * Returns a :class:`TransactionGroup` object representing a claim rewards
 * underlying group transaction against the algofi protocol. The sender requests
 * to claim rewards from the manager acount. If not, the account sends
 * back the user the amount of asset underlying their posted collateral.
 *
 * @param sender - account address for the sender
 * @param suggestedParams - suggested transaction params
 * @param storageAccount - storage account address for sender
 * @param managerAppId - id of the manager application
 * @param supportedMarketAppIds - list of supported market application ids
 * @param supportedOracleAppIds - list of supported oracle application ids
 * @param foreignAssets - list of rewards assets in the staking contract
 * @returns transaction group object representing a claim rewards transaction
 */
export function prepareClaimRewardsTransactions(
  sender: string,
  suggestedParams: SuggestedParams,
  storageAccount: string,
  managerAppId: number,
  supportedMarketAppIds: number[],
  supportedOracleAppIds: number[],
  foreignAssets: number[]
) {
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
