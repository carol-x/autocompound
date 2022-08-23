import { Algodv2, encodeAddress, getApplicationAddress } from "algosdk"
import { getGlobalState, readLocalState, get } from "../utils"
import { managerStrings } from "../contractStrings"
import { RewardsProgram } from "./rewardsProgram"
import { Market } from "./market"

export class Manager {
  algod: Algodv2
  managerAppId: number
  managerAddress: string
  rewardsProgram: RewardsProgram

  /**
   * This is the constructor for the Manager class.
   *
   * **Note, do not call this to create a new manager**. Instead call
   * the static method init as there are asynchronous set up steps in
   * creating an manager and a constructor can only return an instance of
   * the class and not a promise.
   *
   * #### Example
   * ```typescript
   * //Correct way to instantiate new manager
   * const newManager = await Manager.init(algodClient, managerAppId)
   *
   * //Incorrect way to instantiate new manager
   * const newManager = new Manager(algodClient, managerAppId)
   * ```
   *
   * @param algodClient - algod client
   * @param managerAppId - id of the manager application
   */
  constructor(algodClient: Algodv2, managerAppId: number) {
    this.algod = algodClient
    this.managerAppId = managerAppId
    this.managerAddress = getApplicationAddress(this.managerAppId)
  }

  /**
   * This is the function that should be called when creating a new manager.
   * You pass everything you would to the constructor, but to this function
   * instead and this returns the new and created manager.
   *
   * #### Example
   * ```typescript
   * //Correct way to instantiate new manager
   * const newManager = await Manager.init(algodClient, managerAppId)
   *
   * //Incorrect way to instantiate new manager
   * const newManager = new Manager(algodClient, managerAppId)
   * ```
   *
   * @param algodClient - algod client
   * @param managerAppId - id of the manager application
   * @returns an instance of the manager class fully constructed
   */
  static async init(algodClient: Algodv2, managerAppId: number) {
    const manager = new Manager(algodClient, managerAppId)
    await manager.updateGlobalState()
    return manager
  }

  /**
   * Method to fetch most recent manager global state
   */
  async updateGlobalState(): Promise<void> {
    const managerState = await getGlobalState(this.algod, this.managerAppId)
    this.rewardsProgram = new RewardsProgram(this.algod, managerState)
  }

  /**
   * Return manager app id
   *
   * @returns manager app id
   */
  getManagerAppId(): number {
    return this.managerAppId
  }

  /**
   * Return manager address
   *
   * @returns manager address
   */
  getManagerAddress(): string {
    return this.managerAddress
  }

  /**
   * Returns rewards program
   *
   * @returns rewards program
   */
  getRewardsProgram(): RewardsProgram {
    return this.rewardsProgram
  }

  /**
   * Reeturns the storage addres for the client user
   *
   * @param address - address to get info for
   * @returns storage account address for user
   */
  async getStorageAddress(address: string): Promise<string> {
    const userManagerState = await readLocalState(this.algod, address, this.managerAppId)
    const rawStorageAddress = get(userManagerState, managerStrings.user_storage_address, null)

    if (!rawStorageAddress) {
      throw new Error("No storage address found")
    }
    return encodeAddress(Buffer.from(rawStorageAddress.trim(), "base64"))
  }

  /**
   * Returns the market local state for the provided address
   *
   * @param address - address to get info for
   * @returns market local state for address
   */
  async getUserState(address: string): Promise<{}> {
    const userState = await this.getStorageState(await this.getStorageAddress(address))
    return userState
  }

  /**
   * Returns the market local state for storage address
   *
   * @param storageAddress - storage address to get info for
   * @returns market local state for storage address
   */
  async getStorageState(storageAddress: string): Promise<{}> {
    const result: { [key:string]: any } = {}
    const userState = await readLocalState(this.algod, storageAddress, this.managerAppId)
    result.user_global_max_borrow_in_dollars = get(userState, managerStrings.user_global_max_borrow_in_dollars, 0)
    result.user_global_borrowed_in_dollars = get(userState, managerStrings.user_global_borrowed_in_dollars, 0)
    return result
  }

  /**
   * Returns projected unrealized rewards for a user address
   *
   * @param address - address to get unrealized rewards for
   * @param markets - list of markets
   * @returns two element list of primary and secondary unrealized rewards
   */
  async getUserUnrealizedRewards(address: string, markets: Market[]): Promise<any[]> {
    return this.getStorageUnrealizedRewards(await this.getStorageAddress(address), markets)
  }

  /**
   * Returns projected unrealized rewards for storage address
   *
   * @param storageAddress - storage address to get unrealized rewards for
   * @param markets - list of markets
   * @returns two element list of primary and secondary unrealized rewards
   */
  async getStorageUnrealizedRewards(storageAddress: string, markets: Market[]): Promise<any[]> {
    const storageUnrealizedRewards = await this.getRewardsProgram().getStorageUnrealizedRewards(
      storageAddress,
      this,
      markets
    )
    return storageUnrealizedRewards
  }
}
