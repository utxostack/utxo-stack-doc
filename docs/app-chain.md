---
sidebar_position: 3
---

# App Chain

An App chain is a Layer-2 chain that actually runs smart contracts. It is characterized by high TPS (Transactions Per Second), low fees, fewer block-producing nodes, and a challenge-based security model.

## Staking and Election

The App chain uses multiple validators to produce blocks using a PBFT-like consensus mechanism. This multi-party block production can reduces censorship attacks and collusion by nodes.

A Proof of Work (POW) chain is introduced simultaneously as a consensus component. Each App chain needs to deploy an election contract on the RGB++ compatible PoW chain. The current validators of the App chain are determined by the election contract. By incorporating the PoW chain, [long-range attacks](https://en.wikipedia.org/wiki/Proof_of_stake#Long-range_attacks) and censorship attacks that are common in Proof of Stake (POS) systems can be avoided.

Node operators can participate in elections by staking assets and submitting them to the election contract on the RGB++ supported platform. Regular users can also vote for operators by staking their assets to help with the election and earn certain rewards.

Elections are held for each App chain epoch, and the newly elected validators will produce blocks during the epoch.

## UTXO Isomorphism

### Cell Model

App chain employs an extended UTXO Cell model that is isomorphic to RGB++ compatible chains.

App chain, RGB++ compatible chains, and Bitcoin all use UTXO-like structures. By utilizing UTXO-specific technologies like single-use seals and client-side verification (CSV), the assets can be cross-chained while ensuring security.

### Turing-complete VM

The App chain employs the same Turing-complete virtual machine (VM) based on RISC-V. This enables the execution of arbitrary complex logic and compatibility with RGB++ smart contracts.

The App chain contract is executed in a scripting VM based on the open source RISC-V ISA, which compatible with the RGB++ development toolchains. Therefore, any language with a compiler that supports the RISC-V ISA should be able to develop App chain contracts.

## Challenge Model

The security of the App chain is based on a challenge model.

If an invalid block is produced, a challenger can discover the invalid block and submit a challenge proof to the challenge contract on a bound RGB++ compatible PoW chain within one challenge period.

To implement the challenge mechanism, the following must be ensured:

    1. The Challenger can obtain the complete data of blocks produced by the app chain validators within one challenge period.
    2. The challenge contract can verify App chain transactions.

### Data Availability (DA) Issue

A [DA layer](./da-layer.md) is introduced to address the Data Availability (DA) issue.

On every RGB++ compatible chain, an App chain light client contract is maintained. This contract records all App chain headers.

After an App chain produces a block, the validator must submit the complete block to the DA layer and obtain a DA proof. Then, the block header and DA proof are submitted to the RGB++ light client contract to update the state.

The App chain block is considered confirmed only after completing the above submissions. If a validator fails to update the light client contract for a prolonged period, the election contract will penalize the validator's staking and initiate a re-election process.

When submitting a header, the DA layer verification contract checks the DA proof to ensure that the complete block has been stored in the DA layer for no less than the Challenge Period.

Challengers can extract the complete block from the DA layer and generate challenge proofs when necessary.

### Transaction Verification

The App chain and RGB++ use the same cell model structure.

Therefore, as long as all data (cells or block headers) that the App chain transaction depends on are provided, the App chain transaction can be verified on RGB++. We can use the `ckb_spawn` and `ckb_exec` syscalls to construct a secure verification environment.

## Cross-chain Asset Transfer

We use XUDT to represent assets, with the asset contract deployed on RGB++. All App chain asset cells refer to the same XUDT contract. Hence, an XUDT cell on RGB++ and all App chains is equivalent.

Cross-chain asset transfer involves transferring the cell and completing the XUDT asset transfer.

We use the concept of Single-use seals to achieve cross-chain asset transfers.

The extended XUDT protocol supports two new operations:

`CSVBurn(X, src_chain_id, dst_chain_id, out_point)`

The contract verifies that at least X amount of tokens are burned in this transaction. `src_chain_id` is the ID of the current chain, and `dst_chain_id` and `out_point` specify an out point on another chain.

`CSVMint(X, burn_tx)`

The contract verifies that `burn_tx` exists and is confirmed on `src_chain_id` (through App chain light client verification). The contract verifies that `burn_tx.dst_chain_id` must be the current chain, and the inputs of the current transaction must include the `out_point` specified in `CSVBurn`. This transaction allows minting X amount of tokens.

As described, using the concept of Single-use seals, we support decentralized cross-chain operations between App chains and between App chains and RGB++.

For cross-chain operations between RGB++ protocol and Bitcoin, refer to the [RGB++ protocol](https://github.com/ckb-cell/RGBPlusPlus-design) documentation.

## Relevant RGB++ Contracts

* App chain election contract
* App chain light client contract
* DA layer verification contract
* Extended XUDT contract

## Customizing App Chains

The App chain can be configured to allow cross-chain assets for paying transaction fees. For example, in a Bitcoin scaling scenario, using BTC assets to pay transaction fees can provide a more consistent user experience.