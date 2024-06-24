---
sidebar_position: 3
---

# App Chain

App chain 是实际运行智能合约的 layer-2 chain。特点是高 TPS，低手续费，较少的出块节点，以及基于挑战的安全模型。

## 质押选举

App chain 由多个 Validators 采用 PBFT 类共识出块，多方共同出块可以缓解节点的审查攻击以及共谋做恶情况。

我们同时引入了 POW chain 作为共识的一部分，每一条 App chain 都需要在 RGB++ 上部署选举合约，App chain 当前的 validators 由选举合约确定。通过引入 POW chain 我们可以避免 POS 系统中的 long range attack 以及审查攻击等问题。

节点的 Operator 可以通过 Staking 资产，并提交到 RGB++ 上的选举合约来参加选举。
普通的用户也可以通过将 Staking 资产投票给 Operator 来帮助选举并获取一定的收益。

每一个 App chain epoch 都会进行选举，选举完成后由新获选的 validators 在 epoch 内出块。

## UTXO 同构

### Cell 模型

App chain 采用 UTXO 扩展的 Cell 模型，与 RGB++ 同构。

App chain, RGB++, Bitcoin 都采用 UTXO 类结构，我们利用 Single used seal，client side verification 等 UTXO 特有技术在保证安全性的情况下完成资产的跨链。
### 图灵完备的 VM

App chain 采用与 RGB++ 同样的基于RISC-V、图灵完备的虚拟机（VM），这使得它能够执行任意复杂逻辑，且兼容 RGB++ 的智能合约。

兼容 RGB++ 开发工具链，理论上任何提供了 RISC-V 后端的语言均可用来开发 App chain 合约。

## 挑战模型

App chain 的安全性基于挑战模式。

我们假设如果产出了一个非法块，在 Challenge period 时间内 Challenger 一定可以发现该坏块并提交挑战证明到 RGB++ 合约。

为了实现挑战机制，我们必须保证：

1. Challenger 一定可以在挑战周期内获取 validators 产出的 block 的完整数据
2. RGB++ 合约需要能够验证 App chain 交易

### DA 问题

我们引入 DA layer 来解决 DA 问题。

RGB++ 上会维护一个 App chain 轻节点合约。这个合约会记录所有的 App chain headers。

App chain 出块后，validator 必须把完整 block 提交到 DA layer 并获取 DA proof，然后把 block header 以及 DA proof 提交到 RGB++ 轻节点合约更新状态。

当 App chain header 完成上述提交时我们才认为 App chain 出块被确认了，如果 validator 长期不更新轻节点合约，选举合约会罚没 validator 的 staking 并重新选举。

提交 header 时，DA layer 验证合约会检查 DA proof 并确保完整的 block 在 DA layer 存储时间不小于 Challenge Period。

Challenger 在需要时可以 DA layer 提取完整 block 并生成挑战证明。

### Transaction 验证

App chain 和 RGB++ 都使用结构一致的 cell 模型。

因此只要提供 App chain tx 依赖的所有数据(cells 或者 block headers), App chain tx 是可以在 RGB++ 上验证的。
我们可以利用 `ckb_spawn` 和 `ckb_exec` syscalls 构造一个安全的验证环境。

## 资产跨链

我们使用 XUDT 代表资产，资产合约部署在 RGB++ 上，所有的 App chain 资产 Cell 都引用同样的 XUDT 合约。
因此一个 XUDT cell 在 RGB++ 以及所有 App chain 上是等价的。

资产跨链转移时实际是将 cell 转移，同时完成 XUDT 资产的转移。

我们借助 Single used seal 的概念来完成跨链资产转移。

扩展 XUDT 协议，支持两个新操作:

`CSVBurn(X, src_chain_id, dst_chain_id, out_point)`

合约验证本次交易一定至少有 X amount token 被销毁了，src_chain_id 是当前所在的 chain 的 id，dst_chain_id 和 out_point 指定另一条链上的某个 out_point。


`CSVMint(X, burn_tx)`

合约验证 burn_tx 在 src_chain_id 上存在并且被确认(通过 App chain 轻节点验证)。
合约验证 burn_tx.dst_chain_id 必须是当前链，并且当前交易 inputs 中必须包含 `CSVBurn` 中指定的 out_point, 本次交易允许 mint X amount token。

如上，通过利用 Single used seal 的概念，我们支持了去中心化的 app chain 之间以及 app chain 与 RGB++ 的跨链操作。

RGB++ 协议与 Bitcoin 的跨链操作详见 RGB++ 协议文档。

## 涉及的 RGB++ 合约

* App chain 选举合约
* App chain 轻节点合约
* DA layer 验证合约
* 扩展的 XUDT 合约

## 定制 App chain

App chain 可配置跨链资产作为手续费币种。例如对于 Bitcoin 扩容场景，使用 BTC 资产作为交易手续费币种，能带来更一致的用户体验。
