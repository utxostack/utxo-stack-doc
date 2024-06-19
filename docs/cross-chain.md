---
sidebar_position: 5
---

# Assets leap

UTXO stack 利用 RGB++ 的 Client side verification 功能支持无需信任的跨链。

## Burn and Mint

`CSV Burn` 和 `CSV Mint` 是 UTXO stack 常规的资产跨链方式

扩展资产合约，支持两个新操作:

`CSVBurn(X, src_chain_id, dst_chain_id, out_point)`

`CSVBurn` 在 App chain 上执行，合约验证:

1. 本次交易一定至少有 X amount token 被销毁了
2. src_chain_id 是当前所在的 chain 的 id
3. dst_chain_id 和 out_point 是另一条链上的 out_point

`CSVMint(X, burn_tx)`

`CSVMint` 在 RGB++ 层执行，合约验证:

1. burn_tx 在 src_chain_id 上存在，且上链时间超过了 Challenge Period
2. 合约验证 burn_tx.dst_chain_id 必须是当前链
3. 当前交易 inputs 中必须包含 `CSVBurn` 调用时指定的 out_point
4. Mint X amount token

用户取回 RGB++ 的完整流程如下:

1. 在 App chain 上调用 `CSVBurn` 销毁 X Token，并提供目标 chain 上的一个 `mint out_point` 作为目标
2. 在 App chain 生成 CSV proof
3. 等待 ChallengePeriod
4. 在目标链调用 `CSVMint` 并提供 `CSV proof`
5. 调用时必须使用 `mint out_point` 作为输入之一，并生成 X amount token
