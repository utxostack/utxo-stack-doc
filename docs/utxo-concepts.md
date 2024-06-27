---
sidebar_position: 2
---

# UTXO Concepts

<figure align="center">
  <img src="/img/utxo-architecture/overall.jpeg" alt="UTXO stack overall architecture" />
  <figcaption align="center">UTXO stack architecture</figcaption>
</figure> 

## RGB++ Layer

[RGB++](https://github.com/ckb-cell/RGBPlusPlus-design/blob/main/docs/light-paper-en.md) is a protocol that uses single-use seals and client-side validation techniques to manage state changes and transaction verification.

In the UTXO stack, the RGB++ layer serves as the contract layer, resolving challenge disputes, validator elections, and staking.

## BTC Bridge

The BTC Bridge enables the seamless transfer of Bitcoin to the Branch chain, enhancing interoperability and expanding the utility of Bitcoin in decentralized applications on the Branch chain.

## DA layer / DA chain

Data availability layer or Data availability chain. The DA chain is an infrastructure that solves data availability problems in the UTXO stack.

The DA chain provides a set of interfaces to support data storage, data retrieval, and data proof. The DA chain's consensus guarantees that the DA layer nodes keep submitted data for at least one Challenge Period duration.

## Branch chain

A Branch chain is a layer-2 rollup chain that maintains a chain state contract on the RGB++ layer. A challenge of invalid layer-2 state can be sent from the RGB++ layer.

## Challenge

The challenge nodes mechanism observes the UTXO stack and initiates a challenge when it encounters an invalid state.
