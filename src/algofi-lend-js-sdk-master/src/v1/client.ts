import { Algodv2, Indexer, SuggestedParams, waitForConfirmation } from "algosdk"
import {
  getInitRound,
  getOrderedSymbols,
  getManagerAppId,
  getMarketAppId,
  getStakingContracts,
  get,
  TransactionGroup
} from "../utils"
import { prepareClaimStakingRewardsTransactions, prepareStakeTransactions, prepareUnstakeTransactions } from "./staking"
import { prepareRemoveCollateralUnderlyingTransactions } from "./removeCollateralUnderlying"
import { prepareMintToCollateralTransactions } from "./mintToCollateral"
import { prepareRemoveCollateralTransactions } from "./removeCollateral"
import { prepareAddCollateralTransactions } from "./addCollateral"
import { prepareClaimRewardsTransactions } from "./claimRewards"
import { prepareRepayBorrowTransactions } from "./repayBorrow"
import { prepareManagerAppOptinTransactions } from "./optin"
import { prepareLiquidateTransactions } from "./liquidate"
import { prepareBorrowTransactions } from "./borrow"
import { StakingContract } from "./stakingContract"
import { prepareBurnTransactions } from "./burn"
import { prepareMintTransactions } from "./mint"
import { Manager } from "./manager"
import { Market } from "./market"
import { Asset } from "./asset"

export class Client {
  scaleFactor: number
  borrowSharesInit: number
  parameterScaleFactor: number
  algod: Algodv2
  indexerClient: Indexer
  historicalIndexer: Indexer
  chain: string
  userAddress: string
  initRound: number
  activeOrderedSymbols: string[]
  maxOrderedSymbols: string[]
  maxAtomicOptInOrderedSymbols: string[]
  manager: Manager
  markets: { [key: string]: Market }
  stakingContractInfo: { [key: string]: { [key: string]: number } }
  stakingContracts: { [key: string]: StakingContract }

  /**
   *
   * This is the constructor for the Client class.
   *
   * **Note, do not call this to create a new client**. Instead call
   * the static method init as there are asynchronous set up steps in
   * creating an client and a constructor can only return an instance of
   * the class and not a promise.
   *
   * #### Example
   * ```typescript
   * //Correct way to instantiate new client
   * const client = await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
   *
   * //Incorrect way to instantiate new client
   * const client = new Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
   * ```
   *
   * @param algodClient - algod client
   * @param indexerClient - indexer client
   * @param historicalIndexerClient - indexer client
   * @param userAddress - account address of user
   * @param chain - specified chain we want the client to run on
   */
  constructor(
    algodClient: Algodv2,
    indexerClient: Indexer,
    historicalIndexerClient: Indexer,
    userAddress: string,
    chain: string
  ) {
    this.scaleFactor = 1e9
    this.borrowSharesInit = 1e3
    this.parameterScaleFactor = 1e3
    this.algod = algodClient
    this.indexerClient = indexerClient
    this.historicalIndexer = historicalIndexerClient
    this.chain = chain
    this.userAddress = userAddress
    this.initRound = getInitRound(this.chain)
    this.activeOrderedSymbols = getOrderedSymbols(this.chain)
    this.maxOrderedSymbols = getOrderedSymbols(this.chain, true)
    this.maxAtomicOptInOrderedSymbols = getOrderedSymbols(this.chain, undefined, true)
    this.stakingContractInfo = getStakingContracts(this.chain)
  }

  /**
   * This is the function that should be called when creating a new client.
   * You pass everything you would to the constructor, but to this function
   * instead and this returns the new and created client.
   *
   * #### Example
   * ```typescript
   * //Correct way to instantiate new client
   * const client = await Client.init(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
   *
   * //Incorrect way to instantiate new client
   * const client = new Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
   * ```
   *
   * @param algodClient - algod client
   * @param indexerClient - indexer client
   * @param historicalIndexerClient - indexer client
   * @param userAddress - account address of user
   * @param chain - specified chain we want the client to run on
   * @returns an instance of the client class fully constructed
   */
  static async init(
    algodClient: Algodv2,
    indexerClient: Indexer,
    historicalIndexerClient: Indexer,
    userAddress: string,
    chain: string,
    fetchStaking: boolean = false
  ): Promise<Client> {
    const client = new Client(algodClient, indexerClient, historicalIndexerClient, userAddress, chain)
    client.markets = {}
    for (const symbol of client.activeOrderedSymbols) {
      client.markets[symbol] = await Market.init(
        algodClient,
        historicalIndexerClient,
        getMarketAppId(client.chain, symbol)
      )
    }
    client.stakingContracts = {}
    if (fetchStaking) {
      for (const title of Object.keys(client.stakingContractInfo)) {
        client.stakingContracts[title] = await StakingContract.init(
          client.algod,
          client.historicalIndexer,
          client.stakingContractInfo[title]
        )
      }
    }
    client.manager = await Manager.init(client.algod, getManagerAppId(client.chain))
    return client
  }

  /**
   * Initializes the transactions parameters for the client.
   *
   * @returns default parameters for transactions
   */
  async getDefaultParams(): Promise<SuggestedParams> {
    const params = await this.algod.getTransactionParams().do()
    params.flatFee = true
    params.fee = 1000
    return params
  }

  /**
   * Returns a dictionary of information about the user.
   *
   * @param address - address to get info for
   * @returns a dictionary of information about the user
   */
  async getUserInfo(address: string = null): Promise<{ [key: string]: any }> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const userInfo = await this.algod.accountInformation(addr).do()
    return userInfo
  }

  /**
   * Returns a boolean if the user address is opted into an application with id appId.
   *
   * @param appId - id of the application
   * @param address - address to get information for
   * @returns boolean if user is opted into application with id appId
   */
  async isOptedIntoApp(appId: number, address: string = null): Promise<boolean> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const userInfo = await this.getUserInfo(addr)
    const optedInIds = []
    for (const app of userInfo["apps-local-state"]) {
      optedInIds.push(app.id)
    }
    return optedInIds.includes(appId)
  }

  /**
   * Returns a boolean if the user is opted into an asset with id assetId.
   *
   * @param assetId - id of the asset
   * @param address - address to get info for
   * @returns boolean if user is opted into an asset
   */
  async isOptedIntoAsset(assetId: number, address: string = null): Promise<boolean> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const userInfo = await this.getUserInfo(addr)
    const assets = []
    for (const asset of userInfo.assets) {
      assets.push(asset["asset-id"])
    }
    return assets.includes(assetId)
  }

  /**
   * Returns a dictionary of user balances by assetid.
   *
   * @param address - address to get info for
   * @returns amount of asset
   */
  async getUserBalances(address: string = null): Promise<{ [key: string]: number }> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const userInfo = await this.getUserInfo(addr)
    const balances = {}
    for (const asset of userInfo.assets) {
      balances[asset["asset-id"]] = asset.amount
    }
    balances[1] = userInfo.amount
    return balances
  }

  /**
   * Returns amount of asset in user's balance with asset id assetId.
   *
   * @param assetId - id of the asset,
   * @param address - address to get info for
   * @returns amount of asset that the user has
   */
  async getUserBalance(assetId: number = 1, address: string = null): Promise<number> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const userBalances = await this.getUserBalances(addr)
    return get(userBalances, assetId, 0)
  }

  /**
   * Returns a dictionary with the lending market state for a given address (must be opted in).
   *
   * @param address - address to get info for; if null, will use address supplied when creating client
   * @returns dictionary that represents the state of user
   */
  async getUserState(address: string = null): Promise<{ [key: string]: any }> {
    let addr = address
    const result: { [key: string]: any } = {}
    if (!addr) {
      addr = this.userAddress
    }
    result.markets = {}
    result.manager = await this.manager.getUserState(addr)
    const storageAddress = await this.manager.getStorageAddress(addr)

    for (const symbol of this.activeOrderedSymbols) {
      result.markets[symbol] = await this.markets[symbol].getStorageState(storageAddress)
    }
    result.storageAddress = storageAddress
    return result
  }

  /**
   * Returns a dictionary witht he lending market state for a given storage address.
   *
   * @param storageAddress - address to get info for; if null will use address supplied when creating client
   * @returns dictionary that represents the storage state of a user
   */
  async getStorageState(storageAddress: string = null): Promise<{ [key: string]: any }> {
    let addr = storageAddress
    const result: { [key: string]: any } = {}
    if (!addr) {
      addr = await this.manager.getStorageAddress(this.userAddress)
    }
    result.manager = this.manager.getStorageState(addr)
    for (const symbol of this.activeOrderedSymbols) {
      result[symbol] = this.markets[symbol].getStorageState(addr)
    }
    return result
  }

  /**
   * Returns a dictionary with the staking contract state for the named staking contract and selected address
   *
   * @param stakingContractName - name of the staking contract to query
   * @param address - address to get info for; if null will use address supplied when creating client
   * @returns state representing staking contract info of user
   */
  async getUserStakingContractState(stakingContractName: string, address: string = null): Promise<{}> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const userState = await this.stakingContracts[stakingContractName].getUserState(addr)
    return userState
  }

  // GETTERS
  /**
   * Returns the manager object representing the manager of this client.
   *
   * @returns manager
   */
  getManager(): Manager {
    return this.manager
  }

  /**
   * Returns the market object for the given symbol.
   *
   * @param symbol - market symbol
   * @returns market
   */
  getMarket(symbol: string): Market {
    return this.markets[symbol]
  }

  /**
   * Returns a dictionary of active markets by symbol
   *
   * @returns markets dictionary
   */
  getActiveMarkets(): { [key: string]: Market } {
    const activeMarkets = {}
    for (const [key, value] of Object.entries(this.markets)) {
      if (this.activeOrderedSymbols.includes(key)) {
        activeMarkets[key] = value
      }
    }
    return activeMarkets
  }

  /**
   * Returns a staking contract with the given title
   *
   * @param title - staking contract name
   * @returns staking contract with the given name
   */
  getStakingContract(title: string): StakingContract {
    return this.stakingContracts[title]
  }

  /**
   * Returns a ditionary of all staking contracts
   *
   * @returns staking contracts dictionary
   */
  getStakingContracts(): { [key: string]: StakingContract } {
    return this.stakingContracts
  }

  /**
   * Returns the asset object for the requested symbol
   *
   * @param symbol - symbol of the asset
   * @returns asset object with the provided symbol
   */
  getAsset(symbol: string): Asset {
    if (!this.activeOrderedSymbols.includes(symbol)) {
      throw new Error("Unsupported asset")
    }
    return this.markets[symbol].getAsset()
  }

  /**
   * Returns the max opt in market application ids
   *
   * @returns list of max opt in market application ids
   */
  getMaxAtomicOptInMarketAppIds(): number[] {
    const maxOptInMarketAppIds = []
    for (const symbol of this.maxAtomicOptInOrderedSymbols) {
      maxOptInMarketAppIds.push(this.markets[symbol].getMarketAppId())
    }
    return maxOptInMarketAppIds
  }

  /**
   * Returns a dictionary of the asset objects for each active market
   *
   * @returns dictionary of asset objects
   */
  getActiveAssets(): { [key: string]: Asset } {
    const activeAssets = {}
    for (const [symbol, market] of Object.entries(this.getActiveMarkets())) {
      activeAssets[symbol] = market.getAsset()
    }
    return activeAssets
  }

  /**
   * Returns the active asset ids
   *
   * @returns list of active asset ids
   */
  getActiveAssetIds(): number[] {
    const activeAssetIds = []
    for (const asset of Object.values(this.getActiveAssets())) {
      activeAssetIds.push(asset.getUnderlyingAssetId())
    }
    return activeAssetIds
  }

  /**
   * Returns the active bank asset ids
   *
   * @returns list of active bank asset ids
   */
  getActiveBankAssetIds(): number[] {
    const activeBankAssetIds = []
    for (const asset of Object.values(this.getActiveAssets())) {
      activeBankAssetIds.push(asset.getBankAssetId())
    }
    return activeBankAssetIds
  }

  /**
   * Returns the list of symbols of the active assets
   *
   * @returns list of symbols for active assets
   */
  getActiveOrderedSymbols(): string[] {
    return this.activeOrderedSymbols
  }

  /**
   * Returns a dictionary of raw oracle prices of the active assets pulled from their oracles
   *
   * @returns dictionary of int prices
   */
  getRawPrices(): { [key: string]: number } {
    const rawPrices = {}
    for (const [symbol, market] of Object.entries(this.getActiveMarkets())) {
      rawPrices[symbol] = market.getAsset().getRawPrice()
    }
    return rawPrices
  }

  /**
   * Returns a dictionary of dollarized float prices of the assets pulled from their oracles
   *
   * @returns dictionary of int prices
   */
  getPrices(): { [key: string]: number } {
    const prices = {}
    for (const [symbol, market] of Object.entries(this.getActiveMarkets())) {
      prices[symbol] = market.getAsset().getPrice()
    }
    return prices
  }

  /**
   * Returns a list of storage accounts for the given manager app id
   *
   * @param stakingContractName - name of staking contract
   * @returns list of storage accounts
   */
  async getStorageAccounts(stakingContractName: string = null): Promise<{}[]> {
    let nextPage = ""
    const accounts = []
    let appId: number
    if (stakingContractName === null) {
      appId = Object.values(this.getActiveMarkets())[0].getMarketAppId()
    } else {
      appId = this.getStakingContract(stakingContractName).getManagerAppId()
    }
    while (nextPage !== null) {
      console.log(nextPage)
      const accountData = await this.indexerClient
        .searchAccounts()
        .applicationID(appId)
        .nextToken(nextPage)
        .do()
      for (const account of accountData.accounts) {
        accounts.push(account)
      }
      if (accountData.includes("next-token")) {
        nextPage = accountData["next-token"]
      } else {
        nextPage = null
      }
    }
    return accounts
  }

  /**
   * Returns the list of active oracle app ids
   *
   * @returns list of acdtive oracle app ids
   */
  getActiveOracleAppIds(): number[] {
    const activeOracleAppIds = []
    for (const market of Object.values(this.getActiveMarkets())) {
      activeOracleAppIds.push(market.getAsset().getOracleAppId())
    }
    return activeOracleAppIds
  }

  /**
   * Returns the list of the active market app ids
   *
   * @returns list of active market app ids
   */
  getActiveMarketAppIds(): number[] {
    const activeMarketAppIds = []
    for (const market of Object.values(this.getActiveMarkets())) {
      activeMarketAppIds.push(market.getMarketAppId())
    }
    return activeMarketAppIds
  }

  /**
   * Returns the list of the active market addresses
   *
   * @returns list of active market addresses
   */
  getActiveMarketAddresses(): string[] {
    const activeMarketAddresses = []
    for (const market of Object.values(this.getActiveMarkets())) {
      activeMarketAddresses.push(market.getMarketAddress())
    }
    return activeMarketAddresses
  }

  /**
   * Returns an opt in transaction group
   *
   * @param storageAddress - storage address to fund and rekey
   * @param address - address to send add collateral transaction group from; defulats to client user address
   * @returns
   */
  async prepareOptinTransactions(storageAddress: string, address: string = null): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    return prepareManagerAppOptinTransactions(
      this.manager.getManagerAppId(),
      this.getMaxAtomicOptInMarketAppIds(),
      addr,
      storageAddress,
      await this.getDefaultParams()
    )
  }

  /**
   * Returns an add collateral transaction group
   *
   * @param symbol - symbol to add collateral with
   * @param amount - amount of collateral to add
   * @param address - address to send add collateral transaction group from; defaults to clint user address
   * @returns
   */
  async prepareAddCollateralTransactions(
    symbol: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const market = this.getMarket(symbol)
    return prepareAddCollateralTransactions(
      addr,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(addr),
      amount,
      market.getAsset().getBankAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      market.getMarketAddress(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds()
    )
  }

  /**
   * Returns a borrow transaction group
   *
   * @param symbol - symbol to borrow
   * @param amount - amount to borrow
   * @param address - address to send borrow transaction group from; defaults to client user address
   * @returns borrow transaction group
   */
  async prepareBorrowTransactions(symbol: string, amount: number, address: string = null): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const market = this.getMarket(symbol)
    return prepareBorrowTransactions(
      addr,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(addr),
      amount,
      market.getAsset().getUnderlyingAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds()
    )
  }

  /**
   * Returns a burn transaction group
   *
   * @param symbol - symbol to burn
   * @param amount - amount of bAsset to burn
   * @param address - address to send burn transaction group from; defaults to client user address
   * @returns burn transaction group
   */
  async prepareBurnTransactions(symbol: string, amount: number, address: string = null): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const market = this.getMarket(symbol)
    return prepareBurnTransactions(
      addr,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(addr),
      amount,
      market.getAsset().getUnderlyingAssetId(),
      market.getAsset().getBankAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      market.getMarketAddress(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds()
    )
  }

  /**
   * Returns a claim rewards transaction group
   *
   * @param address - address to send claim rewards from; defaults to client user address
   * @returns claim rewards transaction group
   */
  async prepareClaimRewardsTransactions(address: string = null): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    return prepareClaimRewardsTransactions(
      addr,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(addr),
      this.manager.getManagerAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      this.manager.getRewardsProgram().getRewardsAssetIds()
    )
  }

  /**
   * Returns a liquidate transaction group
   *
   * @param targetStorageAddress - storage address to liquidate
   * @param borrowSymbol - symbol to repay
   * @param amount - amount to repay
   * @param collateralSymbol - symbol to seize collateral from
   * @param address - address to send liquidate transaction group from; defaults to client user address
   * @returns liquidate transaction group
   */
  async prepareLiquidateTransactions(
    targetStorageAddress: string,
    borrowSymbol: string,
    amount: number,
    collateralSymbol: string,
    address: string = null
  ): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const borrowMarket = this.getMarket(borrowSymbol)
    const collateralMarket = this.getMarket(collateralSymbol)
    return prepareLiquidateTransactions(
      addr,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(addr),
      targetStorageAddress,
      amount,
      this.manager.getManagerAppId(),
      borrowMarket.getMarketAppId(),
      borrowMarket.getMarketAddress(),
      collateralMarket.getMarketAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      collateralMarket.getAsset().getBankAssetId(),
      borrowSymbol !== "ALGO" ? borrowMarket.getAsset().getUnderlyingAssetId() : undefined
    )
  }

  /**
   * Returns a mint transaction group
   *
   * @param symbol - symbol to mint
   * @param amount - amount of mint
   * @param address - address to send mint transacdtion group from; defaults to client user address
   * @returns mint transaction group
   */
  async prepareMintTransactions(symbol: string, amount: number, address: string = null): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const market = this.getMarket(symbol)
    return prepareMintTransactions(
      addr,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(addr),
      amount,
      market.getAsset().getBankAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      market.getMarketAddress(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      symbol !== "ALGO" ? market.getAsset().getUnderlyingAssetId() : undefined
    )
  }

  /**
   * Returns a mint to collateral transaction group
   *
   * @param symbol - symbol to mint
   * @param amount - amount to mint to collateral
   * @param address - address to send mint to collateral transaction group from; defaults to client user address
   * @returns mint to collateral transaction group
   */
  async prepareMintToCollateralTransactions(
    symbol: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const market = this.getMarket(symbol)
    return prepareMintToCollateralTransactions(
      addr,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(addr),
      amount,
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      market.getMarketAddress(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      symbol !== "ALGO" ? market.getAsset().getUnderlyingAssetId() : undefined
    )
  }

  /**
   * Returns a remove collateral transaction group
   *
   * @param symbol - symbol to remove collateral from
   * @param amount - amount of collateral to remove
   * @param address - address to send remove collateral transaction group from; defaults to client user address
   * @returns remove collateral transaction group
   */
  async prepareRemoveCollateralTransactions(
    symbol: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const market = this.getMarket(symbol)
    return prepareRemoveCollateralTransactions(
      addr,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(addr),
      amount,
      market.getAsset().getBankAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds()
    )
  }

  /**
   * Returns a remove collateral undrlying transaction group
   *
   * @param symbol - symbol to remove collateral from
   * @param amount - amount of collateral to remove
   * @param address - address to send remove collateral underlying transaction group from; defaults to client user address
   * @returns remove collateral underlying transaction group
   */
  async prepareRemoveCollateralUnderlyingTransactions(
    symbol: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const market = this.getMarket(symbol)
    return prepareRemoveCollateralUnderlyingTransactions(
      addr,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(addr),
      amount,
      market.getAsset().getUnderlyingAssetId(),
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds()
    )
  }

  /**
   * Returns a repay borrow transaction group
   *
   * @param symbol - symbol to repay
   * @param amount - amount of repay
   * @param address - address to send repay borrow transaction group from; defaults to client user address
   * @returns
   */
  async prepareRepayBorrowTransactions(
    symbol: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const market = this.getMarket(symbol)
    return prepareRepayBorrowTransactions(
      addr,
      await this.getDefaultParams(),
      await this.manager.getStorageAddress(addr),
      amount,
      this.manager.getManagerAppId(),
      market.getMarketAppId(),
      market.getMarketAddress(),
      this.getActiveMarketAppIds(),
      this.getActiveOracleAppIds(),
      symbol !== "ALGO" ? market.getAsset().getUnderlyingAssetId() : undefined
    )
  }

  /**
   * Returns a staking contract optin transaction group
   *
   * @param stakingContractName - name of staking contract to opt into
   * @param storageAddress - storage address to fund and rekey
   * @param address - address to create optin transaction group for; defaults to client user address
   * @returns staking contract opt in transaction group
   */
  async prepareStakingContractOptinTransactions(
    stakingContractName: string,
    storageAddress: string,
    address: string = null
  ): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const stakingContract = this.getStakingContract(stakingContractName)
    return prepareManagerAppOptinTransactions(
      stakingContract.getManagerAppId(),
      [stakingContract.getMarketAppId()],
      addr,
      storageAddress,
      await this.getDefaultParams()
    )
  }

  /**
   * Returns a staking contract stake transaction group
   *
   * @param stakingContractName - name of staking contract to stake on
   * @param amount - amount of stake
   * @param address - address to send stake transaction group from; defaults to client user address
   * @returns stake transacdtion group
   */
  async prepareStakeTransactions(
    stakingContractName: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const stakingContract = this.getStakingContract(stakingContractName)
    const assetId = stakingContract.getAsset().getUnderlyingAssetId()
    return prepareStakeTransactions(
      addr,
      await this.getDefaultParams(),
      await stakingContract.getStorageAddress(addr),
      amount,
      stakingContract.getManagerAppId(),
      stakingContract.getMarketAppId(),
      stakingContract.getMarketAddress(),
      stakingContract.getOracleAppId(),
      assetId > 1 ? assetId : undefined
    )
  }

  /**
   * Returns a staking contract unstake transactiong group
   *
   * @param stakingContractName - name of staking contract to unstake on
   * @param amount - amount of unstake
   * @param address - address to send unstake transaction group from; defaults to client user address
   * @returns unstake transaction group
   */
  async prepareUnstakeTransactions(
    stakingContractName: string,
    amount: number,
    address: string = null
  ): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const stakingContract = this.getStakingContract(stakingContractName)
    const assetId = stakingContract.getAsset().getUnderlyingAssetId()
    return prepareUnstakeTransactions(
      addr,
      await this.getDefaultParams(),
      await stakingContract.getStorageAddress(addr),
      amount,
      stakingContract.getManagerAppId(),
      stakingContract.getMarketAppId(),
      stakingContract.getOracleAppId(),
      assetId > 1 ? assetId : undefined
    )
  }

  /**
   * Returns a staking contract claim rewards transaction group
   *
   * @param stakingContractName - name of staking contract to unstake on
   * @param address - address to send claim rewards transaction group from; defaults to client user address
   * @returns unstake transaction group
   */
  async prepareClaimStakingRewardsTransactions(
    stakingContractName: string,
    address: string = null
  ): Promise<TransactionGroup> {
    let addr = address
    if (!addr) {
      addr = this.userAddress
    }
    const stakingContract = this.getStakingContract(stakingContractName)
    return prepareClaimStakingRewardsTransactions(
      addr,
      await this.getDefaultParams(),
      await stakingContract.getStorageAddress(addr),
      stakingContract.getManagerAppId(),
      stakingContract.getMarketAppId(),
      stakingContract.getOracleAppId(),
      stakingContract.getRewardsProgram().getRewardsAssetIds()
    )
  }

  /**
   * Submits and waits for a transaction group to finish if specified
   *
   * @param transactionGroup - signed transaction group
   * @param wait - boolean to tell whether you want to wait or not
   * @returns a dictionary with the txid of the group transaction
   */
  async submit(transactionGroup: Uint8Array, wait: boolean = false): Promise<{}> {
    let txid: string
    try {
      txid = await this.algod.sendRawTransaction(transactionGroup).do()
    } catch (e) {
      throw new Error(e)
    }
    if (wait) {
      return waitForConfirmation(this.algod, txid, 10)
    }
    return { txid: txid }
  }
}

/**
 * Creates a new generic testnet client
 *
 * @param algodClient - Algod client for interacting with the network
 * @param indexerClient - Indexer client for interacting with the network
 * @param userAddress - address of the user
 * @returns a new and fuilly constructed algofi testnet client
 */
export async function newAlgofiTestnetClient(
  algodClient: Algodv2 = null,
  indexerClient: Indexer = null,
  userAddress: string = null
): Promise<Client> {
  const historicalIndexerClient = new Indexer("", "https://indexer.testnet.algoexplorerapi.io/", "")
  let newAlgodClient: Algodv2
  let newIndexerClient: Indexer
  if (algodClient === null) {
    newAlgodClient = new Algodv2("", "https://api.testnet.algoexplorer.io", "")
  } else {
    newAlgodClient = algodClient;
  }
  if (indexerClient === null) {
    newIndexerClient = new Indexer("", "https://algoindexer.testnet.algoexplorerapi.io/", "")
  } else {
    newIndexerClient = indexerClient;
  }
  const client = await Client.init(newAlgodClient, newIndexerClient, historicalIndexerClient, userAddress, "testnet")
  return client
}

/**
 * Creates a new generic mainnet client
 *
 * @param algodClient - Algod client for interacting with the network
 * @param indexerClient - Indexer client for interacting with the network
 * @param userAddress - address of the user
 * @returns a new and fully constructed algofi mainnet client
 */
export async function newAlgofiMainnetClient(
  algodClient: Algodv2 = null,
  indexerClient: Indexer = null,
  userAddress: string = null
): Promise<Client> {
  const historicalIndexerClient = new Indexer("", "https://indexer.algoexplorerapi.io/", "")
  let newIndexerClient: Indexer
  if (algodClient === null) {
    algodClient = new Algodv2("", "https://algoexplorerapi.io", "")
  }
  if (indexerClient === null) {
    newIndexerClient = new Indexer("", "https://algoindexer.algoexplorerapi.io", "")
  } else {
    newIndexerClient = indexerClient;
  }
  const client = await Client.init(algodClient, newIndexerClient, historicalIndexerClient, userAddress, "mainnet")
  return client
}
