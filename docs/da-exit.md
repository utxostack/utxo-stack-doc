---
sidebar_position: 6
---

# RGB++ DA exit

利用 CSV 以及交互式挑战，用户可以在 App chain 以及 DA layer 同时被攻击的情况下恢复 RGB++ 资产。

> 在 App chain 以及 DA layer 同时被攻击时，用户无法直接从 DA layer 获取足够数据构造 CSV proof。因此需要用户在本地保存 CSV proof, 用户通过使用支持保存 CSV proof 的钱包或者其他辅助工具可以在本地保留所需证明。

假设用户本地保存了完整的 CSV proof 以及最后一笔交易发生时的状态，但因为 App chain 和 DA layer 被攻击而无法生成当前资产状态的证明，用户需要交互式挑战证明资产在 App chain 上最终的状态:

1. 用户使用资产的 CSV history 构造一颗 binary merkle tree, leaf 是所有的 CSV history 交易 hash
2. 用户发送最新的资产状态以及 CSV history merkle root 到 RGB++, 并附上一小笔 bounty, 开始 DA attest 挑战
    1. 用户本地最新的 UTXO 状态以及 merkle proof
    2. CSV history merkle root 以及 left, right child
    3. commitment `CSVBurn` 的合约参数，在挑战成功后使用参数重指定的 out_point mint 资产
3. challenger node 发现链上 DA attest 后需要和本地 UTXO 状态对比
    1. 如果 UTXO 已知且无后续交易则忽略
    2. 如果 UTXO 有后续交易，则 challenger 可以直接提交交易和 merkle proof 去终止 DA attest
    3. 如果本地无法识别 UTXO，challenger 可以调用合约请求用户 reveal merkle tree 的 left child 或者 right child, challenger 需要附上一小笔 bounty
4. 用户相应挑战请求并 reveal 相应的 merkle node
5. 3.3 和 4 步骤可能会重复多次，直到找到 merkle tree leaf 节点的 tx
6. 执行该 tx 并 slashing 和执行结果不同的一方的 bounty, 把 bounty 的一部分奖励给挑战胜利者
7. 在 Challenge Period 之后，如果仍未有挑战成功。用户的 DA attest 成功
8. 用户消耗 `out_point mint` 并调用 `CSVMint` mint RGB++ 资产
