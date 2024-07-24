---
sidebar_position: 6
---

# Bridgeless leap

UTXO Stack enables seamless cross-chain interoperability between RGB++ layer and branch chains, leveraging an isomorphic architecture. This innovative approach eliminates the need for traditional cross-chain bridges, which are often centralized points of failure. By doing so, it improves the efficiency of asset transfer, allowing tokens to move across branch chains without the need for extended locking periods.

## Branch chain token manager

The Branch Chain Token Manager, referred to as the token manager, is a system contract embedded within every branch chain. It functions as the issuer of branch chain tokens. When assets are transferred from RGB++ layer to a branch chain, the original assets are locked on RGB++ layer, and the token manager issues a wrapped token on the branch chain. Conversely, when assets move from a branch chain back to RGB++ layer, the wrapped tokens are burned on the branch chain, and the original assets on RGB++ layer are unlocked.

The underlying mechanism of the token manager is implemented via a cross-chain message queue. This queue is deployed on both RGB++ layer (as an application contract) and each branch chain (as a system contract), allowing the token manager system contract to access and send cross-chain messages through the queue.

### xUDT

Assets on the branch chain are represented by [xUDT][xUDT] tokens, with the token manager contract acting as the issuer.

## Cross chain message queue

On RGB++ layer:
The cross-chain message queue is implemented as user contracts. This contract includes a branch chain light client, which tracks the branch chain's state, and a queue contract that maintains messages related to the branch chain.

On Branch Chains:
The message queue is implemented as a system contract. This setup allows branch validators to read messages from RGB++ and submit cross-chain messages to the system contract. Branch chain users can also send messages to the system contract, and validators act as relayers by submitting these messages to RGB++ layer.

### Request cell

Due to the nature of CKB cell model, every transaction consumes input cells and generates new output cells. If we naively use a cell to implement a queue, consuming and regenerating the queue cell each time a user pushes a message would prevent simultaneous message interactions. To address this, we introduce the concept of the request cell.

When a user wants to interact with a message queue, they create a request cell instead of directly writing into the queue cell. This is achieved by replacing the lock field of their own cell:

Batch Request Lock Fields

- **cancel_timeout**: Specifies the number of blocks after which the request can be canceled.
- **owner_lock_hash**: Allows the request to be canceled with this lock hash.
- **request**: Serialized byte structure containing the request details.

By creating a request cell, users permit aggregators to collect and batch these requests. This approach allows multiple users to interact with the message queue simultaneously and efficiently.

### RGB++ message queue

The RGB++ side of the message queue is structured as follows:

``` rust
pub struct CKBMessageQueue {
  // The merkle tree root of locked assets
  locked_assets: Byte32,
  // Send queue
  outbox: Vec<CKBMessage>,
  // Receive queue
  inbox: Vec<BranchMessage>,
}
```

Key operations include:

* PushRequest: Submit cross chain transfer message.
* Ack: Confirm messages have been processed by providing branch chain block headers and proofs.
* HandleRecv: Handle the receive queue.

### Branch message queue

The branch chain side of the message queue is structured as follows:

``` rust
pub struct BranchMessageQueue {
  // The merkle tree root of locked assets
  locked_assets: Byte32,
  // Send queue
  outbox: Vec<Bytes(BranchMessage)>,
  // Receive queue
  inbox: Vec<CKBMessage>,
}
```

Key operations include:

* PushRequest: Submit cross chain transfer message.
* HandleRecv: Handle the receive queue.


### Messages

``` rust
/// CKB messages
pub enum CKBMessage {
  Branch(CKBToBranchRequest)
}

pub struct CKBToBranchRequest {
  request_id: Bytes,
  // Target chain ID
  target_chain_id: ChainId,
  message: Message,
}

// Branch chain messages
pub enum BranchMessage {
  CKB(BranchToCKBRequest)
  Branch(BranchToBranchRequest)
}

pub struct BranchToCKBRequest {
  request_id: Bytes,
  // Initial chain ID
  initial_chain_id: ChainId,
  message: Message,
}

pub struct BranchToBranchRequest {
  request_id: Bytes,
  // Initial chain ID
  initial_chain_id: ChainId,
  // Target chain ID
  target_chain_id: ChainId,
  message: Message,
}


pub struct Message {
  owner_lock_hash: Byte32,
  amount: u128,
  // Asset type
  asset_type: Byte32,
}
```

## Leap

We use UTXO token as an example to describe the life cycle of cross chain assets.

### RGB++ layer to Branch chain

| Step | CKB | Branch | CKB Message Queue | Branch Message Queue | Description |
|------|-----|--------|-----------|-------------|-------------|
| 1 | UTXO token cell(lock=user, type=UTXO token) | - | - | - | User's assets on CKB |
| 2 | Request cell(lock=request_lock, type=UTXO token) | - | - | - | Initiates cross-chain transfer request on CKB |
| 3 | Custodian cell(lock=custodian_lock, type = UTXO token) | - | outbox: CKBToBranchMessage | - | Lock assets on CKB, enqueue CKBToBranchMesasge |
| 4 | - | - | outbox: CKBToBranchMessage | inbox: CKBToBranchMessage | submit message to Branch |
| 5 | - | Wrapped UTXO token cell(lock=user, type = WUTXO token) | outbox: CKBToBranchMessage | - | Mints assets on Branch |
| 6 | - | - | - | - | Acknowledges and remove processed request from CKB outbox |

### Branch chain to RGB++ layer

| Step | CKB | Branch | CKB Message Queue | Branch Message Queue | Description |
|------|-----|--------|-----------|-------------|-------------|
| 1 | - | wrapped UTXO token cell(lock=user, type=WUTXO token) | - | - | User's assets on Branch |
| 2 | - | Request cell(lock=request_lock, type=WUTXO token) | - | - | Initiates cross-chain transfer request on Branch |
| 3 | - | - | - | outbox: BranchToCKBMessage | Burn assets on Branch, enqueue BranchToCKBMessage |
| 4 | - | - | - | - | Commit outbox messages to Branch chain block header |
| 5 | - | - | inbox: BranchToCKBMessage | - | Wait challenge period, then submit message to CKB inbox |
| 6 | UTXO token cell(lock=user, type = UTXO token) | - | - | - | unlock UTXO token from custodian |

### Branch chain to Branch chain

| Step | CKB | Branch A | Branch B | Branch A Message Queue | Branch B Message Queue | Description |
|------|-----| -------- | -------- | ---------------------- | ---------------------- | ----------- | 
| 1 | - | wrapped UTXO token cell(lock=user, type=WUTXO token) | - | - | - | User's assets on Branch A |
| 2 | - | Request cell(lock=request_lock, type=WUTXO token) | - | - | - | Initiates cross-chain transfer request on Branch A |
| 3 | - | - | - | outbox: BranchToBranchMessage | - | Burn assets on Branch A, enqueue BranchToBranchMessage |
| 4 | - | - | - | - | - | Commit outbox messages to Branch A block header |
| 5 | Custodian Transfer Cell(lock=custodian_transfer_lock, type=WUTXO token) | - | - | - | - | Branch A validarors unlock custodian, initiates custodian transfer on CKB |
| 6 | Custodian Receipt Cell(lock=custodian_receipt_lock, type=WUTXO token) | - | - | - | - | Branch B validators accept custodian transfer, and init receipt cell |
| 7 | - | - | wrapped UTXO token cell(lock=user, type=WUTXO token) | - | inbox: BranchToBranchMessage | Once Branch B create receipt cell, the assets is minted |
| 8| Custodian cell(lock=custodian_lock,type=WUTXO token) | - | - | - | - | After challenge period, Branch B validators move assets from receipt cell to branch B custodian cell |

## Conclusion

By enabling seamless cross-chain interoperability, UTXO Stack empowers developers to build applications that can leverage the strengths of different UTXO blockchain networks. This opens up new possibilities for asset exchange, cross-chain lending, and other decentralized finance (DeFi) applications built on top of Bitcoin's robust security and decentralization.

[xUDT]: https://github.com/nervosnetwork/rfcs/blob/53b2c5eb7dd82968327999534be74d7975865b9d/rfcs/0052-extensible-udt/0052-extensible-udt.md
