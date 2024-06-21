---
sidebar_position: 6
---

# RGB++ DA exit

利用 CSV 以及交互式挑战，用户可以在 App chain 以及 DA layer 同时被攻击的情况下恢复 RGB++ 资产。

> 在 App chain 以及 DA layer 同时被攻击时，用户无法直接从 DA layer 获取足够数据构造 CSV proof。因此需要用户在本地保存 CSV proof, 用户通过使用支持保存 CSV proof 的钱包或者其他辅助工具可以在本地保留所需证明。

## Exit & Challenge

假设用户本地保存了最近一次的资产交易状态以及 CSV proof，但因为 App chain 和 DA layer 被攻击而无法生成当前资产状态的证明，用户需要在 RGB++ 合约进行交互式挑战证明资产在 App chain 上的状态:

1. 用户调用 RGB++ 合约开始 DA attest 挑战
    1. 提供最近一个 Challenge Period 之前的资产交易状态以及 CSV proof
    2. 如果最近一次交易还未经过 Challenge Period，则用户需要等待 Challenge Period 结束再发起挑战
    3. 需要附上一小笔 bounty
2. Challenger node 发现链上的 DA attest 挑战后需要和本地数据对比
    1. 如果 UTXO 已知且无后续交易则忽略
    2. 如果 UTXO 有后续交易，则 challenger 提交该交易和 merkle proof 并终止 DA attest，获取 bounty
3. DA attest 如果经过 Challenge Period 后仍未被终止，用户继续调用 RGB++ 合约 DA exit
4. 为了防止攻击者伪造资产并退出，DA exit 按照资产最后的交易所在的 block number 和 tx index 排序，并按照顺序退出资产，诚实的用户及节点发现 DA 攻击后会停止广播交易，因此攻击者伪造的资产一定排在诚实用户之后，因此，诚实用户的资产会优先退出，攻击者伪造的资产则因为资产不足无法退出
5. 用户 DA exit 成功后，提供解锁资产的签名并销毁 Proof UTXO，Mint 对应的 RGB++ 资产

## Watchtowers

上述描述的退出方式需要用户本地保存 CSV proof，以及持续观察 App chain 和 DA chain 的运行情况，主动发起挑战。这对于大部分用户来说成本过高，我们引入 Watchtower 节点，Watchtower 观察 App chain 及 DA chain 出现异常情况时，节点帮助用户开始退出流程，直到最后实际 Mint 资产才需要用户参与。

## L1 强制退出

作为最终的保障，在 DA layer 被攻击时，用户可以在 UTXO stack 治理合约发起强制退出投票。

当投票超过 70% 时，App chain 状态合约会停止接受新块，并按照顺序退出链上的所有资产。
