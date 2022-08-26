import { Algodv2 } from "algosdk"
import { getGlobalState } from "../utils"
import { assetDictionary } from "./config"

export class Asset {
  algod: Algodv2
  underlyingAssetId: number
  bankAssetId: number
  oracleAppId: number
  oraclePriceField: string
  oraclePriceScaleFactor: number
  underlyingAssetInfo: { [key: string]: any }
  bankAssetInfo: {}

  /**
   * This is the constructor for the Asset class.
   *
   * **Note, do not call this to create a new asset**. Instead call
   * the static method init as there are asynchronous set up steps in
   * creating an asset and a constructor can only return an instance of
   * the class and not a promise.
   *
   * #### Example
   * ```typescript
   * //Correct way to instantiate new asset
   * const newAsset = await Asset.init(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor)
   *
   * //Incorrect way to instantiate new asset
   * const newAsset = new Asset(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor)
   * ```
   *
   * @param algodClient - algod client
   * @param underlyingAssetId - id of underlying asset
   * @param bankAssetId - bank asset id
   * @param oracleAppId - oracle application id of underlying asset
   * @param oraclePriceField - oracle price field of underlying asset
   * @param oraclePriceScaleFactor - oracle price scale factor of underlying asset
   */
  constructor(
    algodClient: Algodv2,
    underlyingAssetId: number,
    bankAssetId: number,
    oracleAppId: number = null,
    oraclePriceField: string = null,
    oraclePriceScaleFactor: number = null
  ) {
    this.algod = algodClient
    this.underlyingAssetId = underlyingAssetId
    this.bankAssetId = bankAssetId

    if (oracleAppId !== null) {
      if (oraclePriceField === null) {
        throw Error("oracle price field must be specified")
      } else if (oraclePriceScaleFactor === null) {
        throw Error("oracle price scale factor must be specified")
      }
    }
    this.oracleAppId = oracleAppId
    this.oraclePriceField = oraclePriceField
    this.oraclePriceScaleFactor = oraclePriceScaleFactor
  }

  /**
   * This is the function that should be called when creating a new asset.
   * You pass everything you would to the constructor, but to this function
   * instead and this returns the new and created asset.
   *
   * #### Example
   * ```typescript
   * //Correct way to instantiate new asset
   * const newAsset = await Asset.init(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor)
   *
   * //Incorrect way to instantiate new asset
   * const newAsset = new Asset(algodClient, underlyingAssetId, bankAssetId, oracleAppId, oraclePriceField, oraclePriceScaleFactor)
   * ```
   *
   * @param algodClient - algod client
   * @param underlyingAssetId - id of underlying asset
   * @param bankAssetId - bank asset id
   * @param oracleAppId - oracle application id of underlying asset
   * @param oraclePriceField - oracle price field of underlying asset
   * @param oraclePriceScaleFactor - oracle price scale factor of underlying asset
   * @returns a finished instance of the asset class.
   */
  static async init(
    algodClient: Algodv2,
    underlyingAssetId: number,
    bankAssetId: number,
    oracleAppId: number = null,
    oraclePriceField: string = null,
    oraclePriceScaleFactor: number = null
  ): Promise<Asset> {
    const asset = new Asset(
      algodClient,
      underlyingAssetId,
      bankAssetId,
      oracleAppId,
      oraclePriceField,
      oraclePriceScaleFactor
    )
    for (const assetName of Object.keys(assetDictionary)) {
      if (assetDictionary[assetName].underlyingAssetId === underlyingAssetId) {
        asset.underlyingAssetInfo = assetDictionary[assetName]
      }
    }
    /*underlyingAssetId !== 1 ? (await asset.algod.getAssetByID(underlyingAssetId).do()).params : { decimals: 6 }
    asset.bankAssetInfo = (await asset.algod.getAssetByID(bankAssetId).do()).params */
    return asset
  }

  /**
   * Returns underlying asset id
   *
   * @returns underlying asset id
   */
  getUnderlyingAssetId(): number {
    return this.underlyingAssetId
  }

  /**
   * Returns underlying asset info
   *
   * @returns underlying asset info as a dictionary
   */
  getUnderlyingAssetInfo(): {} {
    return this.underlyingAssetInfo
  }

  /**
   * Returns bank asset id
   *
   * @returns bank asset id
   */
  getBankAssetId(): number {
    return this.bankAssetId
  }

  /**
   * Returns bank asset info
   *
   * @returns bank asset info as a dictionary
   */
  getBankAssetInfo(): {} {
    return this.bankAssetInfo
  }

  /**
   * Returns oracle app id
   *
   * @returns oracle app id
   */
  getOracleAppId(): number {
    return this.oracleAppId
  }

  /**
   * Returns oracle price field
   *
   * @returns oracle price field
   */
  getOraclePriceField(): string {
    return this.oraclePriceField
  }

  /**
   * Returns oracle price scale factor
   *
   * @returns oracle price scale factor
   */
  getOraclePriceScaleFactor(): number {
    return this.oraclePriceScaleFactor
  }

  /**
   * Returns the current raw oracle price
   *
   * @returns oracle price
   */
  async getRawPrice(): Promise<number> {
    if (this.oracleAppId === null) {
      throw Error("no oracle app id for asset")
    }
    const price = (await getGlobalState(this.algod, this.oracleAppId))[
      Buffer.from(this.oraclePriceField, "base64").toString()
    ]
    return price
  }

  /**
   * Returns decimals of asset
   *
   * @returns decimals
   */
  getUnderlyingDecimals(): number {
    return this.underlyingAssetInfo.decimals
  }

  /**
   * Returns the current oracle price
   *
   * @returns oracle price
   */
  async getPrice(): Promise<number> {
    if (this.oracleAppId == null) {
      throw Error("no oracle app id for asset")
    }
    const rawPrice = await this.getRawPrice()
    return (rawPrice * 10 ** this.getUnderlyingDecimals()) / (this.getOraclePriceScaleFactor() * 1e3)
  }

  /**
   * Returns the usd value of the underlying amount (base units)
   *
   * @param amount - integer amount of base underlying units
   * @returns usd value
   */
  async toUSD(amount: number): Promise<number> {
    const price = await this.getPrice()
    return (amount * price) / 10 ** this.getUnderlyingDecimals()
  }
}
