import {
  Transaction,
  generateAccount,
  secretKeyToMnemonic,
  encodeUint64,
  SuggestedParams,
  makePaymentTxnWithSuggestedParams,
  Algodv2,
  assignGroupID
} from "algosdk"
import { contracts } from "./v1/contracts"
export enum Transactions {
  MINT = 1,
  MINT_TO_COLLATERAL = 2,
  ADD_COLLATERAL = 3,
  REMOVE_COLLATERAL = 4,
  BURN = 5,
  REMOVE_COLLATERAL_UNDERLYING = 6,
  BORROW = 7,
  REPAY_BORROW = 8,
  LIQUIDATE = 9,
  CLAIM_REWARDS = 10
}

/**
 * Wait for the specified transaction to complete
 *
 * @param algodClient - algod client
 * @param txId - transaction id of transaction we are waiting for
 */
export async function waitForConfirmation(algodClient: Algodv2, txId: string): Promise<void> {
  const response = await algodClient.status().do()
  let lastround = response["last-round"]
  while (true) {
    const pendingInfo = await algodClient.pendingTransactionInformation(txId).do()
    if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
      console.log(`Transaction ${txId} confirmed in round ${pendingInfo["confirmed-round"]}`)
      break
    }
    lastround += 1
    await algodClient.statusAfterBlock(lastround).do()
  }
}

export class TransactionGroup {
  transactions: Transaction[]
  signedTransactions: Uint8Array[]

  /**
   * This is the constructor for the TransactionGroup class.
   * You pass in a list of transactions and get back a TransactionGroup object
   *
   * @param transactions - list of transactions
   */
  constructor(transactions: Transaction[]) {
    this.transactions = assignGroupID(transactions)
    const signedTransactions = []
    for (const _ of this.transactions) {
      signedTransactions.push(null)
    }
    this.signedTransactions = signedTransactions
  }

  /**
   * Signs the transactions with specified private key and saves to class state
   *
   * @param address - account address of the user
   * @param privateKey - private key of user
   */
  signWithPrivateKey(address: string, privateKey: Uint8Array): void {
    for (const [i, txn] of Object.entries(this.transactions)) {
      this.signedTransactions[i] = txn.signTxn(privateKey)
    }
  }

  /**
   * Signs the transactions with specified private keys and saves to class state
   *
   * @param privateKeys - private keys
   */
  signWithPrivateKeys(privateKeys: Uint8Array[]): void {
    if (privateKeys.length !== this.transactions.length) {
      throw new Error("Different number of private keys and transactions")
    }
    for (const [i, txn] of Object.entries(this.transactions)) {
      this.signedTransactions[i] = txn.signTxn(privateKeys[i])
    }
  }

  /**
   * Submits the signed transactions to the network using the algod client
   *
   * @param algod - algod client
   * @param wait - wait for txn to complete; defaults to false
   * @returns
   */
  async submit(algod: Algodv2, wait: boolean = false): Promise<{ [key: string]: number }> {
    let txid: any
    try {
      txid = await algod.sendRawTransaction(this.signedTransactions).do()
    } catch (e) {
      throw new Error(e)
    }
    if (wait) {
      await waitForConfirmation(algod, txid.txId)
    }
    return {
      txid: txid.txId
    }
  }
}

/**
 * Return a random integer between 0 and max
 *
 * @param max - max integer that we want to return
 * @returns random integer between 0 and max
 */
export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

/**
 * Return the value for the associated key in the object passed in , or defaultValue if not found
 *
 * @param object - object to parse
 * @param key - key to find value for
 * @param defaultValue - default value to default to when we can't find key
 * @returns the value for the associated key in the object passed in , or defaultValue if not found
 */
export function get(object: {}, key: any, defaultValue: any): any {
  const result = object[key]
  return typeof result !== "undefined" ? result : defaultValue
}

/**
 * Return a byte representation of the passed in number
 *
 * @param num - number to convert to bytes
 * @returns a byte representation of the passed in number
 */
export function intToBytes(num: number): Uint8Array {
  return encodeUint64(num)
}

/**
 * Return a formatted version of state after taking care of decoding and unecessary key values
 *
 * @param state - state we are trying to format
 * @returns a formatted version of state after taking care of decoding and unecessary key values
 */
export function formatState(state: { [key: string]: any }[]): { [key: string]: any } {
  const formatted = {}
  for (const item of state) {
    const { key } = item
    const { value } = item
    let formattedKey: string
    let formattedValue: string
    try {
      formattedKey = Buffer.from(key, "base64").toString()
    } catch (e) {
      formattedKey = Buffer.from(key).toString()
    }
    if (value.type === 1) {
      if (value.bytes !== "") {
        formattedValue = value.bytes
      } else {
        formattedValue = Buffer.from(value.bytes, "base64").toString()
      }
      formatted[formattedKey] = formattedValue
    } else {
      formatted[formattedKey] = value.uint
    }
  }
  return formatted
}

/**
 * Returns dict of local state for address for application with id appId
 *
 * @param client - algod clietn
 * @param address - address of account for which to get state
 * @param appId - is of the application
 * @returns dict of local state of address for application with id appId
 */
export async function readLocalState(client: Algodv2, address: string, appId: number): Promise<{ [key: string]: any }> {
  const results = await client.accountInformation(address).do()
  for (const localState of results["apps-local-state"]) {
    if (localState.id === appId) {
      if (!Object.keys(localState).includes("key-value")) {
        return {}
      }
      return formatState(localState["key-value"])
    }
  }
  return {}
}

/**
 * Returns dict of global state for application with id appId. Address must be that of the creator.
 *
 * @param client - algod client
 * @param address - creator address
 * @param appId - id of the application
 * @returns dict of global state for application with id appId
 */
export async function readGlobalState(client: Algodv2, address: string, appId: number): Promise<{}> {
  const results = await client.accountInformation(address).do()
  const appsCreated = results["created-apps"]
  for (const app of appsCreated) {
    if (app.id === appId) {
      return formatState(app.params["global-state"])
    }
  }
  return {}
}

/**
 * Returns dict of global state for application with the given appId
 *
 * @param algodClient - algod client
 * @param appId - id of the application
 * @returns dict of global state for application with id appId
 */
export async function getGlobalState(algodClient: Algodv2, appId: number): Promise<{}> {
  const application = await algodClient.getApplicationByID(appId).do()
  const stateDict = formatState(application.params["global-state"])
  return stateDict
}

/**
 * Returns list of supported staking contracts for the specified chain. Pulled from hardcoded values in contracts.ts.
 *
 * @param chain - network to query data for
 * @returns list of supported staking contracts
 */
export function getStakingContracts(chain: string): {} {
  return contracts[chain].STAKING_CONTRACTS
}

/**
 * Returns list of supported symbols for the specified chain. Pulled from hardcoded values in contracts.ts.
 *
 * @param chain - network to query data for
 * @param max - max assets
 * @param maxAtomicOptIn - list of supported symbols for algofi's protocol on chain
 * @returns
 */
export function getOrderedSymbols(chain: string, max: boolean = false, maxAtomicOptIn: boolean = false): string[] {
  let supportedMarketCount: number
  if (max) {
    supportedMarketCount = contracts[chain].maxMarketCount
  } else if (maxAtomicOptIn) {
    supportedMarketCount = contracts[chain].maxAtomicOptInMarketCount
  } else {
    supportedMarketCount = contracts[chain].supportedMarketCount
  }
  return contracts[chain].SYMBOLS.slice(0, supportedMarketCount)
}

/**
 * Returns app id of manager for the specified chain. Pulled from hardcoded values in contracts.ts.
 *
 * @param chain - network to query data for
 * @returns manager app id
 */
export function getManagerAppId(chain: string): number {
  return contracts[chain].managerAppId
}

/**
 * Returns market app id of symbol for the specified chain. Pulled from hardcoded values in contracts.ts.
 *
 * @param chain - network to query data for
 * @param symbol - symbol to get market data for
 * @returns market app id
 */
export function getMarketAppId(chain: string, symbol: string): number {
  return contracts[chain].SYMBOL_INFO[symbol].marketAppId
}

/**
 * Returns init round of algofi protocol for a specified chain. Pulled from hardcoded values in contracts.ts.
 *
 * @param chain - network to query data for
 * @returns init round of algofi protocol on specified chain
 */
export function getInitRound(chain: string): number {
  return contracts[chain].initRound
}

/**
 * Returns a transaction group object representing a payment group transaction
 * for a given sender, receiver, amount and ability to rekey.
 *
 * @param sender - account address for sender
 * @param suggestedParams - suggested transaction params
 * @param receiver - account address for the receiver
 * @param amount - amount of algos to send
 * @returns
 */
export function preparePaymentTransaction(
  sender: string,
  suggestedParams: SuggestedParams,
  receiver: string,
  amount: number
): TransactionGroup {
  const txn = makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, undefined, suggestedParams)
  const txnGroup = new TransactionGroup([txn])
  return txnGroup
}

/**
 * Returns a three element list with a new key, address and passphrase.
 *
 * @returns a three element list with a new key, address and passphrase.
 */
export function getNewAccount(): any[] {
  const newAccount = generateAccount()
  const key = newAccount.sk
  const address = newAccount.addr
  const passphrase = secretKeyToMnemonic(key)
  return [key, address, passphrase]
}

/**
 * Returns value from the encoded global state dict of an application
 *
 * @param globalState - global state of an application
 * @param searchKey - utf8 key of a value to search for
 * @returns value for the given key
 */
export function searchGlobalState(globalState: { [key: string]: any }[], searchKey: any): any {
  for (const field of globalState) {
    let { value } = field
    const { key } = field
    if (searchKey === Buffer.from(key, "base64").toString()) {
      if (value.type == 2) {
        value = value.uint
      } else {
        value = value.bytes
      }

      return value
    }
  }
  throw new Error("Key not found")
}
