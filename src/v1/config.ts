export const orderedAssets = ["ALGO", "USDC", "goBTC", "goETH", "STBL", "vALGO"]
export const extraAssets = ["BANK"]
export const orderedAssetsAndPlaceholders = [
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
  "SXTN",
  "STBL-ALGO-LP",
  "STBL-USDC-LP",
  "STBL-USDC-LP-V2",
  "STBL-YLDY-LP"
]

export const protocolManagerAppId = 465818260
export const managerAddress = "2SGUKZCOBEVGN3HPKSXPS6DTCXZ7LSP6G3BQF6KVUIUREBBY2QTGSON7WQ"
export const assetDictionary = {
  ALGO: {
    decimals: 6,
    marketCounter: 1,
    marketAppId: 465814065,
    marketAddress: "TY5N6G67JWHSMWFFFZ252FXWKLRO5UZLBEJ4LGV7TPR5PVSKPLDWH3YRXU",
    managerAppId: 465818260,
    bankAssetId: 465818547,
    bankAssetDecimals: 6,
    underlyingAssetId: 1,
    oracleAppId: 531724540,
    oracleFieldName: "latest_twap_price"
  },
  USDC: {
    decimals: 6,
    marketCounter: 2,
    marketAppId: 465814103,
    marketAddress: "ABQHZLNGGPWWZVA5SOQO3HBEECVJSE3OHYLKACOTC7TC4BS52ZHREPF7QY",
    managerAppId: 465818260,
    bankAssetId: 465818553,
    bankAssetDecimals: 6,
    underlyingAssetId: 31566704,
    oracleAppId: 451327550,
    oracleFieldName: "price"
  },
  goBTC: {
    decimals: 8,
    marketCounter: 3,
    marketAppId: 465814149,
    marketAddress: "W5UCMHDSTGKWBOV6YVLDVPJGPE4L4ISTU6TGXC7WRF63Y7GOVFOBUNJB5Q",
    managerAppId: 465818260,
    bankAssetId: 465818554,
    bankAssetDecimals: 8,
    underlyingAssetId: 386192725,
    oracleAppId: 531725044,
    oracleFieldName: "latest_twap_price"
  },
  goETH: {
    decimals: 8,
    marketCounter: 4,
    marketAppId: 465814222,
    marketAddress: "KATD43XBJJIDXB3U5UCPIFUDU3CZ3YQNVWA5PDDMZVGKSR4E3QWPJX67CY",
    managerAppId: 465818260,
    bankAssetId: 465818555,
    bankAssetDecimals: 8,
    underlyingAssetId: 386195940,
    oracleAppId: 531725449,
    oracleFieldName: "latest_twap_price"
  },
  STBL: {
    decimals: 6,
    marketCounter: 5,
    marketAppId: 465814278,
    marketAddress: "OPY7XNB5LVMECF3PHJGQV2U33LZPM5FBUXA3JJPHANAG5B7GEYUPZJVYRE",
    managerAppId: 465818260,
    bankAssetId: 465818563,
    bankAssetDecimals: 6,
    underlyingAssetId: 465865291,
    oracleAppId: 451327550,
    oracleFieldName: "price"
  },
  vALGO: {
    decimals: 6,
    marketCounter: 6,
    marketAppId: 465814318,
    marketAddress: "DAUL5I34T4C4U5OMXS7YBPJIERQ2NH3O7XPZCIJEGKP4NO3LK4UWDCHAG4",
    managerAppId: 465818260,
    bankAssetId: 680408335,
    bankAssetDecimals: 6,
    underlyingAssetId: 1,
    oracleAppId: 531724540,
    oracleFieldName: "latest_twap_price"
  },
  "STBL-STAKE": {
    decimals: 6,
    marketCounter: 5,
    marketAppId: 482608867,
    managerAppId: 482625868,
    marketAddress: "DYLJJES76YQCOUK6D4RALIPJ76U5QT7L6A2KP6QTOH63OBLFKLTER2J6IA",
    bankAssetId: 465818563,
    bankAssetDecimals: 6,
    underlyingAssetId: 465865291,
    oracleAppId: 451327550,
    oracleFieldName: "price"
  },
  "STBL-ALGO-LP": {
    decimals: 6,
    managerAppId: 514458901,
    managerAddress: "JZYVXQLRZ2TEI6XMIQN5KEHEVA5EA3LQVZUS24SGKLVIBQZTRSP3PTCRJQ",
    marketAppId: 514439598,
    marketAddress: "UMTL7D6YMN463FSG3JN572CFD6VTKRKNSK5KSQYIUK67N7CR3XLDFM42Y4",
    underlyingAssetId: 468634109,
    bankAssetId: 514473977,
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  "STBL-USDC-LP": {
    decimals: 6,
    marketAppId: 485244022,
    managerAppId: 485247444,
    managerAddress: "IG3KDYTH7IB46DC5K4ME4Z3R46VJEFXFPHRHVV3KKBTULW5ODHPJL7ZFU4",
    marketAddress: "Z3GWRL5HGCJQYIXP4MINCRWCKWDHZ5VSYJHDLIDLEIOARIZWJX6GLAWWEI",
    creatorAddress: "TFONT6HASLUUWDRE3MEEC4GS5PIMLEKNCE7Z2JMGNBFIHVZZ2QEJ7MODZE",
    oracleAppId: 451327550,
    bankAssetId: 485254141,
    bankAssetDecimals: 6,
    underlyingAssetId: 467020179,
    oracleFieldName: "price"
  },
  "STBL-USDC-LP-V2": {
    decimals: 6,
    managerAppId: 514599129,
    managerAddress: "SFSV2PM3724DUZGIQVLZ5XOUKSQBDALYI7UZ23YLGYFDLM3WH2AMWHBNTE",
    marketAppId: 514596716,
    marketAddress: "RLXSNIDRFIDMKJILBMDKHACY7YFEV2N65T6D3YGKKM2LAKHNK4XCOEVYIQ",
    underlyingAssetId: 467020179,
    bankAssetId: 514619644,
    creatorAddress: "TFONT6HASLUUWDRE3MEEC4GS5PIMLEKNCE7Z2JMGNBFIHVZZ2QEJ7MODZE",
    oracleAppId: 451327550,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },

  "STBL-YLDY-LP": {
    decimals: 6,
    managerAppId: 514601080,
    managerAddress: "S53YDCHH3JGJKZWLNLUFDAQKSUZCAWOVNYHWAGMVCOFK2NNROS7NCLDK64",
    marketAppId: 514599409,
    marketAddress: "3VNLTSYGAMVBRSCSAF7PP7KSBAV5AQQIUM2TJXIDVOXX573AW7LMH6RARY",
    underlyingAssetId: 468695586,
    bankAssetId: 514624374,
    bankAssetDecimals: 6,
    oracleFieldName: "price"
  },
  BANK: {
    decimals: 6,
    underlyingAssetId: 51642940
  },
  SIIX: {
    marketCounter: 6,
    marketAppId: 465814318,
    marketAddress: "DAUL5I34T4C4U5OMXS7YBPJIERQ2NH3O7XPZCIJEGKP4NO3LK4UWDCHAG4"
  },
  SEVN: {
    marketCounter: 7,
    marketAppId: 465814371,
    marketAddress: "K75YX4ZN3J43R2JTRWB6M3KXNPWAJJVPFSMIRAGQO77TKXKHKBFKSRZGGA"
  },
  EGHT: {
    marketCounter: 8,
    marketAppId: 465814435,
    marketAddress: "P6B5MK2FMN24IVRYMQMEPZHJPCNN6OUKFI5OSTOUREC47HPQNUXAUKF4TY"
  },
  NINE: {
    marketCounter: 9,
    marketAppId: 465814472,
    marketAddress: "PWVB7SHASD5XJNQFZHC5UAR5UYY33TW62YA6JVOW6PMYNZ7KMARPXKMFRU"
  },
  TENN: {
    marketCounter: 10,
    marketAppId: 465814527,
    marketAddress: "K7TNWBPCKLJKX3KHUZ5VA7YKGWNPHM4E6HQ5HGD7VFVYZ3232RJFGATMTM"
  },
  ELVN: {
    marketCounter: 11,
    marketAppId: 465814582,
    marketAddress: "LEHVWIH62DHSXLXFBPAXHYZZYGO7ONJ4HJHQLX4LJSIXSM66FPN5BXRCPU"
  },
  TWLV: {
    marketCounter: 12,
    marketAppId: 465814620,
    marketAddress: "S6LBCGD4UFECPY3P67QFURVDXCBPWZXG56VJ43UVBK7ODIODF6UOX6BX4A"
  },
  TRTN: {
    marketCounter: 13,
    marketAppId: 465814664,
    marketAddress: "HHHROS6MPEFEXJ7JQOKASR67EEPRM3NRGWLREW54XBUHF6AQ3HYGQQIGCY"
  },
  FRTN: {
    marketCounter: 14,
    marketAppId: 465814701,
    marketAddress: "XFWV3BF47DBLJ2GY2WUUIIA3W4VTOFOALKKEJJNCWFG6DLHWZ6SFUQXPJA"
  },
  FVTN: {
    marketCounter: 15,
    marketAppId: 465814744,
    marketAddress: "BTC4OBXRM53F3WT3YXK5LEP2JYB6OIDGQHM4EOHYPOYORKR4QHY7CMD35M"
  },
  SXTN: {
    marketCounter: 16,
    marketAppId: 465814807,
    marketAddress: "F253XGHUENH36WTAVWR2DE6VPAF2FV7L7H3QESM5Q7QXQTEX5T2C2HT3NU"
  }
}
export const foreignAppIds = [465814065, 465814103, 465814149, 465814222, 465814278]

export const SECONDS_PER_YEAR = 60 * 60 * 24 * 365
export const SCALE_FACTOR = 1e9
export const REWARDS_SCALE_FACTOR = 1e14
export const PARAMETER_SCALE_FACTOR = 1e3

let orderedOracleAppIds = []
let orderedMarketAppIds = []
let orderedMarketData = []
let orderedSupportedMarketAppIds = []
let marketCounterToAssetName = {}
let assetIdToAssetName = {}
for (const assetName of orderedAssets) {
  orderedOracleAppIds.push(assetDictionary[assetName]["oracleAppId"])
  orderedSupportedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
  marketCounterToAssetName[assetDictionary[assetName]["marketCounter"]] = assetName
  assetIdToAssetName[assetDictionary[assetName]["underlyingAssetId"]] = assetName
  assetIdToAssetName[assetDictionary[assetName]["bankAssetId"]] = "b" + assetName
}
for (const assetName of extraAssets) {
  assetIdToAssetName[assetDictionary[assetName]["underlyingAssetId"]] = assetName
}

for (const assetName of orderedAssetsAndPlaceholders) {
  orderedMarketAppIds.push(assetDictionary[assetName]["marketAppId"])
}
export {
  orderedOracleAppIds,
  orderedMarketAppIds,
  orderedSupportedMarketAppIds,
  marketCounterToAssetName,
  assetIdToAssetName
}
