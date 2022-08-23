# algofi-lend-js-sdk

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Algofiorg/algofi-lend-js-sdk/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Algofiorg/algofi-lend-js-sdk/tree/master)

Official JavaScript SDK for the Algofi Lending V1 Protocol

## Documentation
https://algofiorg.github.io/algofi-lend-js-sdk/

## Design Goal
This SDK is useful for developers who want to programatically interact with the Algofi lending protocol.

## Status
This SDK is currently under active early development and should not be considered stable.

## Installation

### [Node.js](https://nodejs.org/en/download/)

```
git clone git@github.com:Algofiorg/algofi-lend-js-sdk.git && cd algofi-lend-js-sdk
npm install
cd test && npm install && cd ..
```

## Generate Documentation

To generate docs, cd into the root folder and run

```
npx typedoc algofi/index.ts
```

## Examples

### Add liquidity (mint)
[mint.ts](https://github.com/Algofiorg/algofi-lend-js-sdk/blob/master/src/examples/mint.ts)

This example shows how to add liquidity to the platform

### Burn asset (burn)
[burn.ts](https://github.com/Algofiorg/algofi-lend-js-sdk/blob/master/src/examples/burn.ts)

This example shows how to burn bank assets to redeem for underlying liquidity

### Add collateral (addCollateral)
[addCollateral.ts](https://github.com/Algofiorg/algofi-lend-js-sdk/blob/master/src/examples/addCollateral.ts)

This example shows how to add minted bank assets to collateral

### Add liquidity to collateral (mintToCollateral)
[mintToCollateral.ts](https://github.com/Algofiorg/algofi-lend-js-sdk/blob/master/src/examples/mintToCollateral.ts)

This example shows how to add liquidity to the platform collateral

### Remove collateral (removeCollateral)
[removeCollateral.ts](https://github.com/Algofiorg/algofi-lend-js-sdk/blob/master/src/examples/removeCollateral.ts)

This example shows how to remove bank asset collateral from platform

### Remove collateral to underlying (removeCollateralUnderlying)
Example coming!

This example shows how to remove bank asset collateral from platform to underlying asset

### Borrow (borrow)
[borrow.ts](https://github.com/Algofiorg/algofi-lend-js-sdk/blob/master/src/examples/borrow.ts)

This example shows how to borrow an underlying asset against provided collateral

### Repay Borrow (repayBorrow)
[repayBorrow.ts](https://github.com/Algofiorg/algofi-lend-js-sdk/blob/master/src/examples/repayBorrow.ts)

This example shows how to repay borrowed assets

### Staking (stake & unstake)
Example coming!

This example shows how to stake and unstake in a staking contract

# License

algofi-lend-js-sdk is licensed under a MIT license except for the exceptions listed below. See the LICENSE file for details.
