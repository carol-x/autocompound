const algosdk = require("algosdk")
/***const { v1 } = require("@algofi/v0")
const assert = require("assert")

// load chainvault node
const algodToken = "79049afe7258afac1b8b4ea1f3ad71783e08bbe84d92817b9dd5904344ab6747"
const algodServer = "https://node.chainvault.io/main"
const algodClient = new algosdk.Algodv2(algodToken, algodServer, "")
describe("asset check one", async function() {
  // check for ALGO market
  const CHECK_ONE_ASSETID = 1
  const CHECK_ONE_ASSET_BANKID = 465818547
  const CHECK_ONE_ASSET_ORACLEID = 531724540
  const CHECK_ONE_ASSET_ORACLE_FIELD = "latest_twap_price"
  const CHECK_ONE_ASSET_ORACLE_SCALE = 1e9

  const fetchAsset = async () => {
    return await new v1.Asset(
      algodClient,
      CHECK_ONE_ASSETID,
      CHECK_ONE_ASSET_BANKID,
      CHECK_ONE_ASSET_ORACLEID,
      CHECK_ONE_ASSET_ORACLE_FIELD,
      CHECK_ONE_ASSET_ORACLE_SCALE
    )
  }

  describe("#constructor()", async function() {
    it("asset constructor check", async function() {
      const asset = await fetchAsset()
    })
  })
  describe("#getUnderlyingAssetId()", function() {
    it("asset underlying id check", async function() {
      const asset = await fetchAsset()
      const assetUnderlyingId = asset.getUnderlyingAssetId()
      assert.equal(assetUnderlyingId, CHECK_ONE_ASSETID)
    })
  })
  describe("#getUnderlyingAssetInfo()", function() {
    it("asset underlying info check", async function() {
      const asset = await fetchAsset()
      const assetUnderlyingInfo = asset.getUnderlyingAssetInfo()
      assert.equal(assetUnderlyingInfo["decimals"], 6)
    })
  })

  describe("#getBankAssetId()", function() {
    it("asset bank asset ID check", async function() {
      const asset = await fetchAsset()
      const bankAssetId = asset.getBankAssetId()
      assert.equal(bankAssetId, CHECK_ONE_ASSET_BANKID)
    })
  })
  describe("#getBankAssetInfo()", function() {
    it("asset bank asset info check", async function() {
      const asset = await fetchAsset()
      const bankAssetInfo = asset.getBankAssetInfo()
      assert.equal(bankAssetInfo["decimals"], 6)
    })
  })
  describe("#getOracleAppId()", function() {
    it("asset oracle app id check", async function() {
      const asset = await fetchAsset()
      const oracleAppId = asset.getOracleAppId()
      assert.equal(oracleAppId, CHECK_ONE_ASSET_ORACLEID)
    })
  })
  describe("#getOraclePriceField()", function() {
    it("asset oracle price field check", async function() {
      const asset = await fetchAsset()
      const oraclePriceField = asset.getOraclePriceField()
      assert.equal(oraclePriceField, CHECK_ONE_ASSET_ORACLE_FIELD)
    })
  })
  describe("#getOraclePriceScaleFactor()", function() {
    it("asset oracle price scale factor check", async function() {
      const asset = await fetchAsset()
      const oraclePriceScaleFactor = asset.getOraclePriceScaleFactor()
      assert.equal(oraclePriceScaleFactor, CHECK_ONE_ASSET_ORACLE_SCALE)
    })
  })
  describe("#getRawPrice()", function() {
    it("asset raw price check", async function() {
      const asset = await fetchAsset()
      const rawPrice = await asset.getRawPrice()
      // check the rawPrice lies between 0.1 and 10 * 1e6
      assert.equal(rawPrice >= 0.1 * 1e6, 1)
      assert.equal(rawPrice <= 10 * 1e6, 1)
    })
  })
  describe("#getUnderlyingDecimals()", function() {
    it("asset underlying decimals check", async function() {
      const asset = await fetchAsset()
      const underlyingDecimals = asset.getUnderlyingDecimals()
      assert.equal(underlyingDecimals, 6)
    })
  })
  describe("#getPrice()", function() {
    it("asset price check", async function() {
      const asset = await fetchAsset()
      const price = await asset.getPrice()
      // check the price lies between 0.1 and 10
      assert.equal(price >= 0.1, 1)
      assert.equal(price <= 10, 1)
    })
  })
})

describe("asset check two", async function() {
  // check for ALGO market
  const CHECK_TWO_ASSETID = 386192725
  const CHECK_TWO_ASSET_BANKID = 465818554
  const CHECK_TWO_ASSET_ORACLEID = 531725044
  const CHECK_TWO_ASSET_ORACLE_FIELD = "latest_twap_price"
  const CHECK_TWO_ASSET_ORACLE_SCALE = 1e11

  const fetchAsset = async () => {
    return await new v1.Asset(
      algodClient,
      CHECK_TWO_ASSETID,
      CHECK_TWO_ASSET_BANKID,
      CHECK_TWO_ASSET_ORACLEID,
      CHECK_TWO_ASSET_ORACLE_FIELD,
      CHECK_TWO_ASSET_ORACLE_SCALE
    )
  }

  describe("#constructor()", async function() {
    it("asset constructor check", async function() {
      const asset = await fetchAsset()
    })
  })
  describe("#getUnderlyingAssetId()", function() {
    it("asset underlying id check", async function() {
      const asset = await fetchAsset()
      const assetUnderlyingId = asset.getUnderlyingAssetId()
      assert.equal(assetUnderlyingId, CHECK_TWO_ASSETID)
    })
  })
  describe("#getUnderlyingAssetInfo()", function() {
    it("asset underlying info check", async function() {
      const asset = await fetchAsset()
      const assetUnderlyingInfo = asset.getUnderlyingAssetInfo()
      assert.equal(assetUnderlyingInfo["decimals"], 8)
    })
  })

  describe("#getBankAssetId()", function() {
    it("asset bank asset ID check", async function() {
      const asset = await fetchAsset()
      const bankAssetId = asset.getBankAssetId()
      assert.equal(bankAssetId, CHECK_TWO_ASSET_BANKID)
    })
  })
  describe("#getBankAssetInfo()", function() {
    it("asset bank asset info check", async function() {
      const asset = await fetchAsset()
      const bankAssetInfo = asset.getBankAssetInfo()
      assert.equal(bankAssetInfo["decimals"], 8)
    })
  })
  describe("#getOracleAppId()", function() {
    it("asset oracle app id check", async function() {
      const asset = await fetchAsset()
      const oracleAppId = asset.getOracleAppId()
      assert.equal(oracleAppId, CHECK_TWO_ASSET_ORACLEID)
    })
  })
  describe("#getOraclePriceField()", function() {
    it("asset oracle price field check", async function() {
      const asset = await fetchAsset()
      const oraclePriceField = asset.getOraclePriceField()
      assert.equal(oraclePriceField, CHECK_TWO_ASSET_ORACLE_FIELD)
    })
  })
  describe("#getOraclePriceScaleFactor()", function() {
    it("asset oracle price scale factor check", async function() {
      const asset = await fetchAsset()
      const oraclePriceScaleFactor = asset.getOraclePriceScaleFactor()
      assert.equal(oraclePriceScaleFactor, CHECK_TWO_ASSET_ORACLE_SCALE)
    })
  })
  describe("#getRawPrice()", function() {
    it("asset raw price check", async function() {
      const asset = await fetchAsset()
      const rawPrice = await asset.getRawPrice()
      // check the rawPrice lies between 0.1 and 10 * 1e6
      assert.equal(rawPrice >= 10000 * 1e6, 1)
      assert.equal(rawPrice <= 100000 * 1e6, 1)
    })
  })
  describe("#getUnderlyingDecimals()", function() {
    it("asset underlying decimals check", async function() {
      const asset = await fetchAsset()
      const underlyingDecimals = asset.getUnderlyingDecimals()
      assert.equal(underlyingDecimals, 8)
    })
  })
  describe("#getPrice()", function() {
    it("asset price check", async function() {
      const asset = await fetchAsset()
      const price = await asset.getPrice()
      // check the price lies between 0.1 and 10
      assert.equal(price >= 10000, 1)
      assert.equal(price <= 100000, 1)
    })
  })
})

describe("market check one", async function() {
  // check for ALGO market
  const CHECK_ONE_MARKET_ID = 465814065
  const CHECK_ONE_MARKET_ADDRESS = "TY5N6G67JWHSMWFFFZ252FXWKLRO5UZLBEJ4LGV7TPR5PVSKPLDWH3YRXU"
  const CHECK_ONE_MARKET_COUNTER = 1
  const CHECK_ONE_MARKET_ASSET_ID = 1
  const fetchMarket = async () => {
    return await new v1.Market(algodClient, CHECK_ONE_MARKET_ID)
  }

  describe("#constructor()", async function() {
    it("market constructor check", async function() {
      const market = await fetchMarket()
    })
  })
  describe("#marketAddress()", async function() {
    it("market address check", async function() {
      const market = await fetchMarket()
      assert.equal(market.getMarketAddress(), CHECK_ONE_MARKET_ADDRESS)
    })
  })
  describe("#getMarketCounter()", async function() {
    it("market address check", async function() {
      const market = await fetchMarket()
      assert.equal(market.getMarketCounter(), CHECK_ONE_MARKET_COUNTER)
    })
  })
  describe("#getAsset().getUnderlyingAssetId()", async function() {
    it("market asset id check", async function() {
      const market = await fetchMarket()
      assert.equal((await market.getAsset()).getUnderlyingAssetId(), CHECK_ONE_MARKET_ASSET_ID)
    })
  })
  describe("#getActiveCollateral()", async function() {
    it("market collateral check", async function() {
      const market = await fetchMarket()
      const activeCollateral = market.getActiveCollateral()
      // check collateral between 1M and 100B
      assert.equal(activeCollateral / 1e12 >= 1, 1)
      assert.equal(activeCollateral / 1e12 <= 100000, 1)
    })
  })
  describe("#getBankCirculation()", async function() {
    it("market bank circulatoin check", async function() {
      const market = await fetchMarket()
      const bankCirculation = market.getBankCirculation()
      // check bank assets between 1M and 100B
      assert.equal(bankCirculation / 1e12 >= 1, 1)
      assert.equal(bankCirculation / 1e12 <= 100000, 1)
    })
  })

  describe("#getBankToUnderlyingExchange()", async function() {
    it("market bank to underlying check", async function() {
      const market = await fetchMarket()
      const bankToUnderlying = market.getBankToUnderlyingExchange()
      // check exchange rate is between 1 and 2
      assert.equal(bankToUnderlying / 1e9 >= 1, 1)
      assert.equal(bankToUnderlying / 1e9 <= 2, 1)
    })
  })
  describe("#getUnderlyingBorrowed()", async function() {
    it("market underlying borrowed check", async function() {
      const market = await fetchMarket()
      const underlyingBorrowed = await market.getUnderlyingBorrowed()
      // check borrowed assets between .1M and 100B
      assert.equal(bankCirculation / 1e12 >= 0.1, 1)
      assert.equal(bankCirculation / 1e12 <= 100000, 1)
    })
  })
})***/