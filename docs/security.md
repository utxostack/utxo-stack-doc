---
sidebar_position: 6
---

# Security

我们来 Review UTXO Stack 系统中的组件并分析安全性

* RGB++
* DA layer
* App chain
* Challenger

UTXO Stack 资产可以通过 CSV proof 验证并铸造。因此 App chain 即使被攻击也不会直接影响资产安全，仅会影响 App chain 本身的可用性，只要挑战机制仍然工作，UTXO Stack 资产就是安全的。

因此系统安全性取决于 RGB++, DA layer 以及 Challenger 三个组件。

我们引入 Bitcoin 级安全性的概念，如果一个组件采用 POW 算力且和 Bitcoin 网络算力相当，我们就认为组件具有 Bitcoin 级安全性。

## RGB++

RGB++ 在 UTXO Stack 中作为 Consensus 合约层执行 App chain 选举，Challenge 以及轻节点。RGB++ 的安全性必须达到 Bitcoin 同等级别才可以保证 UTXO Stack 的安全性。

RGB++ 本身具有 client side verification 特性，RGB++ 交易可以脱离区块链验证，也可以在不同的区块链上做相同的验证。因此我们需要把 RGB++ 绑定到具有 Bitcoin 同等级别安全性的环境中。

### POW 同等算力

POW 同等算力的思路是我们把 RGB++ 部署到一条 POW 区块链上，部署链有能力完整的实现 RGB++ 验证，因此我们只需要能证明部署链的安全性可以换算为 Bitcoin 级别安全性就可以证明 RGB++ 是 Bitcoin 级别安全性。

假设 Bitcoin 6 个确认块后数据可以被认为是安全的。我们可以计算出想要推翻 6 个 Bitcoin 确认块需要的算力以及资金。
通过同样的方式对部署链的 POW 算法反向计算可以得出 X 个部署链确认块可以达到同样的算力和资金成本。因此我们能认为在部署链上确认 X 个块时可以达到和 Bitcoin 6 个确认块相同的安全性。我们可以把 X 作为使用 RGB++ 计算时的确认时间。

### Bitcoin merge mining

另一个证明思路是直接让 RGB++ 使用 Bitcoin merge mining。

我们为 RGB++ 创造一条 Bitcoin merge mining 链，当 RGB++ mining 协议被大部分算力接受时，我们可以认为 RGB++ 有 Bitcoin 级别安全性。

## DA layer

DA layer 负责解决 UTXO Stack 中的 DA 问题，Challenge 机制以及 client side verification 依赖于 DA layer 才可以正常工作。因此 DA layer 安全性必须达到 Bitcoin 同等级才可以保证 UTXO Stack 整体安全性。

DA layer 采用 Bitcoin merge mining 的方式保证安全性。在大部分 Bitcoin 算力接受 DA layer merge mininig 时，我们可以认为 DA layer 具有 Bitcoin 级别安全性。

## Challenger

UTXO Stack 采用基于挑战的安全假设，在 Challenge period 内，一定会有 Challenger 找出坏块并发起挑战。这个假设和 Rollup 以及 Lightning network 类似，因此我们认为 UTXO stack 的挑战机制安全性至少和 Rollup 与 Lightning network 的挑战机制相当。

因为 RGB++ 支持 CSV proof, UTXO stack challenger 可以使用轻节点协议以低成本的方式运行。

我们可以考虑引入 watch tower 等额外的激励措施进一步增加节点中 challenger 数量。

## Conclusion

我们描述了 UTXO stack 中和安全性相关的几个组件，App chain 被攻击会影响本身的可用性，但不会实际影响用户资产，RGB++ 以及 DA layer 可以通过 POW 换算以及 Bitcoin merge mining 的方式达到 Bitcoin 级别的安全性，而 Challenger 以及引入的挑战假设理论上安全性和 Rollup, Lightning network 相当。

综上所述，我们认为一个部署良好的 UTXO Stack 环境可以达到接近于 Bitcoin 级的安全性，其安全性至少与基于挑战的 Rollup 以及 Lightning network 系统相等。
