---
sidebar_position: 6
---

# Exit Mechanism

In the extreme situation of simultaneous attacks on both the branch chain and DA layer, users can still leverage CSV (client-side verification) and interactive challenges to recover RGB++ assets from a branch chain to the bound RGB++ layer.

This redundant exit mechanism ensures that the security of user funds depends solely on the RGB++ layer and the challenge mechanism.


## Interactive Challenge Process

When the branch chain and DA layer are simultaneously compromised, users may lack sufficient data from DA layer to independently construct a valid CSV proof. To address this, users need to locally maintain the most recent CSV proof. By utilizing wallets or auxiliary tools that support CSV proof storage, users can securely retain the necessary evidence on their own devices.

Upon detecting an attack, users can initiate an interactive challenge within the RGB++ smart contract to prove the asset's state on the branch chain:

1. **Initiate DA Attest Challenge**
   - The user calls the RGB++ contract to begin the DA attest challenge process.
   - The user provides the asset transaction history and CSV proof from before the most recent challenge period.
   - The user attaches a small bounty to incentivize challenger participation.

2. **Challenger Node Verification**
   - challenger nodes monitor the chain for active DA attest challenges.
   - Upon discovery, they compare the on-chain data with their local records.
   - If the UTXO is known and has no subsequent transactions, the challenger ignores/agrees it.
   - If the UTXO has subsequent transactions, the challenger submits the transaction and Merkle proof, terminates the DA attest, and claims the bounty.

3. **Proceed with DA Exit**
   - If the DA attest remains unchallenged after one challenge period, the user can proceed with the DA exit process by calling the RGB++ contract.

4. **Prioritized Asset Exit**
   - To prevent attackers from forging assets and fraudulently exiting, the DA exit process sorts assets based on the block number and transaction index of their last recorded transaction.
   - Honest users and nodes will cease broadcasting transactions upon detecting a DA attack, ensuring that forged assets are ranked after legitimate ones.
   - As a result, the assets of honest users will be prioritized for exit, while forged assets will be unable to exit due to insufficient funds.

5. **Asset Unlocking and Minting on the bound RGB++ Layer**
   - Upon successful DA exit, the user provides a signature to unlock the assets and destroys the related proof UTXO.
   - The corresponding RGB++ assets are then minted on the bound RGB++ Layer, which operates on a PoW consensus mechanism, providing enhanced security.

This interactive challenge process, combined with the secure asset exit mechanism, ensures the resilience and recoverability of the RGB++ ecosystem against potential attacks targeting on branch chain and DA layer simultaneously.


## Watchtower Assistance

The aforementioned exit process requires users to locally maintain CSV proof and continuously monitor the branch chain and DA chain for anomalies, actively initiating challenges when necessary. This may prove burdensome for many users.

To alleviate this, the system introduces `Watchtower nodes`. These nodes continuously observe the chains and, upon detecting an attack, helps the user start the exit process. User participation is only required at the final stage of minting assets.


## RGB++ Layer Governance-Triggered Exit

As an ultimate safeguard, in the extreme situation of a DA layer attack, users can vote for a forced exit through the UTXO stack governance contract.

If the vote exceeds a 70% threshold, the branch chain state contract on RGB++ Layer will stop accepting new blocks and exit all assets in prioritized order from the branch chain.


## Conclusion

The UTXO Stack exit mechanism combines user interactive challenges, watchtower assistance, and governance-triggered forced exit to enhance ecosystem resilience, ensuring the resilience and recoverability of the RGB++ ecosystem against potential attacks that simultaneously target branch chains and DA layer. Its true effectiveness in ensuring ecosystem resilience and recoverability remains to be seen in practice.
