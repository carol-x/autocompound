export const contracts = {
  testnet: {
    SYMBOLS: [
      "ALGO",
      "USDC",
      "goBTC",
      "goETH",
      "STBL",
      "vALGO",
      "SEVN",
      "EGHT",
      "NINE",
      "TENN",
      "ELVN",
      "TWLV",
      "TRTN",
      "FRTN",
      "FVTN",
      "SXTN"
    ],
    SYMBOL_INFO: {
      ALGO: {
        marketCounter: 1,
        marketAppId: 51422140,
        bankAssetId: 51422936,
        underlyingAssetId: 1
      },
      USDC: {
        marketCounter: 2,
        marketAppId: 51422142,
        bankAssetId: 51422937,
        underlyingAssetId: 51435943
      },
      goBTC: {
        marketCounter: 3,
        marketAppId: 51422146,
        bankAssetId: 51422938,
        underlyingAssetId: 51436723
      },
      goETH: {
        marketCounter: 4,
        marketAppId: 51422149,
        bankAssetId: 51422939,
        underlyingAssetId: 51437163
      },
      STBL: {
        marketCounter: 5,
        marketAppId: 51422151,
        bankAssetId: 51422940,
        underlyingAssetId: 51437956
      },
      vALGO: {
        marketCounter: 6,
        marketAppId: 465814318,
        bankAssetId: 680408335,
        bankAssetDecimals: 6,
        underlyingAssetId: 1
      },
      SEVN: {
        marketCounter: 7,
        marketAppId: 51422155
      },
      EGHT: {
        marketCounter: 8,
        marketAppId: 51422158
      },
      NINE: {
        marketCounter: 9,
        marketAppId: 51422161
      },
      TENN: {
        marketCounter: 10,
        marketAppId: 51422164
      },
      ELVN: {
        marketCounter: 11,
        marketAppId: 51422170
      },
      TWLV: {
        marketCounter: 12,
        marketAppId: 51422172
      },
      TRTN: {
        marketCounter: 13,
        marketAppId: 51422175
      },
      FRTN: {
        marketCounter: 14,
        marketAppId: 51422177
      },
      FVTN: {
        marketCounter: 15,
        marketAppId: 51422179
      },
      SXTN: {
        marketCounter: 16,
        marketAppId: 51422186
      }
    },
    managerAppId: 51422788,
    supportedMarketCount: 6,
    maxAtomicOptInMarketCount: 13,
    maxMarketCount: 16,
    initRound: 18484796,
    STAKING_CONTRACTS: {
      STBL: {
        marketAppId: 53570045,
        managerAppId: 53570235,
        bankAssetId: 53593283,
        underlyingAssetId: 51437956
      }
    }
  },
  mainnet: {
    SYMBOLS: [
      "ALGO",
      "USDC",
      "goBTC",
      "goETH",
      "STBL",
      "vALGO",
      "SEVN",
      "EGHT",
      "NINE",
      "TENN",
      "ELVN",
      "TWLV",
      "TRTN",
      "FRTN",
      "FVTN",
      "SXTN"
    ],
    SYMBOL_INFO: {
      ALGO: {
        marketCounter: 1,
        marketAppId: 465814065,
        bankAssetId: 465818547,
        underlyingAssetId: 1
      },
      USDC: {
        marketCounter: 2,
        marketAppId: 465814103,
        bankAssetId: 465818553,
        underlyingAssetId: 31566704
      },
      goBTC: {
        marketCounter: 3,
        marketAppId: 465814149,
        bankAssetId: 465818554,
        underlyingAssetId: 386192725
      },
      goETH: {
        marketCounter: 4,
        marketAppId: 465814222,
        bankAssetId: 465818555,
        underlyingAssetId: 386195940
      },
      STBL: {
        marketCounter: 5,
        marketAppId: 465814278,
        bankAssetId: 465818563,
        underlyingAssetId: 465865291
      },
      vALGO: {
        marketCounter: 6,
        marketAppId: 465814318,
        bankAssetId: 680408335,
        underlyingAssetId: 1
      },
      SEVN: {
        marketCounter: 7,
        marketAppId: 465814371
      },
      EGHT: {
        marketCounter: 8,
        marketAppId: 465814435
      },
      NINE: {
        marketCounter: 9,
        marketAppId: 465814472
      },
      TENN: {
        marketCounter: 10,
        marketAppId: 465814527
      },
      ELVN: {
        marketCounter: 11,
        marketAppId: 465814582
      },
      TWLV: {
        marketCounter: 12,
        marketAppId: 465814620
      },
      TRTN: {
        marketCounter: 13,
        marketAppId: 465814664
      },
      FRTN: {
        marketCounter: 14,
        marketAppId: 465814701
      },
      FVTN: {
        marketCounter: 15,
        marketAppId: 465814744
      },
      SXTN: {
        marketCounter: 16,
        marketAppId: 465814807
      }
    },
    supportedMarketCount: 6,
    maxMarketCount: 16,
    maxAtomicOptInMarketCount: 13,
    managerAppId: 465818260,
    initRound: 18011265,
    STAKING_CONTRACTS: {
      STBL: {
        marketAppId: 482608867,
        managerAppId: 482625868,
        bankAssetId: 482653551,
        underlyingAssetId: 465865291
      },
      "STBL-USDC-LP-V2": {
        marketAppId: 553866305,
        managerAppId: 553869413,
        bankAssetId: 553898734,
        underlyingAssetId: 552737686
      }
    }
  }
}
