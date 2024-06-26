---
sidebar_position: 5
---

# Cross-Chain Interoperability

UTXO Stack enables seamless cross-chain interoperability by leveraging the RGB++ protocol[^1]'s isomorphic binding technology `assets leap`. This innovative approach eliminates the need for traditional cross-chain bridges, which can be centralized points of failure.

The key to UTXO Stack's cross-chain capabilities lies in the way it represents asset ownership. Every RGB++ asset/cell can be bound to a unique UTXO, even the UTXO is on another chain.

## Burn and Mint

`CSV Burn` and `CSV Mint` are common cross-chain asset transfer methods in UTXO Stack.
The extended asset contract `universal user defined token (uUDT)` supports two new operations:

### `CSVBurn(X, src_chain_id, dst_chain_id, out_point)`

CSVBurn is executed on the source chain, and the uUDT contract verifies:

1. At least `X` amount of tokens have been burned in this transaction.   
2. `src_chain_id` is the chain_id of the current chain.
3. `dst_chain_id` and `out_point` are the out_point on another chain.

### `CSVMint(X, burn_tx)`
CSVMint is executed on the destination chain, and the uUDT contract verifies:

1. The `burn_tx` exists on the `src_chain_id` and the time since it was packaged on the source chain has exceeded the `challenge period`.
2. The contract verifies that `burn_tx.dst_chain_id` must be the current chain.
3. The current transaction `inputs` must include the `out_point` specified in the related burn_tx.
4. Mint X amount of tokens for the user to retrieve on the current chain.


## Cross-Chain Complete Flow

The complete flow for the user to transfer tokens between UTXO Stack chains is as follows:

1. Call `CSVBurn` on the source chain to burn X tokens and provide a `mint out_point` on the destination chain.
2. Wait for one challenge period.
3. Generate a CSV proof on the source chain.
4. Call `CSVMint` on the destination chain and provide the `CSV proof`.
5. The `mint out_point` must be used as one of the mint transaction's inputs, and X amount of tokens will be minted.

By enabling seamless cross-chain interoperability, UTXO Stack empowers developers to build applications that can leverage the strengths of different UTXO blockchain networks. This opens up new possibilities for asset exchange, cross-chain lending, and other decentralized finance (DeFi) applications built on top of Bitcoin's robust security and decentralization.

[^1]: https://github.com/ckb-cell/RGBPlusPlus-design/blob/main/docs/light-paper-en.md
