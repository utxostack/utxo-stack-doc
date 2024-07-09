---
sidebar_position: 10
---

# Glossary

### Branch chain

A UTXO-based PoS chain that serves as Bitcoin Layer 2. A Branch chain can be easily created using UTXO Stack. It maintains a chain state contract on the RGB++ Layer.

### Client-Side Validation (CSV)

A method where users individually verify the changes related to their assets through off-chain computation, ensuring asset security by only validating the UTXO branch history relevant to them without relying on a consensus process or centralized third parties.

### DA layer / DA chain

Data Availability layer or Data Availability chain. An infrastructure that solves data availability problems of Branch chains. The DA chain provides a set of interfaces to support data storage, data retrieval, and data proof.

### RGB++ assets

Assets issued on the RGB++ layer under the RGB++ protocol. RGB++ assets are capable of cross-chain transfer without bridges.

### RGB++ Layer

A UTXO-based Turing-complete blockchain that UTXO Stack uses to implement the [RGB++ protocol](https://github.com/ckb-cell/RGBPlusPlus-design/blob/main/docs/light-paper-en.md). The RGB++ Layer efficiently manages state changes and transaction verification.

### Simplified Payment Verification (SPV)

A method to verify bitcoin payments without running a full network node. A SPV wallet only needs a copy of the block headers of the longest chain.

### Single-Use Seal

A cryptographic mechanism designed to eusure that the message can only be used once. The concept was first [introduced by Peter Todd](https://petertodd.org/2016/state-machine-consensus-building-blocks) in 2016. Specifically, Bitcoin’s Unspent Transaction Outputs (UTXOs) can serve as seals for messages, and the Bitcoin system’s consensus mechanism ensures that these UTXOs can only be spent once, meaning that these seals can only be opened once.







