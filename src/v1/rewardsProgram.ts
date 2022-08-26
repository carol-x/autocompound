import algosdk from "algosdk"
import { PARAMETER_SCALE_FACTOR, REWARDS_SCALE_FACTOR, SCALE_FACTOR } from "./config"
import { managerStrings } from "../contractStrings"
import { getGlobalState, readLocalState, get, intToBytes } from "../utils"
import { Market } from "./market"
import { Manager } from "./manager"

export class RewardsProgram {
  algod: algosdk.Algodv2
  latestRewardsTime: number
  rewardsProgramNumber: number
  rewardsAmount: number
  rewardsPerSecond: number
  rewardsAssetId: number
  rewardsSecondaryRatio: number
  rewardsSecondaryAssetId: number

  /**
   * Constructor for RewardsProgram class
   *
   * @param algodClient - algod client
   * @param managerState - state of manager application we are interested in
   */
  constructor(algodClient: algosdk.Algodv2, managerState: {}) {
    this.algod = algodClient
    this.latestRewardsTime = get(managerState, managerStrings.latest_rewards_time, 0)
    this.rewardsProgramNumber = get(managerState, managerStrings.n_rewards_programs, 0)
    this.rewardsAmount = get(managerState, managerStrings.rewards_amount, 0)
    this.rewardsPerSecond = get(managerState, managerStrings.rewards_per_second, 0)
    this.rewardsAssetId = get(managerState, managerStrings.rewards_asset_id, 0)
    this.rewardsSecondaryRatio = get(managerState, managerStrings.rewards_secondary_ratio, 0)
    this.rewardsSecondaryAssetId = get(managerState, managerStrings.rewards_secondary_asset_id, 0)
  }

  /**
   * Return a list of current rewards assets
   *
   * @returns rewards asset list
   */
  getRewardsAssetIds(): number[] {
    const result = []
    if (this.rewardsAssetId > 1) {
      result.push(this.rewardsAssetId)
    }
    if (this.rewardsSecondaryAssetId > 1) {
      result.push(this.rewardsSecondaryAssetId)
    }
    return result
  }

  /**
   * Return latest rewards time
   *
   * @returns latest rewards time
   */
  getLatestRewardsTime(): number {
    return this.latestRewardsTime
  }

  /**
   * Return rewards program number
   *
   * @returns rewards program number
   */
  getRewardsProgramNumber(): number {
    return this.rewardsProgramNumber
  }

  /**
   * Return rewards amount
   *
   * @returns rewards amount
   */
  getRewardsAmount(): number {
    return this.rewardsAmount
  }

  /**
   * Return rewards per second
   *
   * @returns rewards per second
   */
  getRewardsPerSecond(): number {
    return this.rewardsPerSecond
  }

  /**
   * Return rewards asset id
   *
   * @returns rewards asset id
   */
  getRewardsAssetId(): number {
    return this.rewardsAssetId
  }

  /**
   * Returns rewards secondary ratio
   *
   * @returns rewards secondary ratio
   */
  getRewardsSecondaryRatio(): number {
    return this.rewardsSecondaryRatio
  }

  /**
   * Return rewards secondary asset id
   *
   * @returns rewards secondary asset id
   */
  getRewardsSecondaryAssetId(): number {
    return this.rewardsSecondaryAssetId
  }

  /**
   * Return the projected claimable rewards for a given storage address
   *
   * @param storageAddress - storage address of unrealized rewards
   * @param manager - manager for unrealized rewards
   * @param markets - list of markets for unrealized rewards
   * @returns two element list of primary and secondary unrealized rewards
   */
  async getStorageUnrealizedRewards(storageAddress: string, manager: Manager, markets: Market[]): Promise<number[]> {
    const managerState = await getGlobalState(this.algod, manager.getManagerAppId())
    const managerStorageState = await readLocalState(this.algod, storageAddress, manager.getManagerAppId())
    const onCurrentProgram =
      this.getRewardsProgramNumber() === get(managerStorageState, managerStrings.user_rewards_program_number, 0)
    let totalUnrealizedRewards = onCurrentProgram ? get(managerStorageState, managerStrings.user_pending_rewards, 0) : 0
    let totalSecondaryUnrealizedRewards = onCurrentProgram
      ? get(managerStorageState, managerStrings.user_secondary_pending_rewards, 0)
      : 0

    let totalBorrowUsd = 0
    for (const market of markets) {
      totalBorrowUsd += await market.getAsset().toUSD(await market.getUnderlyingBorrowed())
    }

    const date = new Date()
    const timeElapsed = Math.floor(date.getTime() / 1000 - this.getLatestRewardsTime())
    const rewardsIssued = this.getRewardsAmount() > 0 ? timeElapsed * this.getRewardsPerSecond() : 0

    for (const market of markets) {
      const marketCounterPrefix = Buffer.from(intToBytes(market.getMarketCounter())).toString("utf-8")
      const coefficient = get(managerState, marketCounterPrefix + managerStrings.counter_indexed_rewards_coefficient, 0)

      // Ask about defuault value for get function here
      const userCoefficient: number = onCurrentProgram
        ? managerStorageState[marketCounterPrefix + managerStrings.counter_to_user_rewards_coefficient_initial]
        : 0

      const marketUnderlyingTvl =
        (await market.getUnderlyingBorrowed()) +
        (market.getActiveCollateral() * market.getBankToUnderlyingExchange()) / SCALE_FACTOR

      const projectedCoefficient =
        coefficient +
        Math.floor(
          (rewardsIssued *
            REWARDS_SCALE_FACTOR *
            (await market.getAsset().toUSD(await market.getUnderlyingBorrowed()))) /
            (totalBorrowUsd * marketUnderlyingTvl)
        )

      const marketStorageState = await market.getStorageState(storageAddress)

      const unrealizedRewards = Math.floor(
        ((projectedCoefficient - userCoefficient) *
          (marketStorageState.activeCollateralUnderlying + marketStorageState.borrowUnderlying)) /
          REWARDS_SCALE_FACTOR
      )

      const secondaryUnrealizedRewards = Math.floor(
        (unrealizedRewards * this.getRewardsSecondaryRatio()) / PARAMETER_SCALE_FACTOR
      )

      totalUnrealizedRewards += unrealizedRewards
      totalSecondaryUnrealizedRewards += secondaryUnrealizedRewards
    }
    return [totalUnrealizedRewards, totalSecondaryUnrealizedRewards]
  }
}
