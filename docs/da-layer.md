---
sidebar_position: 4
---

# DA layer

DA layer 是 UTXO stack 非要重要的组件之一，UTXO stack 的挑战机制依赖 DA layer 解决数据可见性问题，DA layer 必须去中心化设计，防止 DA layer 与 app chain 出块节点共谋才能保护网络安全。

UTXO stack DA layer 使用 Bitcoin POW merge mining 共识，与 Bitcoin POW 安全假设相同，假设 51% 的挖矿算力是诚实的，我们可以认为 DA layer 是安全的。

## Bitcoin merge mining

https://en.bitcoin.it/wiki/Merged_mining_specification

## The heaviest chain

DA block 和 Bitcoin block 仅共享算力, 被 Bitcoin block 打包的 DA block 不一定是合法的。我们可以通过下面的方式找到一条合法的 DA chain。

1. 下载 BTC headers 以及 coinbase 和 coinbase merkle proof
2. 验证 BTC POW 以及 header 字段，验证 coinbase merkle proof
3. 从 coinbase 交易中找到 DA layer 提交的 block hash
4. 从 DA layer P2P network 中获取 block header 并检查
    * `DABlock.parent_hash` 是前一个合法的 DA block
    * `DABlock.recall_hash` 计算正确
5. 如果通过检查则保存 DABlock 并以 BTC block 难度计算 `DABlock.chain_work = parent.chain_work + BTCBlock.chain_work`, 否则跳过继续下一个
6. 从合法的 DABlock 中找到 `chain_work` 最高的块作为 Tip

考虑 DA layer 只保存一定时间(D: Duration) 内的数据，我们可以在第一步中仅下载 D 时间内的 BTC headers 进行搜索。

## Proof of Access

Proof of Access 是一个简单的 POW 变体，激励矿工持续存储 DA layer 数据。

每一个 DABlock 会有一个对应的 RecallBlock，RecallBlock 指向 DABlock 的历史。在计算 DABlock header 时，miner 必须通过确定性的随机数计算出指定的 RecallBlock 并且利用 `RecallBlock` 计算当前 DA header 的 `recall_hash`。

我们选择打包当前 DA header 的 BTC block 的 parent_hash 作为 recall block 随机数，这样可以尽可能的避免干扰。具体计算 `recall_hash` 的过程如下：

1. 找到当前的 BTC tip block hash 记为 `random_hash`
2. 计算出 recall block number (`DA tip number - random_hash % N_BLOCKS - 1`, `N_BLOCKS` 为 DA 链需要保存的 blocks 数)
3. 找到 recall block 的完整数据计算 recall_hash (`hash(header{recall_hash=0,nonce=0} | random_hash | recall block)`)
4. 将结果填入 `header.recall_hash`

对 Miner 来说，最优策略是存储 `N_BLOCKS` 范围内的历史块，这样可以最快的生成下一个 DA header。如果 Miner 不存储数据，而是从网络中获取 recall block, 则需要承担无法在出块前取到 `recall block` 的风险。

UTXO Stack DA layer 仅会保存过去一段时间的数据，因此存储成本是恒定的，我们认为对于 Miner 来说最佳策略仍是本地保存历史块。

## Network protocol

DA layer 的数据通过 P2P 网络传输。完整的 Block 在 P2P 网络的传播时间对于 Miner 至关重要，随着 Block 传输时间的延长，出现叔块的概率会逐渐增加，Miner 的出块如果被其他 Block 取代则会损失出块奖励。

我们在网络层应用一些优化协议。

[BIP-152 Compacted block](https://github.com/bitcoin/bips/blob/master/bip-0152.mediawiki)

Compacted block 是 Bitcoin relay 协议的一种优化策略，Bitcoin 节点会持续的同步内存池，在 Miner 出块时，实际上大部分的 Block 内容都已经在网络中同步，Miner 仅需传输与完整 block 相比非常小的 Compacted block 数据, Compacted block 包括 header, short ids (缩短后的交易 id) 等，其他节点在获取 Compacted block 后可以根据信息重建完整的 Block 或者去 P2P 网络中请求本地没有的部分交易。

[Bittorrent tit-for-tat algorithm](https://en.wikipedia.org/wiki/Tit_for_tat#cite_note-10)

DA node 持续对 Gossip 协议的 Peers 评分，评分基于 Gossip 消息的有效性，以及消息传输效率。节点在广播消息时节点会优先对高分的 Peers 传输数据。

## Transaction fee

TODO
