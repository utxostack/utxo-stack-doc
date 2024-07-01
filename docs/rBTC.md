---
sidebar_position: 5
sidebar_label: rBTC Wrapper
---

# rBTC, Trustless Bitcoin Peg for Layer 2s


rBTC is a trustless, decentralized, two-way pegged Bitcoin asset wrapper protocol. It operates on the RGB++ layer and has the following characteristics:

- Trustless: Each rBTC is backed by over-collateralized assets, ensuring that users can receive full asset compensation even if participants in the asset pegging process act maliciously.
- Permissionless: The assets of rBTC holders can be converted to and from BTC without censorship or approval from anyone.
- Efficient: Collateral providers have high capital efficiency, as they can re-stake their deposits to earn higher interest, ensuring the protocol can offer higher capacity.

## Architecture


rBTC Peg Relayer (PR) provides funds or receives delegated funds from investors to stake on RGB++ layer, obtaining PR permissions. PR facilitates the bridge between rBTC and BTC.

- FROST schema: PR uses FROST technology to implement Schnorr Threshold Signature for managing the two-way asset bridge. PRs are rotated periodically.
- BTC SPV: There is a BTC SPV light client on RGB++ layer to obtain proof of cross-chain transfers from the Bitcoin full node.
- Security: The rBTC protocol ensures that PRs cannot act maliciously. If a collusion of PRs occurs, their collateral will be liquidated to provide full compensation to users.

## Over-collateralization

We calculate the maximum rBTC issuance based on an over-collateralization ratio of 150% to 200%. If the value of the collateral falls below the issued rBTC, the minting channel is immediately closed, leaving only the one-way burning channel open until the collateral once again exceeds the issued rBTC again.

## Trustless price feed

PR uses highly liquid collateral to provide value support for rBTC. The price of the corresponding collateral is directly read from the DEX on RGB++ layer, without relying on any Oracles. This price feed calculates the value of the collateral based on the average price of transactions over the last 24 hours.


## Capital efficiency

Unlike traditional multisig bridges, rBTC features **trustless and permissionless** characteristics, allowing users to use it without risk. Similar technologies include [tBTC](https://tbtc.network/) and [sBTC](https://sbtc.tech/). They are also over-collateralized BTC two-way asset bridges. However, while such over-collateralized asset bridges provide capital security, their capital utilization is very low (usually requiring over 150% over-collateralization), and the yields are very low, resulting in limited bridge capacity.

The collateral funds in rBTC can generate bridge-LST (Liquid Staking Token). These bridge-LST can be further used to provide security for the DA Layer and Branch Chains of the UTXOStack. Since rBTC is the fundamental asset of the entire UTXOStack, we require that only bridge-LST obtained through staking in the rBTC bridge can provide security to and earn reward from DA Layer and L2 Branch Chain. This approach significantly improves the capital efficiency of rBTC and increases the bridge capacity.

## Bridge security

The security of rBTC assets is ensured by the smart contracts on the RGB++ layer. Any malicious behavior by the PRs will be detected and addressed to safeguard user assets. These malicious behaviors and their handling mechanisms include:

- PRs refuse to mint rBTC after user deposits BTC:
  - Users can mint rBTC themselves using SPV proofs without relying on PR.
- PRs don't respond to user withdrawal requests:
  - If the user does not receive the withdrawal transaction after waiting for 7 days, they can request the forfeiture of PR's collateral on RGB++.
  - By providing BTC SPV proofs and challenges, it can be verified whether the withdrawal transaction exists on the chain.
- Collusion for malicious withdrawal:
  - If the withdrawal does not correspond to a legitimate rBTC UTXO burn, challengers can liquidate the PR's collateral on RGB++ layer, providing compensation to the affected users.

## Slashing

Although rBTC holders can receive full compensation when PRs collude to drain the vault, the stakers who have entrusted their collateral to the PRs will suffer the greatest losses. The major concern here is the mismatch of responsibilities and liabilities: when PRs commit malicious actions, it is not their own deposits that are slashed. This gives them a strong incentive to collude.

To alleviate this kind of attack, we can force the PR to deposit a certain amount of assets $d$ as collateral. Let's say there are a total value of $V$ BTC locked in the $m$-of-$n$ bridge, and we have the $k$ times collateral absorbed from stakers. To drain the bridge, every colluder has $ \frac{V}{m} - d = \frac{1}{a}\frac{k*n*d}{m} - d \approx (k-1)*d $ profit, where $a$ (typical 150%~200%) is the over-collateral rate. It looks we cannot have collateral leverage in a secure way!

## Capacity leverage

During the Schnorr threshold signing process, there is a SA (signature aggregator) that collects the signatures. To conspire a malicious withdrawal, the SA has to ask $m$ PRs to sign the transaction, and send back the signature. If we setup a report reward to those who provide the proof of malicious transaction signatures from PR, which comes from the PR's collateral $d$, the SA's profit will change.

$$
\text{profit} =
\begin{cases}
  \text{collude} & : V/m - d\\
  \text{report} & : (m-1)*d
\end{cases}
$$

With the **report reward**, to report the malicious action (even it's initialed by themselves), the SA have much more profit than to collude with others.

$$
\text{incentive} = m*d - V/m = m*d - \frac{1}{a}\frac{k*n*d}{m} \approx (m-k) * d > 0
$$

So **the more PRs we require for the threshold signature, the more capacity leverage $k$ we can have for the bridge**. For example, if we have a 21-of-30 threshold setup for the rBTC bridge, we can get 20x capacity leverage more than a simple over-collateralized bridge. However, if the SA controls more than one PRs, the capacity leverage will decrease proportionally. To alleviate this problem, we can randomly split the PRs into $g$ subgroups, every subgroup manages $1/g$ vault BTCs. The profit for every attack will decrease to $1/g$, but the slash remains the same.
