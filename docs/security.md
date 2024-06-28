---
sidebar_position: 7
---

# Security

This documentation reviews the security of the UTXO Stack components:

* RGB++
* Challenger
* Branch chain
* DA layer

The UTXO stack supports DA exit with CSV proofs and interactive challenge in extreme attack situations.

Therefore, even if the Branch chain and DA layer are attacked, it won't directly affect RGB++ asset security, only the Branch chain's liveness.

As long as RGB++ and the challenge mechanism are functioning, RGB++ assets remain secure. The security depends solely on the RGB++ layer.

The concept of "Bitcoin-level security" is introduced. If assets are secured by PoW (Proof of Work) and the mining power can be compared to the mining power used to protect Bitcoin, then those assets are considered to have Bitcoin-level security.

## RGB++

RGB++ supports client-side verification features, which verify RGB++ transactions in an independent context, such as on a different blockchain. Therefore, RGB++ contracts can be deployed to any Turing-complete blockchain that fully implements RGB++ verification. By binding the RGB++ layer to a PoW consensus chain, the security of the RGB++ layer can be compared to Bitcoin based on their PoW mining power.

### Equivalent PoW Security

This section provides a methodology to analyze the security by comparing the attacking cost of the RGB++ layer and Bitcoin.

Bitcoin is considered highly secure after 6 confirmation blocks, so this is used as the baseline. If reverting an RGB++ state needs more mining power and cost than Bitcoin, RGB++ is considered to have Bitcoin-level security. The mining power and cost required to revert 6 Bitcoin confirmation blocks are evaluated, involving estimating the amount of mining power rental cost needed to reverse these blocks. Then, the number of confirmation blocks on the RGB++ deployment chain that cost the same mining power and financial resources to revert are determined. The confirmations on the RGB++ layer have the same security as 6 Bitcoin confirmation blocks since the attacking cost is the same.

This equivalence allows for the determination of the appropriate confirmation time for transactions in RGB++, ensuring that the security of RGB++ is comparable to Bitcoin-level security when deployed on a PoW blockchain.

## Challenger

The UTXO Stack uses a challenge-based security assumption, where during the challenge period, a challenger will identify bad blocks and initiate a challenge. This assumption is similar to Rollup and the Lightning Network, so the challenge mechanism of the UTXO Stack is considered to be at least as secure as those.

Since RGB++ supports CSV proofs, UTXO Stack challengers can operate using a light client protocol at low cost. Additional incentive measures, such as watchtowers, are considered to further increase the number of challengers among nodes.

## DA layer

The DA layer does not directly determine the overall security of the UTXO Stack. However, by introducing the DA layer, the cost of attacks can be increased. An attacker must control both the Branch chain and the DA layer to perform a DA attack. Therefore, the introduction of the DA layer helps protect Branch chains with smaller TVL (Total Value Locked).

## Conclusion

Several components related to security in the UTXO Stack have been described. Attacks on the Branch chain and DA layer affect branch chain liveness but do not actually affect user assets. RGB++ can achieve Bitcoin-level security through PoW equivalence confirmations, while the challenger mechanism ensures that the overall security of the UTXO stack is similar to Rollup and the Lightning Network.
