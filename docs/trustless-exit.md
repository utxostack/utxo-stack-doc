---
sidebar_position: 7
---

# Trustless Exit

Trustless exit 是一种无需信任的资产取回方式。仅依赖 RGB++ 合约以及 UTXO stack 挑战机制。

用户通过提供 Challenge Period 时间段内的 RGB++ CSV proof 证明资产合法，并快速的在 RGB++ 层取出资产。

Trustless 在两种情况下非常有用：

1. 用户需要快速的取回资产，不想等待 Challenge Period 时间后提取。
2. 用户资产所在的 App chain 或 DA layer 被攻击，无法从常规途径取回资产。

## CSV Mint

资产合约增加一个新的方法，通过验证 CSV proof Mint 资产。

`CSVMint(X, chain_id, csv_proof)`

* `X` 为需要取回的资产数量
* `chain_id` 为 App chain 的唯一标识
* `csv_proof` 为 Challenge Period 时间内的 RGB++ CSV proof

`CSVMint` 进行以下验证，并 Mint 资产

1. 验证 CSV proof 以及 App chain light client
2. 如果通过验证则允许用户在 outputs 中 Mint 相应资产
3. 检查并更新 App chain 的状态，记录资产已被 mint

用户可以从 DA layer 获取 `CSV proof`。

假设在极端情况下 DA layer 被攻击，用户仍然可以从本地支持 CSV proof 的钱包中获取证明。

在 DA 攻击的情况下无法获取 App chain 最新的状态及证明, 因此无法证明资产的最终状态，在 DA 攻击时需要额外经过 Interactive challenge。

## Interactive challenge

如果 App chain / DA chain 被攻击，必须从支持 CSV proof 的钱包构造 CSV proof，此时我们仅能生成资产在最后一笔交易发生时的证明，而无法生成当前资产状态的证明。

在这种情况下用户需要进入 Interactive challenge:

1. 用户提交 csv_proof 证明资产最新的 out_point 和状态
2. 用户需要等待 Challenge Period 时间
3. 在等待阶段任何人可以提交 merkle proof 以及使用资产 out_point 作为 input 的 transaction 来赢得 challenge

如果有人在步骤 3 提交了资产被消耗的证明，那么用户的挑战失败且用户会损失一部分资产作为惩罚。

如果用户成功等待了 Challenge Period 时间，则挑战成功，用户可以通过 `CSVMint` 铸造资产。
