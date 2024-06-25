---
sidebar_position: 4
sidebar_label: RGB++ Layer
---

# RGB++: the Bitcoin Native Programmability Layer

[RGB++ protocol](https://github.com/ckb-cell/RGBPlusPlus-design/tree/main) is inspired by RGB and Taproot Assets. It uses Single-use Seals and Client-side Validation techniques to manage state changes and transaction verification. With the RGB/RGB++ protocol, we can introduce a Turing-complete eUTXO structure on the Bitcoin, enabling the development of feature-rich smart contracts. The RGB protocol requires a heavy burden for end users to verify, maintain, and transfer their off-chain data. RGB++ protocol alleviates the problem by introducing a Turing-complete UTXO chain as the public and shared client-side validator.

## Isomorphic Binding

[Client-side validation, aka CSV](https://bitcoinops.org/en/topics/client-side-validation/) enables user to verify their states without an onchain state consensus. Combined with Bitcoin transaction commitment, RGB/RGB++ protocols make Turing-complete extension for Bitcoin possible. 

RGB++ uses isomorphic bindings to solve the problems encountered by the RGB protocol and unlock more possibilities. In RGB, the two most important components are UTXOs, determining ownership, while commitments manage state and single-use seals. In contrast, RGB++ leverages isomorphic bindings to map UTXOs on Bitcoin to eUTXOs on another Turing-complete chain, ensuring ownership synchronization through the utilization of Bitcoin's UTXO locking scripts. Meanwhile, the state maintenance is managed by the eUTXOs.

All RGB++ transactions undergo synchronization, resulting in one transaction on both the BTC and eUTXO chains. The former is similar to RGB protocol transactions, while the latter serves to replace the client-side validation process. Users only need to check the corresponding transaction on eUTXO chain to verify whether the state of the RGB++ transaction is correct.

## Cross-chain Leap

In the RGB/RGB++ protocol, asset ownership is held by Bitcoin UTXOs, while asset states and smart contracts are stored and verified in eUTXOs. This unique structure facilitates a new cross-chain schema more suited to the UTXO model. Compared to the EVM account model, where assets must be locked on the source chain and minted on the target chain (and vice versa, where assets must be burned on the target chain and unlocked on the source chain), the Leap function eliminates the need for such operations. Instead, during a Leap transfer, the recipient's UTXO on the target chain is specified. Once on the target chain, the ownership of RGB++ assets can continue to be transferred within the UTXOs of the target chain. Leap technology is **bridgeless, trustless, and permissionless**.

## Security

In the RGB++ protocol, transaction security at the first layer is protected by Bitcoin's main chain PoW. Only by successfully executing a double-spend attack on a Bitcoin UTXO can an attack on the RGB/RGB++ protocol occur. Concerns may arise regarding the data availability of RGB++ since the contract data is not entirely stored on the Bitcoin main chain. If data is lost, users' assets could also be lost. However, this issue is almost nonexistent under the CSV architecture. The recipient of the UTXO must verify the entire history of the UTXO & eUTXO being transferred through CSV, and the sender is obligated to provide this data. If the sender fails to provide the necessary data, the recipient can simply ignore these UTXOs, which will not affect the user's existing assets.

Another security challenge is the cross-chain security. When RGB++ assets leap between different UTXO chains, there is a risk of asset loss due to the differing security levels of these chains. To address this, we can apply the principle of **PoW security equivalence**. By waiting for a sufficient number of block confirmations, we can achieve security for asset leaping between PoW UTXO chains that is equivalent to or higher than six block confirmations on Bitcoin (benefiting from the exponential relationship between PoW security and the number of block confirmations). However, it must be acknowledged that assets Leaping to or from PoS chains cannot enjoy the same level of security.

## Development Experience

The first implementation of RGB++ is isomorphic binded with the public chain Nervos CKB. And we will adopt more eUTXO chains like Feul, Cardano, and Sui in the future. Developers write Rust or C/C++ programs and compile to RISC-V target on the current RGB++ layer.