---
sidebar_position: 4
---

# UTXO stack DA layer

UTXO stack DA layer 使用轻节点 data sampling 解决 data availability 问题。

UTXO stack 及 RGB++ 提供了 DA 攻击时的退出方案，详见 DA exit 文档。因此资产安全性并不依赖于 DA layer 安全性，但使用 DA layer 仍然有很多好处:

1. 提升做恶成本，攻击者必须同时攻击 DA layer 以及 App chain 才可以操作资产
2. 降低挑战成本，DA layer 支持通过轻节点获取数据以及 Data sampling 检查数据合法性，使运行挑战节点的成本更低
3. 集中 Staking, DA layer 的 Staking 相比分散开的 App chain 会更加集中，增加 DA layer 共识的安全性

## DA chain

### Header

DA chain 使用和 App chain 类似的架构，在原有结构上扩展了共识机制以及 P2P 网络等协议来支持 DA layer 的功能。

DA chain 的 Block 结构与 App chain 保持一致。但是 `tx_root` 字段含义有新的变化，DA chain 中我们计算 `merkle_hash(tx_root, tx_blob_root)` 作为新的 `da_tx_root`

``` rust
// App chain

let tx_root = merkle_hash(txs);

// DA chain

let tx_root = merkle_hash(txs);
let tx_blob_root = merkle_hash(txs.map(|tx| merkle_hash(tx.blobs)))
let da_tx_root = merkle_hash([tx_root, tx_blob_root]);
```

我们扩展 P2P message protocol 在传输 Block 时额外广播 Block 包含的 Blobs 列表, DA chain 的 Validator 必须等到接收到完整 Block 以及完整的 Blobs 后，再去验证 `da_tx_root`。如果没问题再继续验证并签名。


### Submit Data

DA chain 在 Genesis 内置一个 Dummy Type ID - Data Store，该合约用来标记交易是否提交 Blobs。Data Store 规则由共识验证。

交易如果提交数据，那么第一个 output Type ID 必须使用 Data Store, 且 output 的 data 字段必须为 32 bytes 的 `merkle_hash(blobs)`。Validator 收集到 Block 中提交的完整的 blobs 后会检查每个交易的 `blob_root` 以及 `da_tx_root` 是否合法，如果不合法则拒绝该块。

用户提交 Blob 时使用 `submit_tx_with_blobs` 接口，除了提供 UTXO stack tx 外，用户需要额外提供 Blobs 列表。Validator 收到交易后检查 Blobs 提交信息是否与交易中一致，如果一致则广播交易与 Blobs。

Blob 结构如下:

``` rust
pub struct Blob {
    version: u32,
    data: Bytes,
}

pub struct TxWithBlob {
    tx: Tx,
    blobs: Vec<Blob>
}
```

### DA proof

在提交的交易打包后，用户可以通过 Block header 中的 `da_tx_root` 提供 Merkle Proof。证明某个 blob 被提交。

证明 Layer2 App chain 数据已经被提交到 DA chain:

1. App chain header 中需要保存提交数据的 blobs merkle root - `da_blobs_root`
2. 等待 DA chain 打包 Blobs，获取 DA chain 的 header 以及 `da_blobs_root` 的 Merkle Proof
3. 在 RGB++ 合约中通过 DA chain 轻节点验证 Merkle Proof，如果通过验证则证明 App chain Block 已经被提交到 DA layer

## Pruning

开启 Pruning 的节点会定期删除 Block 以及 Blobs 数据，只保留 Header。节点可以设置为 Archive 模式保存完整数据。

## Data sampling

DA chain 节点使用 Reed-Solomon erasure coding 存储 Blobs 数据。DA 节点将 Block 数据以及 Blobs 分成多个 shares, 并通过 2D Reed-Solomon Encoded Merkle tree 将 shares 编入 2D 的矩阵结构中，通过这种方式我们可以得到 dataRoot 以及 2D 矩阵中每个行和列的 Root。

![2D Reed-Solomon Encoded Merkle tree](/img/da-layer/2D-Reed-Solomon-Encoded-Merkle-tree.jpeg)

轻节点随机的选择一组坐标向全节点查询 shares, 如果全节点返回合法的 shares 那么我们认为大概率数据没有丢失。轻节点持续请求全节点并通过 P2P gossip 协议传播 shares，如果网络中轻节点数量足够大，那么诚实的全节点可以从 P2P 网络中获取足够恢复完整信息的 shares。

[original paper](https://arxiv.org/abs/1809.09044)

## 参考

* [Fraud and Data Availability Proofs: Maximising Light Client Security and Scaling Blockchains with Dishonest Majorities](https://arxiv.org/abs/1809.09044)
* [Celestia's data availability layer](https://docs.celestia.org/learn/how-celestia-works/data-availability-layer)
