---
sidebar_position: 5
sidebar_label: rBTC
---

# rBTC, Trustless Bitcoin Peg for Layer 2s


rBTC is a trustless, decentralized, two-way pegged Bitcoin asset protocol. It operates on the RGB++ layer and has the following characteristics:

- Trustless: Each rBTC is backed by over-collateralized assets, ensuring that users can receive full asset compensation even if participants in the asset pegging process act maliciously.
- Permissionless: The assets of rBTC holders can be converted to and from BTC without any censorship and without needing anyone's approval.
- Efficiency: Collateral providers have high capital efficiency, as they can re-stake their deposits to earn higher interest, ensuring the protocol can offer higher capacity.

## Architecture


rBTC Peg Relayer (PR) provides funds or receives delegated funds from investors to stake on RGB++ layer, obtaining PR permissions. PR facilitates the bridge between rBTC and BTC.

- FROST schema: PR uses FROST technology to implement Schnorr Threshold Signature for managing the two-way asset bridge. PRs are rotated periodically.
- BTC SPV Node: There is a BTC SPV light node on RGB++ layer to obtain proof of cross-chain transfer from the Bitcoin main chain.
- Security: The rBTC protocol ensures that PRs cannot act maliciously. If a collusion of PRs occurs, their collateral will be liquidated to provide full compensation to users.

## Over-Collateralization

We calculate the maximum rBTC issuance based on an over-collateralization ratio of 150% to 200%. If the value of the collateral falls below the issued rBTC, the minting channel is immediately closed, leaving only the one-way burning channel open until the collateral once again exceeds the issued rBTC.

## Trustless Price Feed

PR uses highly liquid collateral to provide value support for rBTC. The price of the corresponding collateral is directly read from the DEX on RGB++ layer, without relying on any Oracles. This price feed calculates the value of the collateral based on the average price of transactions over the last 24 hours.


## Capacity and Capital Efficiency

Unlike traditional multisig bridges, rBTC features **trustless and permissionless** characteristics, allowing users to use it without risk. Similar technologies include [tBTC](https://tbtc.network/) and [sBTC](https://sbtc.tech/). They are also over-collateralized BTC two-way asset bridges. However, while such over-collateralized asset bridges provide capital security, their capital utilization is very low (usually requiring over 150% over-collateralization), and the yields are very low, resulting in limited bridge capacity.

The collateral funds in rBTC can generate bridge-LST (Liquid Staking Token). These bridge-LST can be further used to provide security for the DA Layer and Branch Chains of the UTXOStack. Since rBTC is the foundational asset of the entire UTXOStack, we require that only bridge-LST obtained through staking in the rBTC bridge can provide security to and earn reward from DA Layer and L2 Branch Chain. This approach significantly improves the capital efficiency of rBTC and enhances its capital capacity.

## Security

The security of rBTC assets is ensured by the smart contracts on the RGB++ layer. Any malicious behavior by the PRs will be detected and addressed to safeguard user assets. These malicious behaviors and their handling mechanisms include:

- PRs refuse to mint rBTC after user deposits BTC:
  - Users can mint rBTC themselves using SPV proofs without relying on PR.
- PRs don't respond to user withdrawal requests:
  - If the user does not receive the withdrawal transaction after waiting for 7 days, they can request the forfeiture of PR's collateral on RGB++.
  - By providing BTC SPV proofs and challenges, it can be verified whether the withdrawal transaction exists on the chain.
- Collusion for malicious withdrawal:
  - If the withdrawal does not correspond to a legitimate rBTC UTXO burn, challengers can liquidate the PR's collateral on RGB++ layer, providing compensation to the affected users.
