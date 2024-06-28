---
sidebar_position: 10
sidebar_label: Staking
---

# Staking and Restaking

## Collaterals

系统支持使用 $CKB, $UTXO 等资产作为质押押金（下面以 $Collateral 代替），当被质押服务出现风险时，系统会罚没或清算押金来确保安全。

## Modular Staking

<img src="../static/img/stake.png" width="60%" />

## uBTC Peg Module

该模块提供 btc 跨链安全，它是基于去信任的安全。质押在这个模块的 $Collateral 在 Peg 节点被攻击或联合作恶时，他们的押金会被清算用来偿还 uBTC。质押在这里的资产可以获得 $CollateralB 质押凭证。

## DA Module

该模块提供 DA 安全，用来为 Chellanger 提供足够的数据监控 UTXO L2 Sequencer 是否诚实工作。DA Layer 仅接收 $CollateralB 和 $uBTC 作为安全预算，并生成 $CollateralD/$uBTCD 作为质押凭证。

值得注意的是，即使 DA Layer 拒绝提供数据，用户仍然可以利用自己手里的 CSV 历史数据进行强制退出，确保资产安全。

## UTXO L2 Module

该模块提供 L2 出块安全，$CollateralD/$uBTCD 的持有人为 L2 提供安全预算。一旦 L2 Sequencer 作恶，他们质押押金会被罚没。

## 再质押安全性

由于 UTXO L2 默认使用 uBTC 作为网络费用，整个系统的底层安全性依赖 uBTC 的安全性。因此我们设计所有的质押资产都需要首先成为 uBTC 的价值支撑。其他再质押模块的风险不会传导到 uBTC Peg 层。