---
sidebar_position: 9
---

# Glossary

### RGB++ layer

[RGB++](https://github.com/ckb-cell/RGBPlusPlus-design/blob/main/docs/light-paper-en.md) is a protocol by using single-use seals and client-side validation techniques to manage state changes and transaction verification.

In the UTXO stack, the RGB++ layer serves as the contract layer, resolving challenge disputes, validator elections, and staking.

### RGB++ assets

RGB++ assets are an extended assets protocol deployed on the RGB++ layer. It supports permissionless asset transfer across chains via client-side verification.

### RGB++ assets leap protocol

A permissionless protocol to move assets across chains.

### Client-side verification proof

Client-side verification is an RGB++ feature.

Client-side verification proof is composed of a series of UTXO transactions and Merkle proofs. With the proof, we can verify these transactions' validity an independent context. For example, we can generate a client-side verification proof from an App chain and verify the proof in an RGB++ contract.

### DA layer / DA chain

Data availability layer or Data availability chain. The DA chain is an infrastructure that solves data availability problems in the UTXO stack.

The DA chain provides a set of interfaces to support data storage, data retrieval, and data proof. The DA chain's consensus guarantees that the DA layer nodes keep submitted data for at least the Challenge Period duration.

### DA validator

A DA chain validator who has a stake in the DA staking contract. A validator has the chance to participate in the consensus of a block by signing. A validator's stake will be slashed if they sign an invalid block.

### DA light client

A DA chain light client deployed on the RGB++ layer. RGB++ contracts can access the DA light client to prove data is submitted to the DA chain.

### App chain

An app chain is a layer-2 rollup chain that maintains a chain state contract on the RGB++ layer. A challenge of invalid layer-2 state can be sent from the RGB++ layer.


### App chain validator

An App chain validator who has a stake in the App chain staking contract. A validator has the chance to participate in the consensus of a block by signing. A validator's stake will be slashed if they sign an invalid block.

### App chain light client

An App chain light client deployed on the RGB++ layer. RGB++ contracts can access the light client to prove the App chain's state.

### Challenge Period

The challenge period is a window of time during which a layer-2 block can be challenged. After the Challenge Period, the layer-2 block is considered confirmed.


### Chain state challenge

A staker can start a chain state challenge if they disagree with the DA chain or an app chain's chain state.

A challenge proof contains an invalid transition and a Merkle proof. The proof can be verified on the RGB++ layer. The contract guarantees that the failed party loses their stake.

When under a DA attack, there may not be enough data to construct such a proof. In such a situation, see DA exit challenge.

### RGB++ DA exit challenge

When an App chain is under a DA attack, an asset holder can start an asset attestation by providing a client-side verification proof (the proof is stored on the user's local device).

The asset attestation will be canceled if anyone submits a valid transaction that spends the UTXO (which means the asset holder is using an obsolete state). Otherwise, after the challenge period, the asset holder can mint the corresponding assets on the RGB++ layer. App chain validators must update the app chain states to reflect the DA exit.
