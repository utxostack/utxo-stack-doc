---
sidebar_position: 6
---

# Security

我们来 Review UTXO Stack 系统中的组件并分析安全性

* RGB++
* Challenger
* App chain
* DA layer

UTXO Stack 资产可以通过 CSV proof 验证并铸造。因此 App chain 即使被攻击也不会直接影响资产安全，仅会影响 App chain 本身的可用性。对安全性要求较高的用户可以选择使用支持本地保存 CSV proof 的钱包，在这种情况下即使 App chain 及 DA layer 无法工作用户仍然可以从 RGB++ 层通过挑战机制取回资产。

因此 RGB++ 以及挑战机制仍然工作，UTXO Stack 资产就是安全的。系统的安全性取决于 RGB++ 的安全性。

为了论述 RGB++ 安全性，我们引入 Bitcoin 级安全性的概念，如果一个组件采用 POW 算力且和 Bitcoin 网络算力相当，我们就认为组件具有 Bitcoin 级安全性。

## RGB++

RGB++ 在 UTXO Stack 中作为 Consensus 合约层执行 App chain 选举，Challenge 以及轻节点。RGB++ 的安全性决定了 UTXO Stack 的安全性。

RGB++ 本身具有 client side verification 特性，RGB++ 交易可以脱离区块链验证，也可以在不同的区块链上做相同的验证。因此我们需要把 RGB++ 绑定到具有 Bitcoin 同等级别安全性的环境中。

### POW 同等算力

POW 同等算力的思路是我们把 RGB++ 部署到一条 POW 区块链上，部署链有能力完整的实现 RGB++ 验证，因此我们只需要能证明部署链的安全性可以换算为 Bitcoin 级别安全性就可以证明 RGB++ 是 Bitcoin 级别安全性。

假设 Bitcoin 6 个确认块后数据可以被认为是安全的。我们可以计算出想要推翻 6 个 Bitcoin 确认块需要的算力以及资金。
通过同样的方式对部署链的 POW 算法反向计算可以得出 X 个部署链确认块可以达到同样的算力和资金成本。因此我们能认为在部署链上确认 X 个块时可以达到和 Bitcoin 6 个确认块相同的安全性。我们可以把 X 作为使用 RGB++ 计算时的确认时间。

## Challenger

UTXO Stack 采用基于挑战的安全假设，在 Challenge period 内，一定会有 Challenger 找出坏块并发起挑战。这个假设和 Rollup 以及 Lightning network 类似，因此我们认为 UTXO stack 的挑战机制安全性至少和 Rollup 与 Lightning network 的挑战机制相当。

因为 RGB++ 支持 CSV proof, UTXO stack challenger 可以使用轻节点协议以低成本的方式运行。

我们可以考虑引入 watch tower 等额外的激励措施进一步增加节点中 challenger 数量。

## DA layer

DA layer 并不直接决定 UTXO Stack 整体的安全性，但是通过引入 DA layer 我们可以提高攻击成本。攻击者必须同时控制 App chain 以及 DA layer 才可以进行 DA 攻击。因此引入 DA layer 有利于保护 TVL 较少的 App chain。

## Conclusion

我们描述了 UTXO stack 中和安全性相关的几个组件，App chain 以及 DA layer 被攻击会影响可用性，但不会实际影响用户资产，RGB++ 可以通过 POW 换算的方式达到 Bitcoin 级别的安全性，而 Challenger 以及引入的挑战假设理论上安全性和 Rollup, Lightning network 相当。

综上所述，我们认为一个部署良好的 UTXO Stack 环境可以达到接近于 Bitcoin 级的安全性，其安全性至少与基于挑战的 Rollup 以及 Lightning network 系统相等。
