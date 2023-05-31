// https://github.com/Uniswap/docs/tree/main/docs/concepts

export const uniswapString1 = `
   Automated Market Maker
  An automated market maker is a smart contract on Ethereum that holds liquidity reserves. Users can trade against these reserves at prices determined by a fixed formula. Anyone may contribute liquidity to these smart contracts, earning pro-rata trading fees in return.
  
  Asset
  While a digital asset can take many forms, the Uniswap Protocol supports ERC-20 token pairs, and represents a position in the form of an NFT (ERC-721).
  
  Concentrated Liquidity
  Liquidity that is allocated within a determined price range.
  
  Constant Product Formula
  The automated market making algorithm used by Uniswap. In v1 and v2, this was x*y=k.
  
  Core
  Smart contracts that are considered foundational, and are essential for Uniswap to exist. Upgrading to a new version of core would require deploying an entirely new set of smart contracts on Ethereum and would be considered a new version of the Uniswap Protocol.
  
  ERC20
  ERC20 tokens are fungible tokens on Ethereum. Uniswap supports all standard ERC20 implementations.
  
  Factory
  A smart contract that deploys a unique smart contract for any ERC20/ERC20 trading pair.
  
  Flash Swap
  A trade that uses the tokens purchased before paying for them.
  
  Invariant
  The “k” value in the constant product formula X*Y=K
  
  Liquidity Provider / "LP"
  A liquidity provider is someone who deposits ERC20 tokens into a given liquidity pool. Liquidity providers take on price risk and are compensated with trading fees.
  
  Liquidity
  Digital assets that are stored in a Uniswap pool contract, and are able to be traded against by traders.
  
  Mid Price
  The price between the available buy and sell prices. In Uniswap V1 and V2, this is the ratio of the two ERC20 token reserves. In V3, this is the ratio of the two ERC20 token reserves available within the current active tick.
  
  Observation
  An instance of historical price and liquidity data of a given pair.
  
  Pair
  A smart contract deployed from a Uniswap V1 or V2 factory contract that enables trading between two ERC20 tokens. Pair contracts are now called Pools in V3.
  
  Periphery
  External smart contracts that are useful, but not required for Uniswap to exist. New periphery contracts can always be deployed without migrating liquidity.
  
  Pool
  A contract deployed by the V3 factory that pairs two ERC-20 assets. Different pools may have different fees despite containing the same token pair. Pools were previously called Pairs before the introduction of multiple fee options.
  
  Position
  An instance of liquidity defined by upper and lower tick. And the amount of liquidity contained therein.
  
  Price Impact
  The difference between the mid-price and the execution price of a trade.
  
  Protocol Fees
  Fees that are rewarded to the protocol itself, rather than to liquidity providers.
  
  Range
  Any interval between two ticks of any distance.
  
  Range Order
  An approximation of a limit order, in which a single asset is provided as liquidity across a specified range, and is continuously swapped to the destination address as the spot price crosses the range.
  
  Reserves
  The liquidity available within a pair. This was more commonly referenced before concentrated liquidity was introduced.
  
  Slippage
  The amount the price moves in a trading pair between when a transaction is submitted and when it is executed.
  
  Spot Price
  The current price of a token relative to another within a given pair.
  
  Swap Fees
  The fees collected upon swapping which are rewarded to liquidity providers.
  
  Tick Interval
  The price space between two nearest ticks.
  
  Tick
  The boundaries between discrete areas in price space.

  Swaps
  Introduction
  
  Swaps are the most common way of interacting with the Uniswap protocol. For end-users, swapping is straightforward: a user selects an ERC-20 token that they own and a token they would like to trade it for. Executing a swap sells the currently owned tokens for the proportional1 amount of the tokens desired, minus the swap fee, which is awarded to liquidity providers2. Swapping with the Uniswap protocol is a permissionless process.
  
      note: Using web interfaces (websites) to swap via the Uniswap protocol can introduce additional permission structures, and may result in different execution behavior compared to using the Uniswap protocol directly. To learn more about the differences between the protocol and a web interface, see What is Uniswap.
  
  Swaps using the Uniswap protocol are different from traditional order book trades in that they are not executed against discrete orders on a first-in-first-out basis — rather, swaps execute against a passive pool of liquidity, with liquidity providers earning fees proportional to their capital committed
  Price Impact
  
  In a traditional order-book market, a sizeable market-buy order may deplete the available liquidity of a prior limit-sell and continue to execute against a subsequent limit-sell order at a higher price. The result is the final execution price of the order is somewhere in between the two limit-sell prices against which the order was filled.
  
  Price impact affects the execution price of a swap similarly but is a result of a different dynamic. When using an automated market maker, the relative value of one asset in terms of the other continuously shifts during the execution of a swap, leaving the final execution price somewhere between where the relative price started - and ended.
  
  This dynamic affects every swap using the Uniswap protocol, as it is an inextricable part of AMM design.
  
  As the amount of liquidity available at different price points can vary, the price impact for a given swap size will change relative to the amount of liquidity available at any given point in price space. The greater the liquidity available at a given price, the lower the price impact for a given swap size. The lesser the liquidity available, the higher the price impact.
  
  Approximate3 price impact is anticipated in real-time via the Uniswap interface, and warnings appear if unusually high price impact will occur during a swap. Anyone executing a swap will have the ability to assess the circumstances of price impact when needed.
  Slippage
  
  The other relevant detail to consider when approaching swaps with the Uniswap protocol is slippage. Slippage is the term we use to describe alterations to a given price that could occur while a submitted transaction is pending.
  
  When transactions are submitted to Ethereum, their order of execution is established by the amount of "gas" offered as a fee for executing each transaction. The higher the fee offered, the faster the transaction is executed. The transactions with a lower gas fee will remain pending for an indeterminate amount of time. During this time, the price environment in which the transaction will eventually be executed will change, as other swaps will be taking place.
  
  Slippage tolerances establish a margin of change acceptable to the user beyond price impact. As long as the execution price is within the slippage range, e.g., %1, the transaction will be executed. If the execution price ends up outside of the accepted slippage range, the transaction will fail, and the swap will not occur.
  
  A comparable situation in a traditional market would be a market-buy order executed after a delay. One can know the expected price of a market-buy order when submitted, but much can change in the time between submission and execution.
  Safety Checks
  
  Price impact and slippage can both change while a transaction is pending, which is why we have built numerous safety checks into the Uniswap protocol to protect end-users from drastic changes in the execution environment of their swap. Some of the most commonly encountered safety checks:
  
      Expired : A transaction error that occurs if a swap is pending longer than a predetermined deadline. The deadline is a point in time after which the swap will be canceled to protect against unusually long pending periods and the changes in price that typically accompany the passage of time.
  
      INSUFFICIENT_OUTPUT_AMOUNT : When a user submits a swap, the Uniswap interface will send an estimate of how much of the purchased token the user should expect to receive. If the anticipated output amount of a swap does not match the estimate within a certain margin of error (the slippage tolerance), the swap will be canceled. This attempts to protect the user from any drastic and unfavorable price changes while their transaction is pending.
  
      Proportional in this instance takes into account many factors, including the relative price of one token in terms of the other, slippage, price impact, and other factors related to the open and adversarial nature of Ethereum.↩
      For information about liquidity provision, see the liquidity user guide↩
      The Uniswap interface informs the user about the circumstances of their swap, but it is not guaranteed.↩
      
      Introduction

      The defining idea of Uniswap v3 is concentrated liquidity: liquidity that is allocated within a custom price range. In earlier versions, liquidity was distributed uniformly along the price curve between 0 and infinity.
      
      The previously uniform distribution allowed trading across the entire price interval (0, ∞) without any loss of liquidity. However, in many pools, the majority of the liquidity was never used.
      
      Consider stablecoin pairs, where the relative price of the two assets stays relatively constant. The liquidity outside the typical price range of a stablecoin pair is rarely touched. For example, the v2 DAI/USDC pair utilizes ~0.50% of the total available capital for trading between $0.99 and $1.01, the price range in which LPs would expect to see the most volume - and consequently earn the most fees.
      
      With v3, liquidity providers may concentrate their capital to smaller price intervals than (0, ∞). In a stablecoin/stablecoin pair, for example, an LP may choose to allocate capital solely to the 0.99 - 1.01 range. As a result, traders are offered deeper liquidity around the mid-price, and LPs earn more trading fees with their capital. We call liquidity concentrated to a finite interval a position. LPs may have many different positions per pool, creating individualized price curves that reflect the preferences of each LP.
      Active Liquidity
      
      As the price of an asset rises or falls, it may exit the price bounds that LPs have set in a position. When the price exits a position's interval, the position's liquidity is no longer active and no longer earns fees.
      
      As price moves in one direction, LPs gain more of the one asset as swappers demand the other, until their entire liquidity consists of only one asset. (In v2, we don't typically see this behavior because LPs rarely reach the upper or lower bound of the price of two assets, i.e., 0 and ∞). If the price ever reenters the interval, the liquidity becomes active again, and in-range LPs begin earning fees once more.
      
      Importantly, LPs are free to create as many positions as they see fit, each with its own price interval. Concentrated liquidity serves as a mechanism to let the market decide what a sensible distribution of liquidity is, as rational LPs are incentivize to concentrate their liquidity while ensuring that their liquidity remains active.
      Ticks
      
      To achieve concentrated liquidity, the once continuous spectrum of price space has been partitioned with ticks.
      
      Ticks are the boundaries between discrete areas in price space. Ticks are spaced such that an increase or decrease of 1 tick represents a 0.01% increase or decrease in price at any point in price space.
      
      Ticks function as boundaries for liquidity positions. When a position is created, the provider must choose the lower and upper tick that will represent their position's borders.
      
      As the spot price changes during swapping, the pool contract will continuously exchange the outbound asset for the inbound, progressively using all the liquidity available within the current tick interval1 until the next tick is reached. At this point, the contract switches to a new tick and activates any dormant liquidity within a position that has a boundary at the newly active tick.
      
      While each pool has the same number of underlying ticks, in practice only a portion of them are able to serve as active ticks. Due to the nature of the v3 smart contracts, tick spacing is directly correlated to the swap fee. Lower fee tiers allow closer potentially active ticks, and higher fees allow a relatively wider spacing of potential active ticks.
      
      While inactive ticks have no impact on transaction cost during swaps, crossing an active tick does increase the cost of the transaction in which it is crossed, as the tick crossing will activate the liquidity within any new positions using the given tick as a border.
      
      In areas where capital efficiency is paramount, such as stable coin pairs, narrower tick spacing increases the granularity of liquidity provisioning and will likely lower price impact when swapping - the result being significantly improved prices for stable coin swaps.
      
      For more information on fee levels and their correlation to tick spacing, see the whitepaper.

      Fees
Swap Fees

Swap fees are distributed pro-rata to all in-range1 liquidity at the time of the swap. If the spot price moves out of a position’s range, the given liquidity is no longer active and does not generate any fees. If the spot price reverses and reenters the position’s range, the position’s liquidity becomes active again and will generate fees.

Swap fees are not automatically reinvested as they were in previous versions of Uniswap. Instead, they are collected separately from the pool and must be manually redeemed when the owner wishes to collect their fees.
Pool Fees Tiers

Uniswap v3 introduces multiple pools for each token pair, each with a different swapping fee. Liquidity providers may initially create pools at three fee levels: 0.05%, 0.30%, and 1%. More fee levels may be added by UNI governance, e.g. the 0.01% fee level added by this governance proposal in November 2021, as executed here.

Breaking pairs into separate pools was previously untenable due to the issue of liquidity fragmentation. Any incentive alignments achieved by more fee optionality invariably resulted in a net loss to traders, due to lower pairwise liquidity and the resulting increase in price impact upon swapping.

The introduction of concentrated liquidity decouples total liquidity from price impact. With price impact concerns out of the way, breaking pairs into multiple pools becomes a feasible approach to improving the functionality of a pool for assets previously underserved by the 0.30% swap fee.
Finding The Right Pool Fee

We anticipate that certain types of assets will gravitate towards specific fee tiers, based on where the incentives for both swappers and liquidity providers come nearest to alignment.

We expect low volatility assets (stable coins) will likely congregate in the lowest fee tier, as the price risk for liquidity providers holding these assets is very low, and those swapping will be motivated to pursue an execution price closest to 1:1 as they can get.

Similarly, we anticipate more exotic assets, or those traded rarely, will naturally gravitate towards a higher fee - as liquidity providers will be motivated to offset the cost risk of holding these assets for the duration of their position.
Protocol Fees
Uniswap v3 has a protocol fee that can be turned on by UNI governance. Compared to v2, UNI governance has more flexibility in choosing the fraction of swap fees that go to the protocol. For details regarding the protocol fee, see the whitepaper.

Range Orders

Customizable liquidity positions, along with single-sided asset provisioning, allow for a new style of swapping with automated market makers: the range order.

In typical order book markets, anyone can easily set a limit order: to buy or sell an asset at a specific predetermined price, allowing the order to be filled at an indeterminate time in the future.

With Uniswap V3, one can approximate a limit order by providing a single asset as liquidity within a specific range. Like traditional limit orders, range orders may be set with the expectation they will execute at some point in the future, with the target asset available for withdrawal after the spot price has crossed the full range of the order.

Unlike some markets where limit orders may incur fees, the range order maker generates fees while the order is filled. This is due to the range order technically being a form of liquidity provisioning rather than a typical swap.
Possibilities of Range orders

The nature of AMM design makes some styles of limit orders possible, while others cannot be replicated. The following are four examples of range orders and their traditional counterparts; the first two are possible, the second two are not.

    One important distinction: range orders, unlike traditional limit orders, will be unfilled if the spot price crosses the given range and then reverses to recross in the opposite direction before the target asset is withdrawn. While you will be earning LP fees during this time, if the goal is to exit fully in the desired destination asset, you will need to keep an eye on the order and either manually remove your liquidity when the order has been filled or use a third party position manager service to withdraw on your behalf.
    The Aavenomics introduce a formalized path to the decentralization and autonomy of the Aave Protocol. Covering governance mechanisms and financial incentives, it aims to share a vision of alignment between various stakeholders within the Aave ecosystem, protocol functionality and the AAve token as a core securing element of the Aave Protocol.

    A blockchain is a public database that is updated and shared across many computers in a network.

"Block" refers to data and state being stored in consecutive groups known as "blocks". If you send ETH to someone else, the transaction data needs to be added to a block to be successful.

"Chain" refers to the fact that each block cryptographically references its parent. In other words, blocks get chained together. The data in a block cannot change without changing all subsequent blocks, which would require the consensus of the entire network.

Every computer in the network must agree upon each new block and the chain as a whole. These computers are known as "nodes". Nodes ensure everyone interacting with the blockchain has the same data. To accomplish this distributed agreement, blockchains need a consensus mechanism.

Ethereum uses a proof-of-stake-based consensus mechanism. Anyone who wants to add new blocks to the chain must stake ETH - the native currency in Ethereum - as collateral and run validator software. These "validators" can then be randomly selected to propose blocks that other validators check and add to the blockchain. There is a system of rewards and penalties that strongly incentivize participants to be honest and available online as much as possible.

If you would like to see how blockchain data is hashed and subsequently appended to the history of block references, be sure to check out this demo(opens in a new tab)↗ by Anders Brownworth and watch the accompanying video below.

Watch Anders explain hashes in blockchains:


Ethereum is a blockchain with a computer embedded in it. It is the foundation for building apps and organizations in a decentralized, permissionless, censorship-resistant way.

In the Ethereum universe, there is a single, canonical computer (called the Ethereum Virtual Machine, or EVM) whose state everyone on the Ethereum network agrees on. Everyone who participates in the Ethereum network (every Ethereum node) keeps a copy of the state of this computer. Additionally, any participant can broadcast a request for this computer to perform arbitrary computation. Whenever such a request is broadcast, other participants on the network verify, validate, and carry out ("execute") the computation. This execution causes a state change in the EVM, which is committed and propagated throughout the entire network.

Requests for computation are called transaction requests; the record of all transactions and the EVM's present state gets stored on the blockchain, which in turn is stored and agreed upon by all nodes.

Cryptographic mechanisms ensure that once transactions are verified as valid and added to the blockchain, they can't be tampered with later. The same mechanisms also ensure that all transactions are signed and executed with appropriate "permissions" (no one should be able to send digital assets from Alice's account, except for Alice herself).
    
Ether (ETH) is the native cryptocurrency of Ethereum. The purpose of ETH is to allow for a market for computation. Such a market provides an economic incentive for participants to verify and execute transaction requests and provide computational resources to the network.

Any participant who broadcasts a transaction request must also offer some amount of ETH to the network as a bounty. The network will award this bounty to whoever eventually does the work of verifying the transaction, executing it, committing it to the blockchain, and broadcasting it to the network.

The amount of ETH paid corresponds to the resources required to do the computation. These bounties also prevent malicious participants from intentionally clogging the network by requesting the execution of infinite computation or other resource-intensive scripts, as these participants must pay for computation resources.

ETH is also used to provide crypto-economic security to the network in three main ways: 1) it is used as a means to reward validators who propose blocks or call out dishonest behavior by other validators; 2) It is staked by validators, acting as collateral against dishonest behavior—if validators attempt to misbehave their ETH can be destroyed; 3) it is used to weigh 'votes' for newly proposed blocks, feeding into the fork-choice part of the consensus mechanism.
What are smart contracts?

In practice, participants don't write new code every time they want to request a computation on the EVM. Rather, application developers upload programs (reusable snippets of code) into EVM state, and users make requests to execute these code snippets with varying parameters. We call the programs uploaded to and executed by the network smart contracts.

At a very basic level, you can think of a smart contract like a sort of vending machine: a script that, when called with certain parameters, performs some actions or computation if certain conditions are satisfied. For example, a simple vendor smart contract could create and assign ownership of a digital asset if the caller sends ETH to a specific recipient.

Any developer can create a smart contract and make it public to the network, using the blockchain as its data layer, for a fee paid to the network. Any user can then call the smart contract to execute its code, again for a fee paid to the network.

Thus, with smart contracts, developers can build and deploy arbitrarily complex user-facing apps and services such as: marketplaces, financial instruments, games, etc.

A cryptocurrency is a medium of exchange secured by a blockchain-based ledger.

A medium of exchange is anything widely accepted as payment for goods and services, and a ledger is a data store that keeps track of transactions. Blockchain technology allows users to make transactions on the ledger without reliance upon a trusted third party to maintain the ledger.

The first cryptocurrency was Bitcoin, created by Satoshi Nakamoto. Since Bitcoin's release in 2009, people have made thousands of cryptocurrencies across many different blockchains.
Ether (ETH) is the cryptocurrency used for many things on the Ethereum network. Fundamentally, it is the only acceptable form of payment for transaction fees, and after The Merge, ether is required to validate and propose blocks on Mainnet. Ether is also used as a primary form of collateral in the DeFi lending markets, as a unit of account in NFT marketplaces, as payment earned for performing services or selling real-world goods, and more.

Ethereum allows developers to create decentralized applications (dapps), which all share a pool of computing power. This shared pool is finite, so Ethereum needs a mechanism to determine who gets to use it. Otherwise, a dapp could accidentally or maliciously consume all network resources, which would block others from accessing it.

The ether cryptocurrency supports a pricing mechanism for Ethereum's computing power. When users want to make a transaction, they must pay ether to have their transaction recognized on the blockchain. These usage costs are known as gas fees, and the gas fee depends on the amount of computing power required to execute the transaction and the network-wide demand for computing power at the time.

Therefore, even if a malicious dapp submitted an infinite loop, the transaction would eventually run out of ether and terminate, allowing the network to return to normal.

It is common(opens in a new tab)↗ to(opens in a new tab)↗ conflate(opens in a new tab)↗ Ethereum and ether — when people reference the "price of Ethereum," they are describing the price of ether.

Minting ether

Minting is the process in which new ether gets created on the Ethereum ledger. The underlying Ethereum protocol creates the new ether, and it is not possible for a user to create ether.

Ether is minted as a reward for each block proposed and at every epoch checkpoint for other validator activity related to reaching consensus. The total amount issued depends on the number of validators and how much ether they have staked. This total issuance is divided equally among validators in the ideal case that all validators are honest and online, but in reality, it varies based on validator performance. About 1/8 of the total issuance goes to the block proposer; the remainder is distributed across the other validators. Block proposers also receive tips from transaction fees and MEV-related income, but these come from recycled ether, not new issuance.
As well as creating ether through block rewards, ether can be destroyed through a process called 'burning'. When ether gets burned, it gets removed from circulation permanently.

Ether burn occurs in every transaction on Ethereum. When users pay for their transactions, a base gas fee, set by the network according to transactional demand, gets destroyed. This, coupled with variable block sizes and a maximum gas fee, simplifies transaction fee estimation on Ethereum. When network demand is high, blocks(opens in a new tab)↗ can burn more ether than they mint, effectively offsetting ether issuance.

Burning the base fee hinders a block producers ability to manipulate transactions. For example, if block producers received the base fee, they could include their own transactions for free and raise the base fee for everyone else. Alternatively, they could refund the base fee to some users off-chain, leading to a more opaque and complex transaction fee market.

Definition of a dapp

A dapp has its backend code running on a decentralized peer-to-peer network. Contrast this with an app where the backend code is running on centralized servers.

A dapp can have frontend code and user interfaces written in any language (just like an app) to make calls to its backend. Furthermore, its frontend can get hosted on decentralized storage such as IPFS(opens in a new tab)↗.

    Decentralized - dapps operate on Ethereum, an open public decentralized platform where no one person or group has control
    Deterministic - dapps perform the same function irrespective of the environment in which they get executed
    Turing complete - dapps can perform any action given the required resources
    Isolated - dapps are executed in a virtual environment known as Ethereum Virtual Machine so that if the smart contract has a bug, it won’t hamper the normal functioning of the blockchain network

    On smart contracts

    To introduce dapps, we need to introduce smart contracts – a dapp's backend for lack of a better term. For a detailed overview, head to our section on smart contracts.
    
    A smart contract is code that lives on the Ethereum blockchain and runs exactly as programmed. Once smart contracts are deployed on the network you can't change them. Dapps can be decentralized because they are controlled by the logic written into the contract, not an individual or company. This also means you need to design your contracts very carefully and test them thoroughly.
    
    Benefits of dapp development 

    Zero downtime – Once the smart contract is deployed on the blockchain, the network as a whole will always be able to serve clients looking to interact with the contract. Malicious actors, therefore, cannot launch denial-of-service attacks targeted towards individual dapps.
    Privacy – You don’t need to provide real-world identity to deploy or interact with a dapp.
    Resistance to censorship – No single entity on the network can block users from submitting transactions, deploying dapps, or reading data from the blockchain.
    Complete data integrity – Data stored on the blockchain is immutable and indisputable, thanks to cryptographic primitives. Malicious actors cannot forge transactions or other data that has already been made public.
    Trustless computation/verifiable behavior – Smart contracts can be analyzed and are guaranteed to execute in predictable ways, without the need to trust a central authority. This is not true in traditional models; for example, when we use online banking systems, we must trust that financial institutions will not misuse our financial data, tamper with records, or get hacked.

Drawbacks of dapp development
Maintenance – Dapps can be harder to maintain because the code and data published to the blockchain are harder to modify. It’s hard for developers to make updates to their dapps (or the underlying data stored by a dapp) once they are deployed, even if bugs or security risks are identified in an old version.
Performance overhead – There is a huge performance overhead, and scaling is really hard. To achieve the level of security, integrity, transparency, and reliability that Ethereum aspires to, every node runs and stores every transaction. On top of this, proof-of-stake consensus takes time as well.
Network congestion – When one dapp uses too many computational resources, the entire network gets backed up. Currently, the network can only process about 10-15 transactions per second; if transactions are being sent in faster than this, the pool of unconfirmed transactions can quickly balloon.
User experience – It may be harder to engineer user-friendly experiences because the average end-user might find it too difficult to set up a tool stack necessary to interact with the blockchain in a truly secure fashion.
Centralization – User-friendly and developer-friendly solutions built on top of the base layer of Ethereum might end up looking like centralized services anyways. For example, such services may store keys or other sensitive information server-side, serve a frontend using a centralized server, or run important business logic on a centralized server before writing to the blockchain. Centralization eliminates many (if not all) of the advantages of blockchain over the traditional model.

Web3 benefits

Many Web3 developers have chosen to build dapps because of Ethereum's inherent decentralization:

    Anyone who is on the network has permission to use the service – or in other words, permission isn't required.
    No one can block you or deny you access to the service.
    Payments are built in via the native token, ether (ETH).
    Ethereum is turing-complete, meaning you can program pretty much anything.

Practical comparisons
Web2	Web3
Twitter can censor any account or tweet	Web3 tweets would be uncensorable because control is decentralized
Payment service may decide to not allow payments for certain types of work	Web3 payment apps require no personal data and can't prevent payments
Servers for gig-economy apps could go down and affect worker income	Web3 servers can't go down – they use Ethereum, a decentralized network of 1000s of computers as their backend

This doesn't mean that all services need to be turned into a dapp. These examples are illustrative of the main differences between web2 and web3 services.
Web3 limitations

Web3 has some limitations right now:

    Scalability – transactions are slower on web3 because they're decentralized. Changes to state, like a payment, need to be processed by a node and propagated throughout the network.
    UX – interacting with web3 applications can require extra steps, software, and education. This can be a hurdle to adoption.
    Accessibility – the lack of integration in modern web browsers makes web3 less accessible to most users.
    Cost – most successful dapps put very small portions of their code on the blockchain as it's expensive.

Centralization vs decentralization

In the table below, we list some of the broad-strokes advantages and disadvantages of centralized and decentralized digital networks.
Centralized Systems	Decentralized Systems
Low network diameter (all participants are connected to a central authority); information propagates quickly, as propagation is handled by a central authority with lots of computational resources.	The furthest participants on the network may potentially be many edges away from each other. Information broadcast from one side of the network may take a long time to reach the other side.
Usually higher performance (higher throughput, fewer total computational resources expended) and easier to implement.	Usually lower performance (lower throughput, more total computational resources expended) and more complex to implement.
In the event of conflicting data, resolution is clear and easy: the ultimate source of truth is the central authority.	A protocol (often complex) is needed for dispute resolution, if peers make conflicting claims about the state of data which participants are meant to be synchronized on.
Single point of failure: malicious actors may be able to take down the network by targeting the central authority.	No single point of failure: network can still function even if a large proportion of participants are attacked/taken out.
Coordination among network participants is much easier, and is handled by a central authority. Central authority can compel network participants to adopt upgrades, protocol updates, etc., with very little friction.	Coordination is often difficult, as no single agent has the final say in network-level decisions, protocol upgrades, etc. In the worst case, network is prone to fracturing when there are disagreements about protocol changes.
Central authority can censor data, potentially cutting off parts of the network from interacting with the rest of the network.	Censorship is much harder, as information has many ways to propagate across the network.
Participation in the network is controlled by the central authority.	Anyone can participate in the network; there are no “gatekeepers.” Ideally, the cost of participation is very low.

Note that these are general patterns that may not hold true in every network. Furthermore, in reality the degree to which a network is centralized/decentralized lies on a spectrum; no network is entirely centralized or entirely decentralized.
Further reading.

Ethereum accounts have four fields:

    nonce – A counter that indicates the number of transactions sent from an externally-owned account or the number of contracts created by a contract account. Only one transaction with a given nonce can be executed for each account, protecting against replay attacks where signed transactions are repeatedly broadcast and re-executed.
    balance – The number of wei owned by this address. Wei is a denomination of ETH and there are 1e+18 wei per ETH.
    codeHash – This hash refers to the code of an account on the Ethereum virtual machine (EVM). Contract accounts have code fragments programmed in that can perform different operations. This EVM code gets executed if the account gets a message call. It cannot be changed, unlike the other account fields. All such code fragments are contained in the state database under their corresponding hashes for later retrieval. This hash value is known as a codeHash. For externally owned accounts, the codeHash field is the hash of an empty string.
    storageRoot – Sometimes known as a storage hash. A 256-bit hash of the root node of a Merkle Patricia trie that encodes the storage contents of the account (a mapping between 256-bit integer values), encoded into the trie as a mapping from the Keccak 256-bit hash of the 256-bit integer keys to the RLP-encoded 256-bit integer values. This trie encodes the hash of the storage contents of this account, and is empty by default.

    USD Coin (USDC) is a stablecoin that is pegged to the value of the US dollar. It was created in 2018 by Circle and Coinbase through a partnership called the CENTRE consortium. USDC is an ERC-20 token, which means it is built on the Ethereum blockchain and follows a set of standardized protocols. It allows users to send US dollars over the internet and on public blockchains, giving them greater accessibility and faster transfer speeds. In addition, USDC can be easily converted back to US dollars at any time.

    Circle is a Boston-based financial services company that was founded in 2013. It offers a variety of products and services, including a peer-to-peer payment platform, a cryptocurrency exchange, and a trading platform for institutional investors. In addition to creating USDC, Circle has also played a significant role in the development of the stablecoin market.
    
    Coinbase is a San Francisco-based cryptocurrency exchange that was founded in 2012. It is one of the largest and most well-known exchanges in the world, and it offers a range of products and services for both individual and institutional investors.
    
    USDC was developed to address two main issues with other cryptocurrencies: volatility and the difficulty of converting between fiat currencies and cryptocurrencies. To maintain stability and transparency, USDC is fully backed by US dollars held in reserve, and the CENTRE consortium publishes regular reports on the total supply of USDC and the amount of backing it has. In addition, members of the consortium must meet certain standards, including licensing, compliance, technology, and accounting, in order to issue USDC.
    Working

    Mint and Burn
    
    Businesses can open a Circle Account to trade US dollars for USDC. When a company deposits USD into their Circle Account, Circle credits the company with the corresponding amount of USDC. "Minting" is the process of creating a new USDC. This operation generates new USDC for circulation.
    
    Similarly, if a company wants to trade its USDC for US dollars, they can deposit USDC into their Circle Account and request to receive US dollars for free. "Burning" is the process of redeeming USDC. This procedure removes USDC from circulation.
    
    When US dollars are exchanged for USDC on a digital asset exchange, the exchange will normally supply the balance of USDC on hand to complete the trade. If the exchange needs additional USDC to complete the deal, it will frequently use its Circle Account to create extra USDC.
    Transparency
    
    Since its launch in 2018, Circle has published monthly reserve reports for USDC that are attested to by Grant Thornton, a global accounting firm. These reports provide independent confirmation that Circle holds at least as much in dollar-denominated reserves as the amount of USDC in circulation. In addition to the standard information provided in these reports, Circle also recently began publishing details about the CUSIPs, maturity dates, and market values of the T-bills in its portfolio, as well as the financial institutions that hold the cash portion of the USDC reserve and the weighted average maturity of the entire reserve. Starting in July 2022, Grant Thornton's attestations will cover all of this additional information, providing independent confirmation of the detailed composition and sufficiency of the USDC reserve. An attestation from an accounting firm is similar to an audit in that it provides assurance around specific statements or criteria. In this case, the firm reviews the supporting documentation prepared by Circle's management and verifies the criteria presented in the reserve report. Circle also files annual audited financial statements with the SEC that cover the USDC reserve. In order to prepare the reserve report, Circle must reconcile the differences between the real-time movement of USDC on the blockchain and the settlement delays and business hours of traditional financial institutions. These differences are accounted for in the attested reserve asset balances and do not impact the overall size of the reserve or the fact that USDC is always redeemable 1:1 for US dollars. Circle's commitment to providing transparent and timely reporting on its risk minimization and liquidity maintenance efforts helps to give the market confidence in USDC. It plans to continue enhancing its transparency as policy and regulatory requirements evolve and better reporting opportunities arise.
    Backing
    
    USDC is fully backed by the equivalent value of U.S. dollar-denominated assets and is held in the management and custody of leading U.S. financial institutions, including BlackRock and Bank of New York Mellon. The USDC reserve consists of cash and short-dated U.S. government obligations, specifically U.S. Treasuries with maturities of three months or less. As of May 13, 2022, the USDC reserve was worth $50.6 billion and consisted of $11.6 billion in cash (22.9%) and $39.0 billion in U.S. Treasuries (77.1%). As of Jan 5, 2023 the total USDC in circulation is $44 B. The total circulating supply is also equal to $44 billion.
    
    USDC is always redeemable 1:1 for U.S. dollars. Customers of Circle can mint or redeem USDC in exchange for U.S. dollars through their Circle account, with the exchange happening nearly instantly subject to the settlement of funds. Individual retail users can also exchange USDC for U.S. dollars globally through leading digital asset exchanges such as Binance and Coinbase. As of May 13, 2022, Circle had minted 99.3 billion USDC and redeemed 61.1 billion USDC during the year. There are thousands of projects and exchanges supporting USDC in over 190 countries, facilitating its use and exchange for market participants. On Jan 5, 2023, the 24-hour trading volume of USDC was $ 4 billion.

    What is Asset Tokenization?

A token is a digital unit of cryptocurrency that is either used as a specific asset or it represents a particular use on the blockchain. Tokens can have multiple use cases but the most common ones are as security, utility or governance tokens.

Asset tokenization refers to the process of creating a digital token that represents a physical or digital asset, such as real estate, artwork, or even company shares, on a blockchain network.

This token can then be bought, sold, and traded like any other cryptocurrency, and can also enable fractional ownership of assets, making it more accessible to a wider range of investors. Tokenization can also enable smart contract functionality, which can automate the process of buying and selling assets and can also provide a tamper-proof and transparent record of ownership.
Issues

    Public and Private Markets
        https://securitize.io/learn/three-things-investors-should-know-about-private-equity
        https://securitize.io/learn/differences-between-public-markets-and-private-markets
    Liquidity
    Ownership Cost
    Settlement Time -

Use Cases of Tokenization

There are many examples of tokenized assets, some of which include:

    Real estate: Tokenization allows for the creation of digital tokens that represent ownership of a physical property, enabling fractional ownership and more efficient trading of real estate.

    Art: Tokenization can be used to represent ownership of fine art, making it more accessible to a wider range of investors and collectors.

    Stocks: Tokenization can be used to represent ownership of company shares, enabling more efficient and secure trading of stocks.

    Commodities: Tokenization can be used to represent ownership of commodities such as gold, oil, and other precious metals, enabling more efficient trading and storage.

    Collectibles: Tokenization can be used to represent ownership of collectible items such as sports cards, comic books, and other rare items, making it more accessible to a wider range of collectors.

    Music rights: Tokenization can be used to represent ownership of music rights, making it more efficient for creators and investors to manage and monetize music.

    Luxury goods: Tokenization can be used to represent ownership of luxury goods such as designer clothes, watches and handbags, making it more accessible for investors and collectors.

These are just a few examples and the possibilities are endless, as any asset can be tokenized.


About Compound

Introduction

Compound is one of the first DeFi platforms in the DeFi space. Like other DeFi lending and borrowing platforms, users in Compound can Lend asserts to earn interest and can also borrow by having a over collateralized position.

Compound recently released their version three of the protocol, also Called "Compound III". and it is quite different from V2. Compound III prioritized safely and isolation of the assets above everything. In V3 when you supply collateral, it remains your property. It can never be withdrawn by other users (except during liquidation).

In the new version of the protocol, there is a separate market for each token. That token acts as the "base token" in that market. A supplier can lend the base token in the market and can earn interest. When a borrower wants to borrow that base token from the market, he can deposit one or more of the other tokens listed in the market as collateral. No interest will be accrued by these assets that are supplied as collateral and cTokens are no longer used.

The major concepts to understand in Compound III are,
Utilization and Interest Rates

The interest rates for supply and borrowing are based on the utilization rate of the base asset. There is a point beyond which the interest rate starts to increase more rapidly, called the "kink." Interest accrues every second, using the block timestamp. Collateral assets do not earn or pay interest.

This function returns the current protocol utilization of the base asset. The formula for producing the utilization is:

Utilization = TotalBorrows / TotalSupply

function getUtilization() public view returns (uint)

// RETURNS: The current protocol utilization percentage as a decimal, represented by an unsigned integer, scaled up by 10 ^ 18. E.g. 1e17 or 100000000000000000 is 10% utilization.

Supply

The supply function allows users to add assets to the protocol in order to increase their borrowing capacity. This function can be used to add collateral, supply the base asset, or repay an open borrow of the base asset. Collateral can only be added if the market is below its supplyCap.

Compound III enables users to earn interest on their positive balances of the base asset, based on separate interest rate models that are set by governance.

To calculate the Compound III supply APR as a percentage, divide the current utilization by 10 ^ 18 and multiply by the approximate number of seconds in one year, then scale up by 100.

function getSupplyRate(uint utilization) public view returns (uint64)

//  utilization: The utilization at which to calculate the rate.
//  RETURNS: The per second supply rate as the decimal representation of a percentage scaled up by 10 ^ 18. E.g. 317100000 indicates, roughly, a 1% APR.

Withdraw (borrow)

The withdraw method is used to take out collateral that isn't being used to support an open borrow. The base asset can be borrowed using the withdraw function. The resulting balance must meet the borrowing collateral factor requirements. The collateral assets that a user adds to their account using the supply function increases their borrowing capacity. The percentage of the collateral value that can be borrowed is represented by the borrowing collateral factor. If an account fails to meet the required borrow collateral factor, the user cannot borrow any additional assets until they supply more collateral or reduce their borrow balance using the supply function.

Comet comet = Comet(0xCometAddress);
comet.withdraw(0xwbtcAddress, 100000000);

Liquidation

When an account’s borrow balance exceeds the set liquidation collateral limit (which is separate and higher than borrow collateral factor), the account is then eligible for liquidation. The latest version of the Compound protocol has a different liquidation system than the one before it. In order to keep the system running smoothly, the protocol takes in borrower accounts that don't meet the collateral requirements.

If a borrower accrues too much interest on their borrow, or the USD value of their collateral reduces, or the USD value of their borrow increases, the account becomes liquidatable.

The protocol price feed allows a liquidator to determine the discounted price of seized collateral and sell it publicly. Any account (or liquidator) can buy the discounted collateral using the base asset, and the liquidator can then buy it back at a higher price on a DEX and pocket the difference.

COMP Token

The COMP token is the native token of Compound, it allows users to participate in the governance of the Compound protocol. COMP token-holders and their delegates debate, propose and vote on all changes to the protocol.

This system empowers the community to govern the Compound protocol and ensures that those who use the protocol have a say in its future. The daily distribution of COMP tokens ensures that users are incentivized to participate in good governance.

Each day, approximately 1,234 COMP are distributed to users of the protocol; the distribution is allocated to each market (ETH, USDC, DAI…), and is set through the governance process by COMP token-holders. COMP accumulates based how much is invested by you and everyone else using the protocol. Each time you interact with the protocol, supply, borrow, and so on, the COMP you accumulated will appear in your wallet.

Within each market, half of the COMP tokens are earned by suppliers and the other half by borrowers. When users use Compound to supply or borrow assets, they automatically start accruing COMP.

COMP can only be claimed by addresses that interact with the protocol and are able to call the claim function.

Compound launched in September 2018, and was the first instance of user-to-protocol (rather than peer-to-peer) collateralized borrowing. The ideas and innovations from this first version powered the growth of DeFi that followed.

In May 2019, the second version of Compound introduced portable collateral (cTokens), and progressive decentralization that transformed Compound into a community-governed protocol, with over $100 Billion of transactions.

Today, following a successful COMP Governance proposal, Compound III is live.


Back to Basics

Compound III is a streamlined version of the protocol, with an emphasis on security, capital efficiency, and user experience. Complexity wasn’t added — it was removed. What remains is the most effective tool for borrowers in DeFi.

The most profound change was to move away from a pooled-risk model, where users can borrow any asset. In this model (which Compound pioneered) collateral is constantly rehypothecated. A single bad asset (or oracle update) can drain all assets from the protocol.

Instead, each deployment of Compound III features a single borrowable asset. When you supply collateral, it remains your property. It can never be withdrawn by other users (except during liquidation). Capital efficiency increases too — collateral is more “useful” when you know which asset is being borrowed ahead of time.

The first deployment of Compound III allows you to borrow USDC using ETH, WBTC, LINK, UNI, and COMP as collateral.

While you won’t earn interest on collateral anymore, you’ll be able to borrow more; with less risk of liquidation and lower liquidation penalties; while spending less on gas.
New Features

    An entirely redesigned risk management / liquidation engine to increase the safety of funds while simultaneously being more borrower-friendly.
    Market-wide limits on the size of individual collateral assets to limit risk.
    Decoupled earn & borrow interest rate models; governance has full control over economic policy.
    Advanced account management tools, which enable new UX patterns and applications on top of the protocol.
    Chainlink is the exclusive price feed, which is portable to EVM chains beyond Ethereum.
    Governance is simple & easy to manage; the protocol is a monolith, with parameters set through a single Configurator contract.

For details and a list of all changes, please see the full documentation.
Security

Compound III was audited by OpenZeppelin and ChainSecurity, and formally verified in partnership with Certora.

The protocol depends on new technology which might contain undiscovered vulnerabilities. In order to protect users, the first market was initialized with modest collateral limits. The community is encouraged to observe the protocol before scaling across assets & blockchains.
Compound is in your hands

Launching this next-generation protocol has been a massive effort bringing together all stakeholders in the Compound ecosystem; thank you to everyone that contributed, reviewed, tested, audited, debated, and voted to bring the protocol to life.

Out of the gate, Compound III is controlled & owned by the community:

    COMP Governance has exclusive control over the deployed Compound III market and all future deployments.
    The codebase uses a business source license which COMP Governance can modify & grant usage to, as it sees fit, by making changes to compound-community-licenses.eth, an ENS domain owned by the community.

If you have any questions, ideas, or issues, join the community in Discord. From all of us at Compound, 📈.

A few months ago, we began the discussion for a new multi-chain strategy 241; a version of the Compound protocol that can be deployed and run on all EVM compatible chains.

Today, Compound Labs is excited to release a code repository to the Compound community, which we hope can form the basis of a multi-chain deployment strategy: comet 393, which the community has been referring to as Compound III.

Compound III is designed with borrowers in mind, to be capital efficient, gas efficient, safe, and simple to govern.

The repository uses a business source license 94, which Compound governance can grant usage to, as it sees fit, by making changes to compound-community-licenses.eth, a new ENS domain owned by the community.

Developers can begin planning integrations with Compound III, and auditing / suggesting improvements to the codebase.
Changelog

The following is a summary of the major changes from the existing protocol:

    Compound III deployments feature a single borrowable (interest earning) base asset. All other assets are collateral. This reduces risk, and can improve capital efficiency.
    Collateral size limits can be set for each collateral asset (a.k.a. supply caps).
    There are separate borrowing collateral factors, and liquidation collateral factors. This protects borrowers from early liquidation, and can improve risk management.
    The risk management / liquidation engine has been entirely redesigned, to increase the safety of the protocol while preserving liquidator incentives.
    The price feed doesn’t expect a custom price oracle; instead, it is designed to use Chainlink directly, which is portable to EVM chains beyond Ethereum; governance can modify this decision in the future.
    Supply/borrow interest rate models can be decoupled from one another; governance has full control over economic policy.
    Advanced account management tools, which can enable new UX patterns and applications on top of the protocol.
    An abstract incentive metric is built natively into the core contract, to enable rewarding user activity from day one of the protocol. A rewards system is elegantly added on top to provide incentives similar to v2, but flexible enough to be extended by governance in new ways.
    A code repository which includes sophisticated tooling for managing and testing deployments, based on years of experience and feedback from prior versions of the protocol.

Next Steps

Over the coming weeks, we look forward to working with the community to finish auditing the protocol; learning from the current testnet; releasing an initial deployment on Ethereum, with interfaces, liquidation bots, and tooling; and beginning deployments across other EVM chains with tools for governance to manage those deployments.

If you have any questions, please join the next Community Developer call in Discord!


Introduction
Borrowing and lending in Decentralized Finance (DeFi) have never been easier. Compound Finance has been one of the leading protocols for lending and borrowing crypto in the DeFi space. In some sense, Compound is a savings account where you can earn interest without having to trust a third party with your funds. 
The user experience is quite smooth, and the protocol has been tested in the wild for a while. In addition, many yield farmers use Compound to borrow assets and supply them to other DeFi protocols.

But how does Compound Finance work? Let's find out.


What is Compound Finance?
Compound Finance is a DeFi lending protocol. In more technical terms, it's an algorithmic money market protocol. You could think of it as an open marketplace for money. It lets users deposit cryptocurrencies and earn interest, or borrow other cryptoassets against them. It uses smart contracts that automate the storage and management of the capital being added to the platform. 
Any user can connect to Compound and earn interest using a Web 3.0 wallet, such as Metamask. This is why Compound is a permissionless protocol. It means that anyone with a crypto wallet and an Internet connection can freely interact with it.

Why is Compound useful? Well, suppliers and borrowers don't have to negotiate the terms as they would in a more traditional setting. Both sides interact directly with the protocol, which handles the collateral and interest rates. No counterparties hold funds, as the assets are held in smart contracts called liquidity pools.
The interest rates for supplying and borrowing on Compound are adjusted algorithmically. This means that the Compound protocol automatically adjusts them based on supply and demand. In addition, COMP token holders also have the power to make adjustments to interest rates.


How does Compound Finance work?
Positions (supplied assets) in Compound are tracked in tokens called cTokens, Compound's native tokens. cTokens are ERC-20 tokens that represent claims to a portion of an asset pool in Compound. 

For example, if you deposit ETH into Compound, it's converted to cETH. If you deposit the stablecoin DAI, it's converted to cDAI. If you deposit multiple coins, they'll each earn interest based on their individual interest rates. In other words, cDAI will earn the cDAI interest rate, and cETH will earn the cETH interest rate.

cTokens can be redeemed for the portion of the pool they represent, which makes the supplied assets available in the connected wallet. As the money market earns interest (borrowing increases), cTokens earn interest and become convertible to more of the underlying asset. This basically means that earning interest on Compound is simply holding an ERC-20 token.

The process starts with users connecting their Web 3.0-enabled wallet, such as Metamask. Then they can select any asset to unlock that they want to interact with. If an asset is unlocked, users can both borrow or lend it.

Lending is quite straightforward. Unlock the asset that you wish to supply liquidity for, and sign a transaction through your wallet to start supplying capital. The assets are instantly added to the pool, and start earning interest in real-time. This is when the assets are converted to cTokens. 

Borrowing is a bit more complicated. First, users deposit funds (collateral) to cover their loan. In return, they earn "Borrowing Power," which is required to borrow on Compound. Every asset that is available for supply will add a different amount of Borrowing Power. Users can then borrow according to how much Borrowing Power they have. 
Similarly to many other DeFi projects, Compound works with the concept of overcollateralization. This means that borrowers have to supply more value than they wish to borrow to avoid liquidation.
It's worth noting that every asset has a unique borrow and supply Annual Percentage Rate (APR). Since the borrow and supply rates are adjusted based on supply and demand, each asset will have a unique interest rate for both lending and borrowing. As we've discussed before, each asset will earn different interest rates.


What assets are supported by Compound Finance?

As of 01/09/2020, the supported assets for lending and borrowing on Compound include:

    ETH
    WBTC (Wrapped Bitcoin)
    USDC
    DAI
    USDT
    ZRX
    BAT
    REP

Additional tokens will likely be added in the future.


How does Compound's governance work?
Compound started as a company founded by Robert Leshner and funded by venture capitalists. However, Compound Finance's governance is being gradually decentralized thanks to the COMP token. The token entitles token holders to fees and governance rights over the protocol. 

As such, token holders can make changes to the protocol through improvement proposals and on-chain voting. Each token represents one vote, and holders can vote on proposals with their token holdings. In the future, the protocol may be completely governed by COMP token holders.

What are some of the most common issues that COMP holders vote on?

    What cToken markets to list.
    Interest rates and required collateralization for each asset.
    What blockchain oracles to use.


➟ Looking to get started with cryptocurrency? Buy Bitcoin on Binance!


Compound Finance pros and cons
What do users use Compound for? Well, earning interest is a simple use case, and Compound's user experience is quite beginner-friendly. But Compound can also be a good way for more advanced traders to increase leverage on a position. 
For example, let's say a trader is long ETH, and they supply that ETH to the Compound protocol. Then, they borrow USDT against the ETH they provided and buy more ETH with it. If the price of ETH goes up and the profits earned are more than the interest paid for borrowing, they make a profit.
However, this also increases the risks. If the ETH price goes down, they'll still have to pay back the borrowed amount with interest, and the ETH they put up as collateral might get liquidated.

What are some of the other risks? Compound has been audited by firms such as Trail of Bits and OpenZeppelin. While these are generally considered reputable auditing firms, bugs and vulnerabilities can bring unexpected problems, and they are part of any software.

You should carefully consider all the risks before sending funds to a smart contract. But regardless of the type of financial product, you should never risk more funds than you can afford to lose.


Closing thoughts

Compound is one of the most popular lending and borrowing solutions in DeFi. As many other products integrate their smart contracts into their applications, Compound is an integral piece of the DeFi ecosystem. 

Once governance is fully decentralized, Compound could strengthen its place in DeFi as one of the core money market protocols.

Compound Finance can be described as a savings account where you can earn interest without trusting a third party with your funds. It allows lenders to provide loans to borrowers against their crypto assets locked in the Compound protocol.

This article covers what Compound Finance is, how it works, and everything else you need to know about this promising technology.
What is Compound Finance?

Like most DeFi protocols, Compound is based on the Ethereum blockchain. Lenders can provide loans to borrowers by locking their crypto assets in the DeFi protocol. Compound Finance also enables you to transfer, trade, and

What is Compound Finance?

Like most DeFi protocols, Compound is based on the Ethereum blockchain. Lenders can provide loans to borrowers by locking their crypto assets in the DeFi protocol. Compound Finance also enables you to transfer, trade, and use the money in other DeFi applications. The native token of the Compound network is called COMP. 


How it works

Positions (supplied assets) in Compound are tracked in tokens called cTokens, Compound's native tokens. cTokens are ERC-20 tokens that represent claims to a portion of an asset pool in Compound. By locking up ERC20 assets in the Compound protocol, depositors receive an equivalent amount of respective cTokens as collateral.

Remember that your collateral has to stay above a minimum amount when borrowing crypto from Compound, or else it will liquidate your collateral to repay the loan. Once repayment is made, you can withdraw your crypto assets locked in the Compound protocol.

Interest rates are calculated by the supply and demand of each crypto asset. In addition to earning interest on your crypto assets, Compound allows you to borrow additional crypto assets through cTokens generated each time a user deposits their crypto assets into Compound protocol. These ERC20 token tokens can be traded or used in other decentralized applications (DApps).

You can mint or generate cTokens using an Ethereum wallet. Compound users can borrow or lend BAT, DAI, ETH, REP, USDC, WBTC, and ZRX. Whenever you deposit your crypto assets into the Compound protocol, new cTokens are generated.  If you want to borrow crypto using ETH as collateral, you will receive cETH equivalent of your deposited ETH.
Closing thoughts

Compound Finance is one of the most popular lending and borrowing solutions in the Decentralized Finance ecosystem. 

The goal of Compound Finance is to be fully decentralized over time and transfer authority of the underlying protocol to the Decentralized Autonomous Organization (DAO) governed by the Compound community.
Buy and Trade COMP on Liquid

You can buy COMP on Liquid via simple purchases with your bank card.

Liquid offers high-performance API, deep liquidity, some of the most unique trading experiences in the industry with a wide variety of assets, all in one platform. 

Everyone is familiar with the idea of borrowing and lending, whether in real money or mortgages, as it is one of the main sectors in the finance space. Lenders supply funds to borrowers with the expectation that the borrowed funds are returned with additional interest to provide instant access to funds. Conventionally, the process of matching borrowers with lenders is done by financial bodies such as banks that manage the rates. Thanks to Decentralized Finance (DeFi), the process is easier and allows a seamless connection.

DeFi protocols keep depositors’ assets and, in exchange, pay low (but safer) rewards. One notable DeFi platform in this space is Compound Finance. By allowing users to deposit into a pool that borrowers can then withdraw from without any third party. Here we explain everything you need to know about Compound Finance.

Compound Finance is a decentralized protocol running on Ethereum, allowing users to lend and borrow crypto assets without any third party. It is an algorithmic money market protocol that offers users easy ways to earn interest from their savings. Just like the traditional savings account, you can earn APR from your crypto holdings with Compound Finance. Currently, the protocol has recorded more than 3 billion crypto assets gaining interest in 20 markets.

The platform was launched in 2018 by a team of professionals from different fields under the umbrella name known as Compound Labs. It primarily focuses on maximizing idle crypto assets locked in wallets to earn profits and get a steady passive income. This means anyone with a Web 3.0 wallet, such as MetaMask, can access this and start their earning journey. The Compound Protocol gives you access to earn from 20 Ethereum-based assets like ZRX and WBTC. It essentially started one of the most popular DeFi functions, yield farming. 

The concept favors both lenders and borrowers, as each side earns profits from their holdings. Lenders earn interest from their deposited funds, while borrowers have access to these funds without facing the stress of going to the bank. Likewise, the protocol uses a smart contract that automatically connects these two parties trustlessly. Lenders and borrowers don’t have to know each other, as they both interact with the smart contract, which handles the collateral and interest rates.

Compound Finance originally started as a tokenless protocol, where it implements cTokens. Subsequently, the Compound Labs teams made an update to further make the platform decentralized by implementing the COMP token used to govern the protocol. After several updates, Compound is now fully managed by COMP holders, with no remaining privileges held by Compound Labs.
What makes Compound unique?

On the surface, like any other DeFi lending protocol, Compound Finance allows users to earn interest from their crypto holdings. They get to deposit their funds into liquidity pools and exploit the best-performing strategy to maximize their profits. Additionally, compound interest is calculated algorithmically, and it offers a transparent and trustless finance banking system.

Compound interest

Compound interest rates run as decentralized functions that respond to market forces. This also extends to features like receiving loans or trading cryptocurrency on the Compound market. And in terms of collecting loans, there’s no exact time period to borrow assets from Compound Finance. You can return the borrowed funds at your convenience. However, the interest piles up per block on the Ethereum network.

It’s also worth noting that COMP tokens are given to lenders and borrowers to increase their participation in the network. COMP does not only offer users rewards for their participation. It also gives them access to the community’s governance. As a result, these token holders can vote, delegate, and make proposals that will affect the protocol’s future. These proposals include interest rates and other decisions that can change their future incentives.

Yield farming

In June 2020, Compound started incentivizing both lenders and borrowers that use the platform with their COMP token and subsequently triggered a trend that could well be the birth of yield farming. This concept allows users to increase their earnings via InstaDapp, which offers seamless access to multiple DeFi platforms from a single interface.

Eliminates the need for verification 

In addition, the Gateway and Treasury feature improves users’ trading experience by offering them access to several money management tools. As a result, users get to easily access the crypto interest rates, excluding mechanical complexities like cybersecurity, interest rate volatility, and KYC compliance.

As mentioned above, Compound Finance utilizes smart contracts to manage the funds deposited to the pools, with its algorithm determining interest rates. Since it’s a public platform on Ethereum, anyone can interact with the protocol once they have a crypto wallet and immediately start lending and borrowing. 

Likewise, borrowers can take loans in crypto assets supported by the platform by collateralizing their holdings without the need for Know-Your-Customer verification.

Now let’s explore how you can start lending and borrowing on the Compound Protocol.
How lending works

To start lending on Compound, consider it your regular savings account. With a savings account, you store money while the bank returns specific interest on the balance. This way, the bank can utilize the funds and issue loans to other clients in return. Similarly, to lend on Compound Finance, you need a reputable crypto wallet such as MetaMask. This wallet connects your funds to the decentralized Compound protocol.

The next step is to keep a small amount of Ether (ETH) as gas fees on the Ethereum blockchain to complete the transaction. To access the lending portal, you can visit here.

After completing the funding process, you get to earn the equivalent interest rate (APY), which varies with the market pool market fluctuations. Lenders earn COMP as rewards; the higher the interest rate, the more COMP tokens each market will receive.

After this, you can then take out your rewards at any time, and Compound even allows you to exchange them for other crypto assets. Likewise, your deposited funds can be used as collateral.
Borrowing on Compound Finance

As with any other DeFi protocol, borrowing on Compound Finance requires a crypto wallet and funds to serve as collateral. Basically, this concept employs overcollaterization, meaning the funds supplied as collateral must be higher than the proposed borrowed amount. Borrowers can only withdraw an equivalent amount up to their total capacity with the sum of the token balance multiplied by the collateral factor, which is a number 0-1 representing the portion users can borrow. 

Users can borrow up to, but not exceeding, their borrowing capacity, and they can take no action (e.g., borrow, transfer COMP collateral, or redeem COMP collateral) that would increase the total worth of borrowed assets above their borrowing capacity.

For instance, if the limit of an asset on a Compound is about 75%, users can borrow 75% of deposited collateral funds. So, if you deposited $100, you would be able to borrow a maximum of $75.

Overall, to borrow, users must first deposit crypto assets to the protocol, and regardless of the deposited asset, users can take out any other cryptocurrency asset.
How does Compound’s governance function?

Compound Finance has a comprehensive and easy governance framework that involves anyone with at least a COMP token to propose a governance action.

Other details regarding the governance actions include:

    Proposals have a 3-day voting period.
    Addresses with voting power can vote for or against the proposal.

All voting activities are expected to stay in Timelock for at least two days before implementation. This allows easy approval of qualified decisions without any mix-up. Additionally, you should note that if a certain proposal doesn’t receive at least 400,000 votes, it gets dropped.

Proposals can change and update the protocol parameters, provide a new interface, or add new features. Some of the proposed actions include:

    Change the interest rate model of the market.
    Update the oracle address.

    Compound (COMP) is the native token of the Compound protocol, and it’s an ERC-20 asset that governs the community. Anyone holding a COMP token can vote, propose, and debate on future updates to the platform. The token has a circulating supply of about 7 million, and it’s currently trading at about $65.
    How was the COMP token distributed?
    
    COMP tokens were initially distributed to the team of Compound Labs, Inc., who explored token governance for a few months. After subsequent updates, the team started distributing the tokens to users, releasing the tokens consistently for a period of four years between lenders and borrowers of various pools based on the ratio of total interest paid out. 
    
    This liquidity mining process gained attention in the DeFi space and contributed to the overall increase in the total value of crypto assets locked in DeFi from $100 million to over $600 million during the launching period.
    Tokenomics
    
    COMP token has a total maximum supply of 10 million tokens, and it was allocated as follows:
    
        Compound Protocols users: 4 million COMP over a period of four years.
        Shareholders: 2.3 million COMP go to the Shareholders of Compound Labs, Inc.
        Founders and team: 2.2 million portions of the token over a period of four years.
        Community Growth: 775,000 COMP also goes to the advancement of the community.
        Future team members: 72,000 COMP tokens.
    
    Token usage
    
    The primary use of the COMP token is to govern the Compound Finance community. As a result, anyone holding the token can make proposals and vote on future community updates. The token also provides them with some claim on the funds flows of the network.
    Governance
    
    Compound Finance protocol is entirely governed on-chain by COMP tokens, where one token equals one vote. Token holders can vote directly or delegate their voting rights to other participants they deem fit for making decisions. All governance processes happen via the Governor Alpha, the module used to conduct these modifications.

    The COMP token is pretty much popular, so it’s available on several centralized crypto exchanges such as Kraken, Binance, Coinbase, Kraken, and a lot more. 

You can also buy COMP and store it on your web3 wallets such as Trust wallet and MetaMask.

For this guide, let’s explore a detailed step-by-step guide on how to buy COMP.

Create an account

Before you can purchase COMP, you’ll typically need to have a wallet or an account with a cryptocurrency exchange. You can select Binance.

Complete verification 

Binance will wake you when you complete your verification to start buying coins. This helps limit your potential loss of funds or any security breach.

Choose how you want to buy the COMP token

Click on the “Buy Crypto” option official Binance web page, which will show the available options in your country. You can buy a stablecoin like USDT or BUSD first and then use it to buy Compound COMP.

There you go! You can store and hold the coins upon buying and probably participate in all the passive crypto-earning programs.
Should you invest in Compound Finance?

Compound Finance stands as one of the cornerstones of the DeFi market. It has proven itself to be one of the most active platforms, and there is no reason to think that that will change anytime soon. It also has a considerable reputation among users.

While the platform provides excellent features, it doesn’t mean that it automatically makes it a good investment. Do your own research, and never invest more than you can afford to lose.

The burgeoning decentralized finance (DeFi) ecosystem aims to use decentralized, non-custodial financial products to replace centralized middlemen in financial applications such as loans, insurance and derivatives.

Uniswap is an example of one of the core products in the DeFi ecosystem, the decentralized crypto exchange, or DEX. DEXs aim to solve many of the problems of their centralized counterparts, including the risk of hacking, mismanagement, and arbitrary fees. However, decentralized

exchanges have their own problems, mainly lack of liquidity—which means a lack of amount of money sloshing around an exchange that makes trading faster and more efficient.

Uniswap is trying to solve decentralized exchanges' liquidity problem, by allowing the exchange to swap tokens without relying on buyers and sellers creating that liquidity.

Below we explore how Uniswap works—and how it became one of the leading decentralized exchanges built on Ethereum.

Introduction

The defining idea of Uniswap v3 is concentrated liquidity: liquidity that is allocated within a custom price range. In earlier versions, liquidity was distributed uniformly along the price curve between 0 and infinity.

The previously uniform distribution allowed trading across the entire price interval (0, ∞) without any loss of liquidity. However, in many pools, the majority of the liquidity was never used.

Consider stablecoin pairs, where the relative price of the two assets stays relatively constant. The liquidity outside the typical price range of a stablecoin pair is rarely touched. For example, the v2 DAI/USDC pair utilizes ~0.50% of the total available capital for trading between $0.99 and $1.01, the price range in which LPs would expect to see the most volume - and consequently earn the most fees.

With v3, liquidity providers may concentrate their capital to smaller price intervals than (0, ∞). In a stablecoin/stablecoin pair, for example, an LP may choose to allocate capital solely to the 0.99 - 1.01 range. As a result, traders are offered deeper liquidity around the mid-price, and LPs earn more trading fees with their capital. We call liquidity concentrated to a finite interval a position. LPs may have many different positions per pool, creating individualized price curves that reflect the preferences of each LP.
Active Liquidity

As the price of an asset rises or falls, it may exit the price bounds that LPs have set in a position. When the price exits a position's interval, the position's liquidity is no longer active and no longer earns fees.

As price moves in one direction, LPs gain more of the one asset as swappers demand the other, until their entire liquidity consists of only one asset. (In v2, we don't typically see this behavior because LPs rarely reach the upper or lower bound of the price of two assets, i.e., 0 and ∞). If the price ever reenters the interval, the liquidity becomes active again, and in-range LPs begin earning fees once more.

Importantly, LPs are free to create as many positions as they see fit, each with its own price interval. Concentrated liquidity serves as a mechanism to let the market decide what a sensible distribution of liquidity is, as rational LPs are incentivize to concentrate their liquidity while ensuring that their liquidity remains active.
Ticks

To achieve concentrated liquidity, the once continuous spectrum of price space has been partitioned with ticks.

Ticks are the boundaries between discrete areas in price space. Ticks are spaced such that an increase or decrease of 1 tick represents a 0.01% increase or decrease in price at any point in price space.

Ticks function as boundaries for liquidity positions. When a position is created, the provider must choose the lower and upper tick that will represent their position's borders.

As the spot price changes during swapping, the pool contract will continuously exchange the outbound asset for the inbound, progressively using all the liquidity available within the current tick interval1 until the next tick is reached. At this point, the contract switches to a new tick and activates any dormant liquidity within a position that has a boundary at the newly active tick.

While each pool has the same number of underlying ticks, in practice only a portion of them are able to serve as active ticks. Due to the nature of the v3 smart contracts, tick spacing is directly correlated to the swap fee. Lower fee tiers allow closer potentially active ticks, and higher fees allow a relatively wider spacing of potential active ticks.

While inactive ticks have no impact on transaction cost during swaps, crossing an active tick does increase the cost of the transaction in which it is crossed, as the tick crossing will activate the liquidity within any new positions using the given tick as a border.

In areas where capital efficiency is paramount, such as stable coin pairs, narrower tick spacing increases the granularity of liquidity provisioning and will likely lower price impact when swapping - the result being significantly improved prices for stable coin swaps.

For more information on fee levels and their correlation to tick spacing, see the whitepaper.

What is Uniswap?

Uniswap is a protocol on Ethereum for swapping ERC20 tokens. Unlike most exchanges, which are designed to take fees, Uniswap is designed to function as a public good—a tool for the community to trade tokens without platform fees or middlemen. Also unlike most exchanges, which match buyers and sellers to determine prices and execute trades, Uniswap uses a simple math equation and pools of tokens and ETH to do the same job.
Uniswap is trying to solve decentralized exchanges' liquidity problem, by allowing the exchange to swap tokens without relying on buyers and sellers creating that liquidity.

Below we explore how Uniswap works—and how it became one of the leading decentralized exchanges built on Ethereum.
What is Uniswap?

Uniswap is a protocol on Ethereum for swapping ERC20 tokens. Unlike most exchanges, which are designed to take fees, Uniswap is designed to function as a public good—a tool for the community to trade tokens without platform fees or middlemen. Also unlike most exchanges, which match buyers and sellers to determine prices and execute trades, Uniswap uses a simple math equation and pools of tokens and ETH to do the same job.
Did you know?

Uniswap was created by Hayden Adams, who was inspired to create the protocol by a post made by Ethereum founder Vitalik Buterin.
What’s so special about Uniswap?

Uniswap’s main distinction from other decentralized exchanges is the use of a pricing mechanism called the “Constant Product Market Maker Model.”

Any token can be added to Uniswap by funding it with an equivalent value of ETH and the ERC20 token being traded. For example, if you wanted to make an exchange for an altcoin called Durian Token, you would launch a new Uniswap smart contract for Durian Token and create a liquidity pool with–for example–$10 worth of Durian Token and $10 worth of ETH.

Where Uniswap differs is that instead of connecting buyers and sellers to determine the price of Durian Token, Uniswap uses a constant equation: x * y = k.

In the equation, x and y represent the quantity of ETH and ERC20 tokens available in a liquidity pool and k is a constant value. This equation uses the balance between the ETH and ERC20 tokens–and supply and demand–to determine the price of a particular token. Whenever someone buys Durian Token with ETH, the supply of Durian Token decreases while the supply of ETH increases–the price of Durian Token goes up.

As a result, the price of tokens on Uniswap can only change if trades occur. Essentially what Uniswap is doing is balancing out the value of tokens, and the swapping of them based on how much people want to buy and sell them.

As a result, the price of tokens on Uniswap can only change if trades occur. Essentially what Uniswap is doing is balancing out the value of tokens, and the swapping of them based on how much people want to buy and sell them.
What else is different about Uniswap?

Absolutely any ERC20 token can be listed on Uniswap–no permission required. Each token has its own smart contract

and liquidity pool–if one doesn’t exist, it can be created easily.

Once a token has its own exchange smart contract and liquidity pool, anyone can trade the token or contribute to the liquidity pool while earning a liquidity provider fee of 0.3%. To contribute to a liquidity pool, you need an equal value of ETH and ERC20 tokens.

As a result, the price of tokens on Uniswap can only change if trades occur. Essentially what Uniswap is doing is balancing out the value of tokens, and the swapping of them based on how much people want to buy and sell them.
What else is different about Uniswap?

Absolutely any ERC20 token can be listed on Uniswap–no permission required. Each token has its own smart contract

and liquidity pool–if one doesn’t exist, it can be created easily.

Once a token has its own exchange smart contract and liquidity pool, anyone can trade the token or contribute to the liquidity pool while earning a liquidity provider fee of 0.3%. To contribute to a liquidity pool, you need an equal value of ETH and ERC20 tokens.
How are Uniswap tokens produced?

Whenever new ETH/ERC20 tokens are contributed to a Uniswap liquidity pool, the contributor receives a “pool token”, which is also an ERC20 token.

Pool tokens are created whenever funds are deposited into the pool and as an ERC20 token, pool tokens can be freely exchanged, moved, and used in other dapps. When funds are reclaimed, the pool tokens are burned or destroyed. Each pool token represents a user’s share of the pool’s total assets and share of the pool’s 0.3% trading fee.
How to make your first trade on Uniswap

Through Uniswap, you’re able to purchase ether (ETH) and any of the thousands of ERC20 tokens supported by the platform.

To do this, you’re going to need some ETH in your balance to pay for any transaction fees, as well as something to trade for the ERC20 token you want. This might be ETH, or another ERC20 token. For example, if you’re looking to trade USD Coin (USDC) for UNI, you’re going to need to hold USDC in your wallet plus some ether to cover the transaction fee.

Here, we’ll cover how to make your first trade on Uniswap—by purchasing some UNI tokens with ETH.

Step 1: First head over to the Uniswap exchange platform.

On the top right, click the ‘Connect to a wallet’ button, and log in with the wallet you wish to trade with. This can be either a MetaMask, WalletConnect, Coinbase Wallet, Fortmatic, or Portis Wallet.
For the purposes of this tutorial, we’ll log in with a MetaMask wallet.
Uniswap "connect to a wallet" screenshot

Step 2: Once logged in, the trading interface will appear.

In the top field, select the token you wish to exchange for the token you want. We’ll select ETH. In the bottom field, search for the token you wish to purchase, or select it from the drop-down menu, in this case UNI.
For the purposes of this tutorial, we’ll log in with a MetaMask wallet.
Uniswap "connect to a wallet" screenshot

Step 2: Once logged in, the trading interface will appear.

In the top field, select the token you wish to exchange for the token you want. We’ll select ETH. In the bottom field, search for the token you wish to purchase, or select it from the drop-down menu, in this case UNI.
Uniswap "select token" screenshot

Step 3: Now you’re ready to set up your order. You can either choose how much you want to spend by entering a number in the top field, or choose how much to buy by entering a number in the bottom one.

In our example, we’ll buy 0.1 ETH worth of UNI tokens.
Step 4: At the bottom of the order menu, you’ll then see how much you can expect to receive.

If you’re happy with these figures, click the ‘Swap’ button.

Your wallet click will then prompt you to confirm the trade, and potentially adjust the fees to a number that works best for you.
Next steps

Once you've completed your first trade on Uniswap, there are plenty of options for more advanced users.

Since Uniswap is an open protocol of smart contracts, a number of different front-end user interfaces have already been created for it. For example, InstaDApp allows you to add funds into Uniswap pools without needing to access the official Uniswap user interface.

Interfaces such as Zapper.fi allow users to add funds to Uniswap pools using just ETH instead of ETH and another token. The interface even offers simple one-click solutions for purchasing pool tokens in combination with bZx token strategies.


With an array of official and unoffical resources for developers to build on the protocol, we should expect to see many more integrations between Uniswap’s unique token swapping system and new decentralized finance (DeFi

   ) products in the coming years.
   Uniswap V2 and V3
   
   Though Uniswap launched back in November 2018, it wasn't until relatively recently that the protocol began to see significant traction.
   
   The release of Uniswap V2 in May 2020 saw a major upgrade that allows for direct ERC20 to ERC20 swaps, cutting Wrapped Ether (WETH) out of the equation where possible. Uniswap V2 also added support for incompatible ERC20 tokens like OmiseGo (OMG) and Tether (USDT), and added a host of technical improvements that make it more desirable to use.
   
   As liquidity mining and yield farming platforms dramatically increased in popularity in 2020, Uniswap saw a corresponding surge in interest, since many DeFi platforms allow Uniswap liquidity providers to see an additional return on their LP tokens.

   This, in combination with the 0.3% exchange fees distributed to liquidity providers—and the platform’s popularity as a launchpad for popular DeFi project tokens—has seen Uniswap rise the ranks to become one of the leading DeFi platforms by total value locked (TVL)—a measure of the total value of crypto assets locked up in the platform.

In May 2021, Uniswap V3 launched, with the latest iteration of the DEX adding a number of new features. First up is concentrated liquidity, which enables liquidity providers to allocate liquidity within a custom price range. That, in turn, means that traders don't have to put as much capital on the line to achieve results.

This, in combination with the 0.3% exchange fees distributed to liquidity providers—and the platform’s popularity as a launchpad for popular DeFi project tokens—has seen Uniswap rise the ranks to become one of the leading DeFi platforms by total value locked (TVL)—a measure of the total value of crypto assets locked up in the platform.

In May 2021, Uniswap V3 launched, with the latest iteration of the DEX adding a number of new features. First up is concentrated liquidity, which enables liquidity providers to allocate liquidity within a custom price range. That, in turn, means that traders don't have to put as much capital on the line to achieve results.

V3 also adds more fee tiers, enabling traders to better determine their risk level when trading volatile assets (which can change in price between when a trade's initiated and executed). It also adds "easier and cheaper" oracles

, which ensures that the DEX's price data is up to date.

Finally (and perhaps least essentially) it also generates non-fungible tokens (NFTs) based on LP positions, turning them into "on-chain generated art".

UNI token launch and airdrop

In September 2020, Uniswap launched UNI, the network’s governance token, airdropping 400 UNI tokens to every wallet address that had interacted with the Uniswap protocol before September 1.

From a distribution of 150 million UNI tokens, around 66 million were claimed in the first 24 hours following the airdrop. After distributing 40% of the tokens in the first year, it will taper down by 10 percentage points in each subsequent year, until all the tokens have been allocated.

Uniswap plans to distribute a capped total of 1 billion UNI over four years, with 60% earmarked for distribution to the community, 21.5% allocated to Uniswap employees, and the remaining 18.5% going to investors and advisors.

As a governance token, UNI entitles holders to a vote in how the protocol is run, affording them immediate ownership of Uniswap governance, the UNI community treasury, the protocol fee switch, eth ENS, the Uniswap Default List (tokens.uniswap.eth) and SOCKS liquidity tokens. The token was quickly listed on the Coinbase Pro exchange, and soon after on the main Coinbase exchange.

Recent developments

In less than a year, Uniswap V2 has propelled the platform to meteoric growth.

In February 2021, it became the first decentralized exchange to process more than $100 billion in trading volume, and now frequently exceeds $1 billion in trading volume each day. This performance has seen it become not only the largest DEX by trading volume, but one of the top five most popular exchanges period.

Meanwhile, the Uniswap governance token (UNI) has climbed to become the 10th largest cryptocurrency by market capitalization after reaching a peak value of over $44. This was at least partially driven by the growing popularity of yield farming pools, many of which require users to hold UNI or Uniswap LP tokens.

The platform also found itself at the center of the recent Unisocks (SOCKS) craze, a token backed by a physical pair of socks. Although the first pair sold for just $12, in February 2021, a unique sale format that uses a bonding curve to set the price saw one pair sell for a whopping $92,000.

But it hasn’t all been smooth sailing for Uniswap. As a result of massive congestion on the Ethereum network, transaction fees have shot through the roof—making trading on Uniswap an expensive task, particularly when concerning low-value trades.

This has seen the proliferation and growth of a huge range of alternative platforms, including TRON’s JustSwap, Qtum’s QiSwap, and Kyber Network—all of which promise faster transitions, lower fees, or both. Uniswap also saw its daily transaction volume briefly exceeded by PancakeSwap—a similar automated market maker (AMM) built on Binance Smart Chain.

But Uniswap's position as one of the leading DEXs has given it considerable clout. Some are looking to leverage that as the DeFi sector grows—and, inevitably, comes under the gaze of regulators. In May 2021, members of the Uniswap community launched a governance proposal to set up a "political defense" fund with a budget of 1-1.5 million UNI.

The aim of the fund is to preempt regulatory and tax threats using lawyers, lobbyists and organizers, enabling the nascent DeFi space to counter "massive spending from traditional finance players."

With the likes of the SEC and CFTC now considering the question of DeFi regulation, Uniswap may have a fight on its hands.

Uniswap is a leading decentralized crypto exchange that runs on the Ethereum blockchain.

The vast majority of crypto trading takes place on centralized exchanges such as Coinbase and Binance. These platforms are governed by a single authority (the company that operates the exchange), require users to place funds under their control and use a traditional order book system to facilitate trading.

Order book-based trading is where buy and sell orders are presented in a list along with the total amount placed in each order. The amount of open buy and sell orders for an asset is known as “market depth.” In order to make a successful trade using this system, a buy order has to be matched with a sell order on the opposite side of the order book for the same amount and price of an asset, and vice versa.

For example, if you wanted to sell one bitcoin (BTC) at a price of $33,000 on a centralized exchange, you’d need to wait for a buyer to appear on the other side of the order book who’s looking to buy an equal or higher amount of bitcoin at that price.

The main problem with this type of system is liquidity, which in this context refers to the depth and number of orders there are on the order book at any given time. If there’s low liquidity, it means traders may not be able to fill their buy or sell orders.

Another way to think of liquidity: Imagine you own a food stall in a street market. If the street market is busy with stall owners selling goods and people buying produce and products, it would be considered a "liquid market." If the market was quiet and there was little buying and selling going on, it would be considered a "narrow market."

What is Uniswap?

Uniswap is a completely different type of exchange that‘s fully decentralized – meaning it isn’t owned and operated by a single entity – and uses a relatively new type of trading model called an automated liquidity protocol (see below).

The Uniswap platform was built in 2018 on top of the Ethereum blockchain, the world’s second-largest cryptocurrency project by market capitalization, which makes it compatible with all ERC-20 tokens and infrastructure such as wallet services like MetaMask and MyEtherWallet.

Uniswap is also completely open source, which means anyone can copy the code to create their own decentralized exchanges. It even allows users to list tokens on the exchange for free. Normal centralized exchanges are profit-driven and charge very high fees to list new coins, so this alone is a notable difference. Because Uniswap is a decentralized exchange (DEX), it also means users maintain control of their funds at all times as opposed to a centralized exchange that requires traders to give up control of their private keys so that orders can be logged on an internal database rather than be executed on a blockchain, which is more time consuming and expensive. By retaining control of private keys, it eliminates the risk of losing assets if the exchange is ever hacked. According to the latest figures, Uniswap is currently the fourth-largest decentralized finance (DeFi) platform and has over $3 billion worth of crypto assets locked away on its protocol.

How Uniswap works

Uniswap runs on two smart contracts; an “Exchange” contract and a “Factory” contract. These are automatic computer programs that are designed to perform specific functions when certain conditions are met. In this instance, the factory smart contract is used to add new tokens to the platform and the exchange contract facilitates all token swaps, or “trades.” Any ERC20-based token can be swapped with another on the updated Uniswap v.2 platform.
Automated liquidity protocol

The way Uniswap solves the liquidity problem (described in the introduction) of centralized exchanges is through an automated liquidity protocol. This works by incentivizing people trading on the exchange to become liquidity providers (LPs): Uniswap users pool their money together to create a fund that’s used to execute all trades that take place on the platform. Each token listed has its own pool that users can contribute to, and the prices for each token are worked out using a math algorithm run by a computer (explained in “How token price is determined,” below).

With this system, a buyer or seller does not have to wait for an opposite party to appear to complete a trade. Instead, they can execute any trade instantly at a known price provided there’s enough liquidity in the particular pool to facilitate it.

In exchange for putting up their funds, each LP receives a token that represents the staked contribution to the pool. For example, if you contributed $10,000 to a liquidity pool that held $100,000 in total, you would receive a token for 10% of that pool. This token can be redeemed for a share of the trading fees. Uniswap charges users a flat 0.30% fee for every trade that takes place on the platform and automatically sends it to a liquidity reserve.

Whenever a liquidity provider decides they want to exit, they receive a portion of the total fees from the reserve relative to their staked amount in that pool. The token they received which keeps a record of what stake they’re owed is then destroyed.

After the Uniswap v.2 upgrade, a new protocol fee was introduced that can be turned on or off via a community vote and essentially sends 0.05% of every 0.30% trading fee to a Uniswap fund to finance future development. Currently, this fee option is turned off, however, if it is ever turned on it means LPs will start receiving 0.25% of pool trading fees.
How token price is determined

Another important element of this system is how it determines the price of each token. Instead of an order book system where the price of each asset is determined by the highest buyer and lowest seller, Uniswap uses an automated market maker system. This alternative method for adjusting the price of an asset based on its supply and demand uses a long-standing mathematical equation. It works by increasing and decreasing the price of a coin depending on the ratio of how many coins there are in the respective pool.

It’s important to note that whenever someone adds a new ERC-20 token to Uniswap, that person has to add a certain amount of the chosen ERC-20 token and an equal amount of another ERC-20 token to start the liquidity pool.

The equation for working out the price of each token is x*y=k, where the amount of token A is x and the amount of token B is y. K is a constant value, aka a number that doesn’t change.

For example, Bob wants to trade chainlink (LINK) for ether using the Uniswap LINK/ETH pool. Bob adds a large number of LINK to the pool which increases the ratio of LINK in the pool to ether. Since the value K must remain the same, it means the cost of ether increases while the cost of link in the pool decreases. So the more LINK Bob puts in, the less ether he gets in return because the price of it increases.

The size of the liquidity pool also determines how much the price of tokens will change during a trade. The more money, aka liquidity, there is in a pool, the easier it is to make larger trades without causing the price to slide as much.

Arbitrage

Arbitrage traders are an essential component of the Uniswap ecosystem. These are traders that specialize in finding price discrepancies across multiple exchanges and use them to secure a profit. For example, if bitcoin was trading on Kraken for $35,500 and Binance at $35,450, you could buy bitcoin on Binance and sell it on Kraken to secure an easy profit. If done with large volumes it’s possible to bank a considerable profit with relatively low risk.

What arbitrage traders do on Uniswap is find tokens that are trading above or below their average market price – as a result of large trades creating imbalances in the pool and lowering or raising the price – and buy or sell them accordingly. They do this until the price of the token rebalances in line with the price on other exchanges and there is no more profit to be made. This harmonious relationship between the automated market maker system and arbitrage traders is what keeps Uniswap token prices in line with the rest of the market.
How to use Uniswap

Getting started with Uniswap is relatively straightforward, however, you will need to make sure you already have an ERC-20 supported wallet setup such as MetaMask, WalletConnect, Coinbase wallet, Portis, or Fortmatic.

Once you have one of those wallets, you need to add ether to it in order to trade on Uniswap and pay for gas – this is what Ethereum transaction fees are called. Gas payments vary in price depending on how many people are using the network. Most ERC-20 compatible wallet services give you three choices when making a payment over the Ethereum blockchain: slow, medium or fast. Slow is the cheapest option, fast is the most expensive and medium is somewhere in between. This determines how quickly your transaction is processed by Ethereum network miners.
Read more: Ethereum 101: What is Ethereum Mining?

1. Head to https://uniswap.org 2. Click “Use Uniswap” in the top right-hand corner. 3. Go to “Connect wallet” in the top right-hand corner and select the wallet you have. 4. Log into your wallet and allow it to connect to Uniswap.5. On the screen it will give you an option to swap tokens directly using the drop-down options next to the “from” and “to” sections. 6. Select which token you’d like to swap, enter the amount and click “swap.” 7. A preview window of the transaction will appear and you will need to confirm the transaction on your ERC-20 wallet. 8. Wait for the transaction to be added to the Ethereum blockchain. You can check its progress by copying and pasting the transaction ID into https://etherscan.io/. The transaction ID will be available in your wallet by finding the transaction in your sent transaction history.

Uniswap's UNI token

Uniswaps native token, UNI, is known as a governance token. This gives holders the right to vote on new developments and changes to the platform, including how minted tokens should be distributed to the community and developers as well as any changes to fee structures. The UNI token was originally created in September 2020 in an effort to prevent users from defecting to rival DEX SushiSwap. One month before UNI tokens launched, SushiSwap – a fork of Uniswap – had incentivized users from Uniswap to allow SushiSwap to reallocate their funds to the new platform by rewarding them with SUSHI tokens. This was a new type of token that gave users governance rights over the new protocol as well as a proportionate amount of all transaction fees paid to the platform.

Uniswap responded by creating 1 billion UNI tokens and decided to distribute 150 million of them to anybody who had ever used the platform. Each person received 400 UNI tokens, which at the time amounted to over $1,000.
This article was originally published on Feb 4, 2021 at 3:39 p.m. 

Introduction

Centralized exchanges (CEXs) have been the backbone of the cryptocurrency market for years due to their deep liquidity, faster transactions, fiat on-ramps and customer support. However, decentralized exchanges (DEXs) are gaining popularity as users are attracted by the lower trading fees, security, privacy and accessibility.

DEXs offer unique benefits that can make them a compelling alternative to CEX. One example is Uniswap. Created by Hayden Adams in 2018, its implementation was inspired by the underlying technology first described by Ethereum co-founder Vitalik Buterin. Uniswap pioneered the Automated Market Maker (AMM) model and played a crucial role in the invention and development of DEXs. Today, Uniswap continues to be one of the most user-friendly DEXs available, with substantial liquidity and an extensive selection of token listings.

What Is Uniswap?

Uniswap is a DEX that lets users trade cryptocurrencies without depending on a central authority or intermediary, while maintaining censorship resistance. Operating on the Ethereum blockchain, Uniswap leverages smart contracts — self-executing programs on the blockchain with predetermined conditions directly written into code. 

Uniswap employs an innovative AMM model, which uses liquidity pools instead of traditional order books to enable seamless trading. Users can provide liquidity to these pools by depositing an equal value of both tokens in the pair. In return, they receive Liquidity Provider (LP) tokens. Other users can swap tokens by interacting with the liquidity pools. A Constant Product Market Maker (CPMM) model is used to determine the price of assets in a liquidity pool.  

Uniswap uses open-source software, which you can check out on Uniswap GitHub.


How Does Uniswap Work?

At the core of Uniswap is its CPMM model. Let’s see how it works. 

Let’s say you deposit a trading pair to Uniswap’s liquidity pool as a liquidity provider (LP). You can commit any pair of tokens of equal value, either ETH and one ERC-20 token, or two ERC-20 tokens. One of the tokens is usually a stablecoin such as DAI, USDC, or USDT. In return, you’ll receive "liquidity tokens" as an LP, representing your share of the liquidity pool and the corresponding portion of the trading fees generated by the pool. .

Let's look at the ETH/USDT liquidity pool. We'll call the ETH portion of the pool x and the USDT portion y. Uniswap multiplies x by y to calculate the total liquidity in the pool, which we'll call k. The core idea behind Uniswap is that k must remain constant. Therefore, the formula for the total liquidity of the pool is: x * y = k.

So let's say Alice buys 1 ETH for 300 USDT using the ETH/USDT liquidity pool. In doing so, she increases the USDT portion and decreases the ETH portion of the pool. This will increase the price of ETH.

This occurs as there is now less ETH in the pool after the transaction and we know that the total liquidity of the pool (k) must remain constant; this mechanism determines that the price of ETH will be k/x. Ultimately, the price paid for the ETH in the pool is based on how much a given trade shifts the ratio between x and y.

It's worth noting that this model does not scale in a linear fashion. The larger the order, the greater the shift in the balance between x and y. Larger orders are therefore much more expensive than smaller orders and will lead to progressively greater slippage. It also means that the larger the liquidity pool, the smaller the shift between x and y, and therefore, the easier it is to fill large orders.
The Evolution of Uniswap

Uniswap has evolved over time, with different protocol versions offering new features and improvements. Here's a brief overview of Uniswap v1, v2, and v3:
Uniswap v1

Launched in 2018, Uniswap v1 was the first version of the Uniswap protocol. It was designed with simplicity in mind but still allowed users to trade any ERC-20 token on the Ethereum blockchain. The protocol gained popularity among the Ethereum community and worked as a proof of concept for AMM based decentralized exchanges.
Uniswap v2

Uniswap v2 was launched in 2020 and brought several improvements to the first version. One of the most significant changes was the introduction of ERC-20 to ERC-20 pairs, which meant liquidity providers could create pair contracts for any two ERC-20 tokens.

Users could also trade between the tokens without the need for intermediate conversion to ETH. In short, Uniswap v2 permitted liquidity pools consisting of any two ERC-20 tokens instead of needing to have ETH alongside one ERC-20 token.

Uniswap v2 also improved the efficiency of the protocol, lowered gas fees, and ushered in new features such as flash swaps, which meant tokens could be released to recipients before verifying that sufficient input tokens were received. The new features and optimizations set the stage for exponential growth in AMM adoption and made Uniswap one of the largest cryptocurrency spot exchanges.
Uniswap v3

One of the most significant changes Uniswap v3 introduced was related to capital efficiency. Many AMMs are largely capital-inefficient — most of the funds they contain are usually not in use due to an inherent characteristic of the aforementioned x * y = k model. Simply put, the more liquidity the pool has, the larger the orders and price range the system can support.

LPs in these pools provide liquidity for a price curve between 0 and infinity, which means the capital provided by LPs in an AMM is evenly distributed across all price ranges. This means only a portion of the liquidity in the pool sits where most of the trading is taking place. However, it doesn't make much sense to provide liquidity in a price range that is far from the current price or will never be reached.

Uniswap v3 seeks to address this issue — LPs can now set custom price ranges within which they want to provide liquidity, which should result in more concentrated liquidity in the price range with the most trading activity. For example, if an LP sets a price range of $1,000 to $2,000, the liquidity provided can only enable trading between these two prices, instead of within infinite price ranges.

In some sense, Uniswap v3 is a rudimentary way of creating an on-chain order book on Ethereum, where market makers can decide to provide liquidity in price ranges of their choice. It’s worth noting that this change favors more experienced market makers over beginner participants. With this additional layer of complexity, less active LPs may earn less in trading fees than professional players who optimize their strategy consistently.
Uniswap LP positions as NFTs

Since each LP can set their own price range, each Uniswap LP’s position is unique and as such, no longer fungible. In Uniswap v3, LP positions are now represented by a non-fungible token (NFT). However, the shared positions can still be made fungible (ERC-20).

Uniswap v3 LPs now see all fees generated directly in the NFTs themselves. These NFTs can be traded between wallets and holders can always collect position fees. It's basically a digital image that displays essential information, such as the token pair and a curve representing the position's "steepness". Each Uniswap v3 position also has a unique color scheme, and different pools are represented by different color variations.
Different fee tiers

Uniswap v3 offers LPs three fee levels, 0.05%, 0.30% and 1.00%, to allow LPs to adjust their profit margins based on the expected volatility of the token pair. For example, LPs are exposed to higher risks in non-correlated pairs such as ETH/USDT and lower risks in correlated pairs such as stablecoin pairs.
Uniswap on Layer 2

Historically, Ethereum transaction fees have been on the rise as network usage has increased. This makes using Uniswap economically unfeasible at times, especially for smaller users. To solve this problem, Uniswap v3 allows Layer 2 scaling solutions to scale smart contracts while still enjoying the security of the Ethereum network. This implementation also helps to increase transaction throughput and ensure lower fees for users.
Uniswap live on BNB Chain

Uniswap went live on the BNB chain after receiving 66% support from governance voters. This move can potentially provide users with more efficient and cost-effective trading options. It also means Uniswap users will be able to take advantage of BNB Chain's high speed and low transaction fees. Additionally, the integration allows Uniswap to tap into a new pool of liquidity and increase awareness and adoption among both retail and institutional investors.
What Is Impermanent Loss?

Aside from earning fees for providing liquidity to traders who can swap tokens, LPs should also be aware of an effect called impermanent loss. Let’s assume Alice is an LP who has deposited 1 ETH and 100 USDT into a Uniswap pool with a total liquidity of 10,000 (10 ETH x 1,000 USDT); the rest was funded by other LPs like her. Alice's share in the pool is 10%, meaning her initial deposit comprises 10% of the pool’s total liquidity.

At the time of Alice's deposit, the price of 1 ETH was 100 USDT, which means her deposit was $200 (1 ETH x $100 + 100 USDT). Now suppose that the price of ETH increases to 400 USDT. As a result, arbitrage traders add USDT to and remove ETH from the pool until the ratio between the two accurately reflects the new price. This causes the amount of ETH and USDT in the pool to decrease to 5 ETH and 2,000 USDT.

Alice decides to withdraw her funds from the pool. According to her share, she receives 10%, i.e., 0.5 ETH and 200 USDT, totaling $400 (0.5 ETH x $400 + 200 USDT). On the surface, it seems like Alice has made a profit.

However, if she had held onto her initial deposit of 1 ETH and 100 USDT, she would have ended up with a total value of $500 (1 ETH x $400 + 100 USDT). Therefore, by depositing her funds into the Uniswap pool, Alice has lost out on the ETH price appreciation.

This loss is referred to as “impermanent” because it can be mitigated if the prices of the pooled tokens revert to the same prices as when they were added to the pool. Additionally, since LPs earn fees, the loss may be balanced out over time. Nonetheless, LPs should be aware of the concept of impermanent loss before adding funds to a Uniswap pool.

Do note that the above scenario applies whether the price rises or falls from the time of the deposit. This means that if the price of ETH decreases from the time of the deposit, the losses incurred by the LP may also be amplified. 
How Does Uniswap Make Money?

Uniswap generates revenue through a small fee charged on each trade made on the protocol. This "liquidity provider fee" is set at a certain amount of the trade value and is automatically distributed to LPs. Unlike traditional exchanges, Uniswap as a protocol does not generate revenue for itself but for LPs. By concentrating their liquidity, LPs can increase their exposure within the specified price range to earn even more trading fees on Uniswap v3.

Also, due to Uniswap’s open-source and decentralized nature, there is no central entity controlling or profiting from the protocol. Instead, it’s maintained and improved by a community of developers and its governance, both of whom contribute to its progress.
The Uniswap (UNI) Token 

Uniswap's native token, UNI, was launched in September 2020 and has since been attracting users and LPs to the platform. UNI is an ERC-20 token, which means it was built on Ethereum and can be stored in any cryptocurrency wallet that supports ERC-20 tokens.

The UNI token entitles its holders to governance rights, meaning they can vote on changes and improvements to the protocol. The extent of voting power a user has is proportional to the number of governance tokens they hold. The governance process is decentralized, which means anyone can submit a proposal and anyone can vote.

UNI tokens can be bought and sold on various cryptocurrency exchanges, so traders can use UNI tokens to trade for other cryptocurrencies or to participate in decentralized finance (DeFi) applications. Do note that new use cases may emerge through community requests and governance votes.
How to Use Uniswap

To use Uniswap, you need to have a cryptocurrency wallet that contains some Ether or ERC-20 tokens. Here’s how to start using a simple swap option on Uniswap:

    Connect to your Ethereum wallet on the Uniswap website.

    Select the token you wish to trade. Uniswap supports several ERC-20 tokens; make sure you select the correct one.

    Enter the amount you wish to trade. The interface will then show you the estimated amount of the other token you will receive, based on the current exchange rate.

    If the amount is satisfactory, you can click "Swap". Your wallet will then prompt you to confirm the transaction.

    After confirming the transaction, the trade will be executed on Ethereum. Finally, the tokens will be displayed in your wallet.

    Closing Thoughts

Uniswap is an evolving DEX protocol built on Ethereum. It allows anyone with a crypto wallet to exchange tokens without the involvement of intermediaries or third parties. The platform has enabled a new class of LPs to earn fees on their idle assets while allowing traders to easily swap between cryptocurrencies.

The launch of the UNI governance token has further established Uniswap's position as a community-driven platform. As the DeFi ecosystem continues to grow, it will be interesting to see how DEXs evolve to meet user demands while maintaining their core values of decentralization and trustlessness.


1 Introduction

Decentralised Finance (DeFi) has recently shown phenomenal growth in the blockchain and cryptocurrency space. Recognised as an alternative and potential disruptor to traditional centralised finance, DeFi offers the prospect of higher levels of financial access allowing the ability for a suite of financial products to be built on permissionless distributed blockchains. This allows financial products and services to be deployed as code and users can interact with each other through smart contracts that operates as self-executing code on the blockchain. Participants thus can interact with each other cutting out the middleman of financial institutions who traditionally provided the service of intermediation. In addition to providing alternative access to traditional financial products, DeFi also offers the possibility of unique financial architecture to be added piecemeal as “money legos” to the financial ecosystem. A novel product that has seen increasing success are DEXs (decentralised exchanges) that allow users to supply and source liquidity by interacting through protocols coded as an algorithm that provides an automated market making function. The study of user behaviour and effects of strategic interaction with the automated market maker (AMM) mechanism in DeFi is still in a nascent stage as the DEX space is emerging.

Behavioral finance has highlighted many examples which cast doubt on the assumption that agents make trading and investing decisions in financial markets with perfect rationality [Hirshleifer (2001); Barberis and Thaler (2003)]. This has led to alternative modelling paradigms, such as agent-based modelling, in which the detailed nuances of less-than-perfect decision making are incorporated into models which attempt to tackle the messiness of real-world markets by taking a bottom-up approach to the modelling problem. One radical approach to modelling rationality is to drop it entirely from the model. Surprising as it may seem, such zero-intelligence models are often able to account for empirical features of actual market data, suggesting that many regularities in economic time-series data can arise from the environment in which agents trade—i.e., the market microstructure, rather than the particulars of the trading decisions themselves (Gode and Sunder, 1993).

A typical approach to building a zero-intelligence model of a financial market is to build a simple random simulation model of the order-submission process; in the simplest case, we can use arbitrary distributions from which to draw i. i.d. random variables such as the size and sign of orders. A more subtle approach is to calibrate the statistical model of order-flow against the statistical properties of empirical data.

In this paper we present a novel version of a calibrated zero-intelligence model. We do this by simply taking existing order flow and shuffling its ordering and then simulating back through the AMM matching mechanism. We make some adjustments to liquidity removal actions to ensure liquidity pools can never go negative. The output of many shuffles is then analysed using two main market quality metrics used in the AMM space such as impermanent loss and slippage along with a price efficiency metric well known in traditional finance. Our simulations show that a zero-intelligence AMM model has lower impermanent loss, higher slippage and lower deviation from a random walk (suggesting higher price efficiency).

For the rest of this section we give a background to the DEX space within DeFi and related work in the zero-intelligence literature. In Section 2 we describe the Uniswap V1 protocol along with the open-source cadCAD Uniswap model that sources the underlying empirical dataset and digital-twin simulation platform used before describing how this data is shuffled. In Section 3 we describe and analyse metrics on impermanent loss, slippage and price efficiency. Finally we conclude in Section 4 discussing the results and outlying future work.
1.1 Decentralised Exchanges, Automatic Market Makers, and Cryptofinance

Cryptocurrencies are digital currencies that do not rely on a central authority such as a central bank or government. The global cryptocurrency market capitalization is currently $2.29 USD trillion1. Since the maturing of Bitcoin the first peer to peer cryptocurrency on the bitcoin blockchain, there has been a rapid growth in decentralised finance (DeFi) applications built on the Ethereum permissionless blockchain. These DeFi applications make use of smart contracts that allow pre-existing computer code to determine the terms between counterparties and be recorded on the blockchain. The amount of assets or total value locked (TVL) held in DeFi applications has grown in the last year from roughly $20.21 USD Billion to $74.63 Billion USD2. The biggest components of DeFi are lending protocols such as Aave and Compund and decentralised exchanges (DEXs) such as Uniswap and Balancer. DEXs offer an alternative way for buyers and sellers to trade cryptocurrency without going through a centralised exchange. Traditionally financial exchanges operate using a limit order book mechanism to match buy offers with sell offers. Centralised cryptocurrency exchanges such as Coinbase and Binance also use this mechanism where liquidity is provided by limit orders and consumed by market orders. In a dealer market, registered market makers will buy and sell stock regularly continuously at publicly quoted prices. In these markets the bid-ask spread compensates the liquidity provision.

The most popular DEXs use an automatic market maker (AMM) protocol whereby users can stake and remove liquidity and interact with users who want to swap one cryptocurrency for another. A user of an AMM like Uniswap, can swap token A for token B by depositing token A into the AMM’s liquidity pool and remove token B. The counterparty is thus the AMM liquidity pools, which consist of the funds of the tokenised assets (in this case the fictitious tokens A and B) seeded by a community of liquidity providers who consist of individuals and institutions staking their assets. These assets are converted into a smart contract and the pricing of the tokens are algorithmically determined that allows traders to transact 24/7. In return for staking their assets, liquidity providers are issued with liquidity tokens by the protocol. These liquidity tokens act like an accounting unit to a claim on their share of the liquidity pool balances which will benefit from accrued fees paid by users looking to swap tokens.

Automatic market makers (AMMs) thus offer an automated way for buyers and sellers to interact. Indeed in more mature equity and fixed-income markets, algorithmic trading market making strategies are already a big part of high-frequency trading. AMMs have been extensively studied as a method of information discovery in thin prediction markets since it was introduced by Hanson (2003). In building a blockchain automated market maker, a smart contract designer sets up a price function that will buy and sell to all comers at that price. Prices move when trades occur. Thus market makers do not adjust prices but rather are dependant on arbitrageurs (typically arbitrage bots) to trade and readjust token balances to bring prices back to equilibrium. Any user can be a liquidity provider and stake tokens in a liquidity pool. Other users can access that liquidity and exchange tokens based on a pricing function dictated by their relative availability in the pool. The AMM protocol thus, offers a simplified decentralised way to automate trading and has the advantage of being cheaper and faster than an order book to store on a smart contract. It does have however potential drawbacks of being more at risk from front-running by miners who validate transactions on the blockchain (Harvey et al., 2021). In an orderbook, liquidity provision is compensated by earning the bid-ask spread and faces the risk of adverse selection. In an AMM, liquidity providers (LPs) are compensated by fees paid when users looks to exchange or swap one cryptocurrency token for another. LPs however run the risk of impermanent loss i.e. the price ratio of staked assets in a pool changes at the time of withdrawing them from the pool.
1.2 Zero-Intelligence Models

For a comprehensive review of agent based modelling and zero-intelligence (ZI) modelling in finance see Chakraborti et al. (2011). In this section we give a an overview of the lineage of ZI models of financial markets that lead to this work. Early work in computational economics modelled order flow in a continuous double-auction market using various types of zero-intelligence traders which place orders with prices drawn iid. at random from exogenously-specified marginal supply and demand functions [Gode and Sunder (1993); Cliff and Bruten (1997)]. This was extended to a financial markets by Ladley and Schenk-Hoppé (2009) who showed that a similar model could replicate several of the empirically-observed stylized facts of financial time-series. Within econophysics this approach has been extended to incorporate the entire life-cycle of an order on a typical exchange in which both market orders and limit orders are taken into account, moreover the limit-order cancellation process is also modelled [Challet and Stinchcombe (2001); Maslov (2000); Tóth et al. (2010)]3. This interplay of random cancellation and random order-submission is modelled as an evaporation-deposition process which is able to reproduce fat-tailed return distributions, long-range correlations and a non-trivial Hurst exponent of the price signal [Maslov (2000); Preis et al. (2006, 2007)].

Mike and Farmer (2008) was one of the first models to introduce calibration of zero-intelligence models using market data. Using London Stock Exchange (LSE) order placement and cancellation data to calibrate parameters of their model, they managed to reproduce realistic spread and volatility dynamics for a group of LSE stocks. Palit et al. (2012) introduced a zero-intelligence model where the probability of different event categories, classified according to their aggressiveness, was calibrated against empirically estimated conditional-probabilities. Brandouy et al. (2012) revisited the zero-intelligence paradigm and found to get a quantitatively realistic model (i.e. replication of stylised facts) more and more constraints had to placed on zero-intelligence traders, and thus concluded although these models had insights into market microstructure, behavioural considerations were needed for useful financial engineering and predictive power. In our ZI approach we look not to replicate stylised facts to show what can be attributed to the market microstructure, but rather how market quality metrics are affected by strategic behaviour when it is removed.

Another strand of financial agent based models look at “weak-intelligence” models that model the interaction of different types of strategies for example chartist, noise and fundamental strategies [LeBaron and Yamamoto (2007, 2008); Chiarella et al. (2009)]. In the cryptocurrency space, Cocco et al. (2017) show calibrated simulated interaction between chartists and ZI traders on an order book can mimic Bitcoin prices. Angeris et al. (2021) simulate arbitrageurs, convenience traders and LPs interacting through the Uniswap V1 mechanism and show protocol prices track reference external prices in a stable manner through a range of market conditions. In this paper we take an alternative approach which is to shuffle existing order data and replay in the matching mechanism. The advantage of this very simple approach is that it enables a like-for-like comparison between the zero-intelligence data and the empirical data. By directly using empirical data as the underlying data from which to generate the zero-intelligence dataset and not drawing from preset distributions, we attempt to avoid making any unwarranted assumptions and play back realistically calibrated data into the automatic market maker (AMM) matching mechanism. We study how decomposing real markets down to zero-intelligence markets in a controlled experiment affects metrics on the profitability of liquidity providers, slippage of trades and price efficiency.
2 Simulation, Data, and Shuffling Methodology
2.1 The Uniswap Decentralised Finance Protocol

Uniswap is a constant product AMM smart contract on the Ethereum blockchain. Uniswap created by Hayden Adams, launched November 2018 and provides certain liquidity and price discovery for ERC-20 tokens. ERC-20 is the main Ethereum based standard that allows fungibility across all tokens. This standard is a set of commands that allows integration and interoperability with other ERC-20 token compliant contracts, wallets and marketplaces.

Instead of an orderbook, Uniswap operates its’ own AMM with a constant product market built on Ethereum. The constant product follows the following formula:
x∗y=k(1)

where x represents the amount of token A in the pool and y represents the amount of token B in the pool. The constant product k is termed the invariant which determines the price of A in terms of B (and vice versa) dependant on the volume wanting to be traded. This price formula graphed below in Figure 1 shows these prices change depending on the amount of a token being bought. The slope of the curve can be thought of as the spot price assuming an infinitesimally small amount is bought (or swapped as the other token is deposited or sold). However as the amount bought increases the per unit cost increases at an increasing rate to ensure that Eq. 1 holds. The constant product of the token balance thus should always equal the invariant. The term invariant is actually a misnomer as the invariant always changes slightly every trade as fees are charged for every swap. For Uniswap V1, 0.3% fees are charged. Also the invariant k increases when liquidity providers add liquidity to the AMM (i.e add quantities of both tokens to the pool) and decreases when they remove their liquidity (withdraw quantities of both tokens from the pool). Thus liquidity providers add/remove liquidity to/from both pools and liquidity takers remove liquidity in one pool in exchange for adding to another. Although Uniswap V1 and V2 is a constant product market maker (CPMM), its V3 instance launched May 2021 adds extra features e.g. the ability to submit liquidity within custom ranges that are similar to limit orders in an orderbook (Adams et al., 2020). Indeed other AMMs use variations such as constant mean market maker (CMMM), constant sum marker maker (CSMM) and constant product market maker (CPMM) pricing. This opens the door to AMMs functioning using a myriad of various hybrids amongst these pricing functions. Mohan (2022) shows these different pricing functions and various permutations can be unified in a framework as a homogeneous family of pricing functions.
.2 Simulations of Uniswap in cadCAD

Our simulations are run in cadCAD a Python package designed by BlockScience to experiment with the interaction of complex systems and agent behaviours4. We make use of their cadCAD Uniswap model that imports real data and replicates the mechanics of a real-world smart contract by replicating the smart contract Uniswap V1 Vyper code into Python. Thus the open source cadCAD model can be described as a Python “Digital Twin” representation of Uniswap that allows experimenting with historical and/or synthetic transactions5.

In our cadCAD model we make use of the open-source digital twin repository and use it as a base for our own “Shuffled Replay” model. Essentially we take the historical data, shuffle the dataset and replay it back into the Uniswap smart contract. The state output variables at each event timestep such as ETH tokens, DAI tokens, UNI supply and invariants can be analysed in each of our simulation runs. In each of the 100 Monte-Carlo simulations we shuffle the dataset with a new seed and match the output to the original timestamps. For all results from the shuffled model, we present a mean value of the calculated metric over the 100 Monte-Carlo simulations runs in Section 3. We then compare from the output of the “Digital Twin” model as our representation of the real-world metrics. We choose to use the “Digital Twin” as the original dataset exhibits many swaps (trades) with negative slippage when many events share the timestamp. Timestamps are only granular to the 1s level i.e. ‘hh:mm:ss’ format. Using the “Digital Twin” processed data, instances of negative slippage disappear.

Our model uses data from 2 November 2018 to 31 March 2020 extracted using an ETL (extraction, transformation and loading) Google big query of ETHDAI Uniswap smart contract data from the Ethereum Blockchain6. Ether (ETH) is the native cryptocurrency of the Ethereum platform. DAI is a stablecoin cryptocurrency which is engineered to keep its value as close to $1USD. In strategy performance metrics calculated later in Section 3 we convert to DAI to compare performance. With a Uniswap ETHDAI pool, liquidity providers deposit ETH and DAI tokens in the liquidity pool. In exchange they mint UNI tokens - “shares” of that Uniswap instance. Not to be confused with the Uniswap governance token, UNI here refers to the token that liquidity providers receive when they add liquidity to the pool - i.e. an accounting unit that represents pool ownership. So there are three token pools that are maintained ETH, DAI and UNI at each timestep with a balance and a delta (change from the previous timestep). Table 1 below shows the breakdown of the 177,201 different events in the dataset with their absolute counts of occurrences and their percentage share of all events during the period.

An EthPurchase removes ETH from the ETH pool and adds an amount of token DAI in exchange to the DAI pool. In the cadCAD setups (both digital twin and shuffled replay), the variable taken from the historical dataset is the DAI delta i.e. how many tokens were sold and added to the DAI pool. This goes through the Uniswap pricing function and the appropriate amount (also taking into account of 0.3% fee which reduces the quantity purchased) of ETH is removed from the pool. Analogously for TokenPurchase events, the models take the historical ETH delta i.e. how many ETH were sold and added to the ETH pool, removing the appropriate amounts of DAI from the DAI pool.

For an AddLiquidity event, the simulation takes the historical ETH delta and deposits that to the ETH pool. That same quantity is converted to DAI (price is the ratio of DAI and ETH balances states) and is also added to the DAI pool. The same occurs with the UNI pool and the same amount (ETH delta converted to UNI tokens again as a ratio of the UNI and ETH current balance states) is added or rather “minted” (as technically they hitherto did not exist) to the UNI pool. In the original real data this is represented with two events: an AddLiquidity event that adds to the ETH and DAI balances and a Transfer event that mints and adds the UNI tokens to the UNI pool. In the simulations (both original digital twin and shuffled ZI) this is all done in the same step when replaying an AddLiquidity event.

For a RemoveLiquidity event, in the real data both ETH and DAI are removed from their respective pools. Then a corresponding Transfer event removes or rather “burns” (as these coins are technically destroyed) UNI from the pool. In the simulation models, RemoveLiquidity events are processed when there is a Transfer event with a negative UNI delta. The amount of this delta is converted to ETH and DAI amounts which are also removed from the pool. In the cadCAD “digital twin” simulations, this is implemented by converting the UNI delta to a percentage burned amount as a function of the existing UNI supply. This percentage of ETH and DAI (and UNI) are removed from the pool. In the Shuffled Replay model, the simulation maintains a pointer to the original data to access the historical percentage of liquidity removed i.e. the historical UNI delta as a percentage of UNI supply at the original timestep. This percentage liquidity removed is “replayed” (albeit at its simulated shuffled event timestep) and accordingly UNI, ETH and DAI balances are removed according to that historical percentage. This ensures the simulation doesn’t go into a state of negative balances (i.e. liquidity is removed that is not there due to the shuffling) as it is always a percentage of available liquidity that is removed. The total amount of AddLiquidity and RemoveLiquidity events in the real data is 5,792 events (3,389 + 2,403). There is always a Transfer event for each of these events. There are 6,420 Transfer events. For the remaining 628 (6,420–5,792) Transfer events and 290 Approval events the real data shows 0 changes or deltas for ETH, DAI and UNI balances in the historical data so both in the real data and simulations there are essentially ineffectual and the simulation does not change any balances or prices when encountering these events.To give an idea of the level of arbitrageur strategic behaviour in the real trading activity we use an algorithm that attempts to classify Uniswap trades between convenience and arbitrage trades based on the precision of the amount of coin sold (DAI for EthPurchase and ETH for TokenPurchase). As ETH protocol dictates the minimum ETH denomination is one WEI, which is equivalent to 1E10-18 ETH.7 So the more precision the traders sells tokens with i.e. specifying more ETH up to a maximum 18 numbers the more likely the trader is an arbitrage trader as opposed to a convenience trader. The classifying algorithm we use use is a rule of four i.e. if the trader ETH or DAI delta is in the range we 1E10-1 to 1E10-4 (resp. 1E10-5 to 1E10-18) we classify the trade as a convenience (resp. arbitrage) trader.8 In Table 2 our estimates show that roughly 35% of events are convenience trades, 58% are arbitrage trades and 7% are other non swap events (i.e., either AddLiquidity, Approval or Transfer events). In Figure 2, we show the counts and percentages on the historical data per block on the Ethereum blockchain. It shows the level of arbitrage activity increasing from roughly 40–80% during the sample period. This is the type of strategic behaviour that is destroyed by our shuffling experiment and thus we can see the effect it has when removed. It is worth bearing in mind that it is not just swap/trade events (EthPurchase and TokenPurchases) that are shuffled but also liquidity providing events as well (AddLiquidity and Remove Liquidity). Thus both liquidity taking and provision roles are now acting with ZI traders9.

3.1 Liquidity Providers’ Impermanent Loss

We first show some statistical results of three different strategies measured in token DAI in Table 3. ETH Hodler is calculated by the price of ETH (in DAI) at every hour and the prices are sampled every hour and converted into annualized returns by taking the difference of logarithms of this timeseries and multiplying by 252*24. The same is done for the UNI price and a 50:50 strategy whose price is equal weighted between ETH (in DAI) and DAI. Table 3 shows higher returns in the shuffled ZI treatment possibly due to less value drain from arbitrageurs. The value of the UNI coin which can be seen as a proxy for the returns from liquidity provision are much higher. The ZI returns are much more volatile, positively skewed and non-Gaussian.

3.2 Slippage

We now investigate slippage as measured as a percentage by which the effective price exceeds the spot price. It can be calculated as a function of the amountIn traded (Ai) i.e. the amount of DAI (resp. ETH) deposited for a EthPurchase (resp. DAIPurchase) as these two quantities make up the effective price.

We use formulas for slippage used by Martinelli (2020):
S(Ai)=EPoiSP0i−1(3)

where EPoi

is the effective price i.e. the ratio of DAI (resp. ETH) delta divided by the ETH (resp. DAI) delta for EthPurchases (resp. TokenPurchases). As in Martinelli (2020) this can be formalised as:
EPoi=AiAo(4)

where the effective price is the ratio of amount of tokens trader deposited (amountIn: Ai) divided by the amount of the other token they bought in return (amountOut: Ao) i.e. essentially the average price that was actually paid. Note as we are using ETH and DAI deltas from data already calculated from the trades run through the protocol (either real or simulated) this already takes into account the 0.3% fees.

SP0i

is the spot price which can be thought of the fictitious price if an infinitesimally small amount is purchased (and does not incur slippage). This can be calculated as shown in Eq. 5:
SP0i=BiBo⋅11−fee(5)

which is the ratio of amount of ETH (resp. DAI) pool balance divided by the amount DAI (resp. ETH) pool balance for TokenPurchases (resp. EthPurchases) adjusted up by the 0.3% fee. Table 6 shows that in the digital twin slippage for TokenPurchase and EthPurchases (around 0.12%) was lower than the ZI model slippage (around 0.20%). The slippage metrics again fall outside the shuffled treatment 95% confidence levels again showing this difference is significant. This intuitively makes sense as with the lack of strategic behaviour in the ZI model, traders are no longer conditioning their trading decision on the available liquidity and their immediate price impact. Although in the Shuffled Replay some trades in the simulation may benefit from randomly larger pools, the results show on average traders pay higher slippage.

3.3 Pricing Efficiency

Finally in Table 7 we use a common variance ratio (VR) measure for informational efficiency [see e.g. Comerton-Forde et al. (2019); Schwartz (2021)]:
|1−VR|=∣∣1−σ230min6σ25min∣∣(6)

where σ25min
represents a short term volatility of returns and σ230min a longer term volatility of returns. The scaled ratio of these two volatilities in a random walk (which we assume a perfectly efficient market follows) would be equal to 1. So in Eq. 6 we measure the absolute value of the deviation of this scaled ratio from one and lower numbers for the metric are associated with more efficiency. Our results show the shuffled ZI Model has prices closer to a random walk. This is contrast to evidence showing that feeding ZI flow into order books results in more short term predictability than real markets despite the random order flow see (Daniels et al., 2003; Smith et al., 2003). This argues (Bouchaud et al., 2009) is due to the slow way order books stores and processes supply and demand.

Of course, we cannot say our ZI model is more informationally efficient as we are not incorporating information or any fundamental value in a ZI simulation, but it shows evidence in the real AMM market that the effect of strategic behaviour also adds noise and inefficiency to the prices even though in an AMM, the strategic behaviour of arbitrageurs is assumed primarily to make prices more informationally efficient. We leave the study of DEX arbitrageurs on cryptocurrency price discovery for future work.
4 Conclusion

In this paper we have developed a novel type of zero-intelligence (ZI) model that involves shuffling historical data and feeding it back into the market matching mechanism. In this case we have used it to analyse an Automatic Market Maker (AMM) in the cryptofinance space. ZI analysis allows us to investigate effects of the mechanism design without strategic behaviour. Traditionally in the ZI literature replicating realism e.g., observed stylised facts, is a methodology to link certain attributes of financial markets to the mechanism design or considerations beyond strategic behaviour. In the past ZI models have had some success in replicating some stylised facts. In a universe of a large set of agents with heterogeneous strategies and responses, the collective trade generating behaviour could indeed be random. However, it is intuitive to assume trade actions by specific agents are typically done in response to specific prices. This is especially so in cryptocurrency AMMs dependant on arbitrageurs for price discovery. By showing statistically significant differences between our ZI model and the real data (i.e. what realism is removed) we can highlight the effect of strategic behaviour on important market quality metrics. We have shown evidence that strategic behaviour/interaction (between LPs, arbitrageurs, and convenience traders) reduces LP returns, reduces slippage/price impact and decreases price efficiency.

Extensions to this work could include adding arbitrageur agents interacting with a historical oracle centralised exchange (CEX) ETH-USD price feed to analyse in a structured way their value-drain on an AMM. These arbitrage agents could strategically enter swaps with calculated amount sizes to move prices back to a reference price signal. Other extensions could be to restrict shuffling locally within blockchain blocks or to apply to other AMM protocols such as a Balancer pool which might have an uneven weighted (e.g. 80:20) and/or multi-coin pool structure. The baseline ZI model presented here could also be used to incorporate a simulation parameter sweep of different fees or intelligent agents. This could be in the form of genetic algorithms or reinforcement-learning agents to model the effect of intelligent agents on the same metrics of impermanent loss, slippage and price efficiency studied in this paper.

What Is Uniswap (UNI)?

Uniswap is a decentralized protocol that enables users to trade Ethereum tokens. The protocol is powered by the Ethereum blockchain and allows anyone to create a market for any ERC20 token. Uniswap was launched in November 2018 and has become one of the most popular protocols on the Ethereum network.

Uniswap is often described as the leading DEX on the Ethereum blockchain. A DEX is a decentralized exchange that does not rely on a third party to hold the user’s funds. Instead, the users themselves are responsible for their own funds. This is done by using smart contracts that are stored on the blockchain.

The main advantage of a DEX is that it is much more secure than a centralized exchange. This is because there is no central point of failure that can be hacked.

Additionally, DEXes are much more censorship-resistant than centralized exchanges. This is because there is no central authority that can decide to delist a token. For example, a centralized exchange can decide to delist a token if it does not agree with the project’s philosophy or if the token does not meet the exchange’s listing requirements. However, a DEX cannot do this because it is decentralized.

The protocol’s popularity can be attributed to its ease of use and utility. Uniswap does not require users to have an account or go through Know-Your-Customer (KYC) verification. Moreover, the protocol does not charge any fees for trades. Rather, it collects a 0.3% fee from each trade that goes towards rewarding liquidity providers. Liquidity providers are users who add capital to the Uniswap pool and earn a portion of the fees collected by the protocol.

In simple terms, Uniswap is a decentralized exchange that allows users to trade Ethereum tokens without the need for an account or fees. The protocol is powered by the Ethereum blockchain and enables anyone to create a market for any ERC20 token. This benefits both users and developers as it makes it easy to trade any token on the Ethereum network.

For example, let’s say you want to trade two ERC20 tokens, Token A and Token B. Uniswap would allow you to do so without the need for an account or fees.

In addition, the protocol also enables developers to create markets for their tokens without the need to list them on an exchange. Many newly launched tokens use Uniswap as their primary method of trading. This is because the process of listing on exchanges can be both time-consuming and expensive. Thus, Uniswap provides a much-needed service to the Ethereum ecosystem.

The UNI token is used for voting on governance proposals and to provide liquidity to the Uniswap protocol. Some decisions that UNI token holders can decide on are whether to add new features to the protocol or to change the fee structure.

The token was launched via an airdrop in September 2020 and has a total supply of 1,000,000,000 UNI. Once the 1 billion tokens are distributed, UNI will become inflationary at a fixed 2%. This is important to note because inflation will go towards rewarding liquidity providers. In other words, UNI holders who provide liquidity to the protocol will earn a portion of the newly minted UNI. New rewards are needed because the protocol currently relies on trading fees to reward liquidity providers.

To summarize, the UNI token is an important part of the Uniswap ecosystem as it is the incentivizing factor for users to provide liquidity to the protocol. Moreover, UNI holders play a crucial role in governance as they are the ones who decide on the future of the protocol.
How Does Uniswap Work?

Uniswap works by using a smart contract that is deployed on the Ethereum blockchain. The smart contract allows users to trade ERC20 tokens without the need for an exchange. When a user wants to trade one token for another, they simply send their chosen tokens to the Uniswap smart contract. The smart contract then calculates the amount of the second token that the user will receive based on the current market price.

The key feature of Uniswap is its decentralized nature. Unlike traditional exchanges, Uniswap does not have a centralized order book. Rather, it relies on liquidity pools to determine prices and execute trades. A liquidity pool is a pool of capital that is used to provide liquidity to a market.

Uniswap uses something called an automated market maker (AMM) to determine prices and execute trades. An AMM is a type of algorithm that automatically sets prices based on the supply and demand of a market. The key advantage of an AMM is that it does not require a centralized order book. This makes it much more resistant to manipulation.

The Uniswap protocol also has a built-in incentive for users to provide liquidity. Uniswap has a 0.3% fee for cryptocurrency swaps. A liquidity provider is a user who provides capital to a liquidity pool. In return for their contribution, they earn a portion of the fees collected by the protocol.

Liquidity providers are essential because they contribute to the pool by depositing their cryptocurrencies into it. This is important because, without liquidity providers, the Uniswap protocol would not be able to function. There would not be enough capital in the pools to enable trades.

To provide liquidity to a pool, a user must deposit an equal value of both tokens into the pool. For example, if a user wants to provide liquidity to the ETH/DAI pool, they must deposit 1 ETH and 1 DAI into the pool. The user will then earn a portion of the fees collected by the pool.

Liquidity providers will receive Uniswap (LP) tokens with each liquidity-providing transaction. These tokens are used to help track the duration and amount of liquidity provided to the protocol. This ensures that liquidity providers receive the proper share of the fees they are entitled to.

This system is automated by the use of smart contracts. The main advantage of this system is that it eliminates the need for a centralized exchange. This makes Uniswap much more resistant to manipulation and attack. Uniswap only works with ERC20 tokens. This is because the protocol is based on the Ethereum blockchain.

The UNI token also helps to decentralize the governance of the Uniswap protocol. As mentioned earlier, the protocol works because the UNI token gives holders voting rights on proposals that can change the protocol. However, the UNI token is not required to use the Uniswap protocol.
Uniswap Fun Facts

    300+ dApp integrations
    $1.1T+ trade volume through Uniswap
    315,024 total addresses of UNI holders
    There’s a circulating supply of 734,135,451 UNI coins according to CoinMarketCap

    The Story of Uniswap (UNI)

    Uniswap was created by an Ethereum developer named Hayden Adams. Originally known as Unipeg, the DEX was inspired by Ethereum’s creator’s (Vitalik Buterin) blog posts. After researching the Ethereum blockchain, it was realized that there was a need for a decentralized exchange. This reason was that as more dApps began to launch on the Ethereum network, there was a need for a way to easily trade the different cryptocurrencies.
    
    Shortly after the creation of Uniswap, it became a DAO (Decentralized Autonomous Organization). This means that it is governed by a group of people rather than a single entity. The UNI token was created in September of 2020. This token is used to help decentralize the governance of the Uniswap protocol.
    
    The first version of Uniswap was launched on the Ethereum mainnet in November of 2018. The protocol was created as a way to facilitate the trading of ERC20 tokens.
    
    Uniswap has since gone through two more upgrades. Uniswap V2 introduced helpful features like ERC-20 pairs (previously only ETH was supported), flash swaps (instantaneous trades), and price oracles (to help stabilize pricing).
    
    The most recent version, Uniswap V3, was launched in May of 2021. This new version introduces numerous improvements. Users will notice a better infrastructure, experience more precise execution of trades, and liquid providers can have received better efficiencies.
    
    Overall, the story of Uniswap has been one of success. Although they may not be the newest and flashiest project in the space, they have consistently provided a much-needed service. It will be interesting to see how they continue to evolve in the future. Exchanging crypto assets will always be a complex endeavor, but Uniswap has shown that it is up for the challenge. It provides a much-needed service and UNI tokens are the reward for those who help power the protocol.

    Ain’t nobody got time for double negatives…said no grammar pedant ever. To a prescriptivist, using double negatives for actually emphasizing more negation is just the worst. If I’m not saying nothing, obviously I must be saying something. As the assumption goes, because two negatives must logically cancel each other out, people who use double negatives in this way must also logically be uneducated or unintelligent. This, of course, is a false belief that is still widely shared in mainstream American culture (possibly even among speakers who regularly use double negation themselves).

Like many language myths that are still fervently repeated, it’s only since the eighteenth century that we became loath to use double negatives in this way (no thanks for nothing to the grammarian Robert Lowth) and to consider it wrong and illogical. Before then, speakers were using double negatives illogically daily (and probably twice on Sundays), from Chaucer to Shakespeare and many others. Surprisingly, it was not impossible that people could have no trouble understanding each other whatsoever. Nevertheless, standard English speech finally rid itself of this turbulent double negation, until it is now seen as not merely ungrammatical—it’s also socially unacceptable.
It still is very much the case that many people, without thinking, can harbor negative assumptions about the different ways other people speak.

Well, why does this matter? As flippantly as we can talk of language myths, put simply, what’s widely considered bad grammar, or bad language, can have truly problematic repercussions for how many people live, especially for those who speak dialects that aren’t considered standard, mainstream, or prestigious. It still is very much the case that many people, without thinking, can harbor negative assumptions about the different ways other people speak. This can have a profound effect on how whole speech communities can live, learn, work, and even play. Getting job interviews, renting an apartment, raising kids to have better options and advantages, even getting through an unexpected, fraught interaction with the police—all these things can be made much harder simply because of a particular accent or dialect.

African American Vernacular English (AAVE) speech or Black English (often used as an umbrella term for the many varieties of speech used by African American communities) is a prime example of how a regular way of speaking can have a major impact on people’s lives. On absolutely no scientific basis, linguistically consistent grammatical features like double negatives, along with other marked grammatical differences to standard American English, such as use of habitual be, as in “he be walkin’,” or perfective, as in “he done did it,” have stigmatized the speakers of Black English as linguistically backward, uneducated, or unintelligent.

Aave is a decentralized finance (DeFi) protocol that lets people lend and borrow cryptocurrencies and real-world assets (RWAs) without having to go through a centralized intermediary. When they lend, they earn interest; when they borrow, they pay interest.

Aave was originally built atop the Ethereum network, with all the tokens on the network also using the Ethereum blockchain

to process transactions; they are known as ERC20 tokens. Aave has since expanded to other chains, including Avalanche, Fantom, and Harmony.

The protocol itself uses a decentralized autonomous organization, or DAO. That means it’s operated and governed by the people who hold—and vote with—AAVE tokens.

How lending works on Aave

Traditionally, to get a loan, you'd need to go to a bank or other financial institution with lots of liquid cash. The bank will ask for collateral—in the case of a car loan, that would be the car title itself—in exchange for the loan. You then pay the principal to the bank every month, plus interest.

DeFi is different. There is no bank. Instead, smart contracts (which are computer codes that automate transactions, such as selling if a token price reaches a certain threshold) do the heavy lifting. DeFi removes the middlemen from asset-trading, futures contracts, and savings accounts.

In practice, that means that you can get a loan—in cryptocurrency—from people instead of financial institutions. However, you still have to put up collateral. In a DeFi system that tries to be fiat-free, that means other cryptocurrency tokens.

And because cryptocurrency is so volatile, many DeFi platforms demand overcollateralization. So, for a $500 crypto loan on Aave, you'd need to put up more than that amount in a different cryptocurrency. If the price plummets and the amount in collateral no longer covers the amount you've borrowed, your collateral can be liquidated, meaning the protocol takes it to cover the cost of your loan.

Aave currently has pools for 30 Ethereum-based assets, including the stablecoins Tether, DAI, USD Coin, and Gemini dollar. Other markets include Avalanche, Fantom, Harmony, and Polygon, among others.

Aave also provides pools for real-world assets, like real estate, cargo and freight invoices, and payment advances. For such pools, a partner company called Centrifuge helps brick-and-mortar businesses tokenize aspects of their operations. Once tokenized, investors can purchase (or hold as collateral) these tokens, which behave similar to bonds and earn a yield on their holdings. Thus, these assets can be used as collateral for real-world businesses to borrow cash.
Why would you want to borrow cryptocurrency?

Although it often makes more sense to buy or sell cryptocurrency, borrowing it can be practical in some circumstances. One of the most obvious is for arbitrage. If you see a token trading at different rates on different exchanges, you can make money by buying it at one place and selling it at another.

However, since differences tend to be minor after taking into account transaction fees and spreads, you'd have to have a lot of the cryptocurrency to turn a decent profit.

That's where Aave's flash loans come in. Aave pioneered the use of flash loans, in which people borrow cryptocurrency without collateral, use it to buy an asset, sell that asset, and then return the original amount in the same transaction while pocketing their profit.
How liquidity pools work

Let's go back to DeFi. In the early days of decentralized finance, if you wanted to borrow an asset, you'd have to find someone on the platform to lend it to you—at a price and terms you both agreed upon.

Things have evolved since then.

Aave skips the whole process of peer-to-peer lending, instead opting for what amounts to pool-to-peer lending.


Here's how that works: Users deposit digital assets into "liquidity pools." These become funds that the protocol can then lend out. Anyone who deposits their tokens into a pool and thereby "provides liquidity," receives new aTokens. (The "a" is for "Aave.") So, if you deposit DAI to the liquidity pool, you'll receive aDAI in return.

As an aToken holder, you'll get a cut of the platform's flash loans as well as interest on those aTokens. If you're depositing tokens to a pool that already has a lot of surplus liquidity, you won't earn much. But if you're depositing tokens the protocol is in desperate need of, you'll make more.

The same applies to borrowers—interest rates vary depending on what you're borrowing.

In March 2022, Aave launched v3 of the protocol, which includes a feature called Portal. Portal allows Aave to operate seamlessly across all blockchains. That means using Aave, you can now participate in lending or borrowing protocols on chains like Solana or Avalanche.

Why doesn't everybody do it?

A couple of reasons. First, you must transfer cryptocurrency into Aave in order to start using the platform; you can't just buy it with a credit or debit card. (And when Ethereum transaction costs are high, some people are hesitant to move smaller amounts).

Second, there's an element of risk involved, and liquidations are a key part of how Aave manages debt and makes sure people can still get loans. If there's still not enough liquidity after collateral is liquidated, Aave has a failsafe, known as the Safety Module. Inside this pool are AAVE tokens that users have deposited. If everything is calm, they receive more AAVE as compensation. If the system needs an injection of capital, it will liquidate the AAVE tokens.
What's the AAVE token used for?

AAVE tokens are used to govern the Aave protocol. Holders of AAVE tokens can vote on the direction of Aave, and how to manage the protocol’s funds. Each AAVE token equals one vote.

Users can also post AAVE tokens as collateral. When they do, their borrowing limits are raised. Those who borrow AAVE can also bypass the borrowing fees and get a discount on fees if they post it as collateral.

As AAVE the token is tied to Aave the DeFi protocol, the token is one of the largest DeFi coins by market cap.
Aave continues to develop its DeFi ecosystem. In July 2022, Aave's community approved a proposal to launch the network's own stablecoin, GHO.

99.9% of voters backed the proposal, which will see GHO launch as an overcollateralized stablecoin pegged to the U.S. dollar and backed by a "diversified set of crypto-assets."

According to the proposal, the introduction of GHO would make stablecoin borrowing on the Aave Protocol "more competitive," as well as generating extra revenue for Aave's DAO by "sending 100% of interest payments on GHO borrows to the DAO.”
Aave Companies further promised that “significant risk mitigation features” would be in place to prevent too much GHO from being minted.

Aave is also branching out beyond DeFi with the launch of Lens Protocol, a Polygon-based decentralized social media platform that lets users store their content as NFTs.
Swaps
Introduction

Swaps are the most common way of interacting with the Uniswap protocol. For end-users, swapping is straightforward: a user selects an ERC-20 token that they own and a token they would like to trade it for. Executing a swap sells the currently owned tokens for the proportional1 amount of the tokens desired, minus the swap fee, which is awarded to liquidity providers2. Swapping with the Uniswap protocol is a permissionless process.

    note: Using web interfaces (websites) to swap via the Uniswap protocol can introduce additional permission structures, and may result in different execution behavior compared to using the Uniswap protocol directly. To learn more about the differences between the protocol and a web interface, see What is Uniswap.

Swaps using the Uniswap protocol are different from traditional order book trades in that they are not executed against discrete orders on a first-in-first-out basis — rather, swaps execute against a passive pool of liquidity, with liquidity providers earning fees proportional to their capital committed
Price Impact

In a traditional order-book market, a sizeable market-buy order may deplete the available liquidity of a prior limit-sell and continue to execute against a subsequent limit-sell order at a higher price. The result is the final execution price of the order is somewhere in between the two limit-sell prices against which the order was filled.

Price impact affects the execution price of a swap similarly but is a result of a different dynamic. When using an automated market maker, the relative value of one asset in terms of the other continuously shifts during the execution of a swap, leaving the final execution price somewhere between where the relative price started - and ended.

This dynamic affects every swap using the Uniswap protocol, as it is an inextricable part of AMM design.

As the amount of liquidity available at different price points can vary, the price impact for a given swap size will change relative to the amount of liquidity available at any given point in price space. The greater the liquidity available at a given price, the lower the price impact for a given swap size. The lesser the liquidity available, the higher the price impact.

Approximate3 price impact is anticipated in real-time via the Uniswap interface, and warnings appear if unusually high price impact will occur during a swap. Anyone executing a swap will have the ability to assess the circumstances of price impact when needed.
Slippage

The other relevant detail to consider when approaching swaps with the Uniswap protocol is slippage. Slippage is the term we use to describe alterations to a given price that could occur while a submitted transaction is pending.

When transactions are submitted to Ethereum, their order of execution is established by the amount of "gas" offered as a fee for executing each transaction. The higher the fee offered, the faster the transaction is executed. The transactions with a lower gas fee will remain pending for an indeterminate amount of time. During this time, the price environment in which the transaction will eventually be executed will change, as other swaps will be taking place.

Slippage tolerances establish a margin of change acceptable to the user beyond price impact. As long as the execution price is within the slippage range, e.g., %1, the transaction will be executed. If the execution price ends up outside of the accepted slippage range, the transaction will fail, and the swap will not occur.

A comparable situation in a traditional market would be a market-buy order executed after a delay. One can know the expected price of a market-buy order when submitted, but much can change in the time between submission and execution.
Safety Checks

Price impact and slippage can both change while a transaction is pending, which is why we have built numerous safety checks into the Uniswap protocol to protect end-users from drastic changes in the execution environment of their swap. Some of the most commonly encountered safety checks:

    Expired : A transaction error that occurs if a swap is pending longer than a predetermined deadline. The deadline is a point in time after which the swap will be canceled to protect against unusually long pending periods and the changes in price that typically accompany the passage of time.

    INSUFFICIENT_OUTPUT_AMOUNT : When a user submits a swap, the Uniswap interface will send an estimate of how much of the purchased token the user should expect to receive. If the anticipated output amount of a swap does not match the estimate within a certain margin of error (the slippage tolerance), the swap will be canceled. This attempts to protect the user from any drastic and unfavorable price changes while their transaction is pending.

    Proportional in this instance takes into account many factors, including the relative price of one token in terms of the other, slippage, price impact, and other factors related to the open and adversarial nature of Ethereum.↩
    For information about liquidity provision, see the liquidity user guide↩
    The Uniswap interface informs the user about the circumstances of their swap, but it is not guaranteed.↩
    
    Introduction

    The defining idea of Uniswap v3 is concentrated liquidity: liquidity that is allocated within a custom price range. In earlier versions, liquidity was distributed uniformly along the price curve between 0 and infinity.
    
    The previously uniform distribution allowed trading across the entire price interval (0, ∞) without any loss of liquidity. However, in many pools, the majority of the liquidity was never used.
    
    Consider stablecoin pairs, where the relative price of the two assets stays relatively constant. The liquidity outside the typical price range of a stablecoin pair is rarely touched. For example, the v2 DAI/USDC pair utilizes ~0.50% of the total available capital for trading between $0.99 and $1.01, the price range in which LPs would expect to see the most volume - and consequently earn the most fees.
    
    With v3, liquidity providers may concentrate their capital to smaller price intervals than (0, ∞). In a stablecoin/stablecoin pair, for example, an LP may choose to allocate capital solely to the 0.99 - 1.01 range. As a result, traders are offered deeper liquidity around the mid-price, and LPs earn more trading fees with their capital. We call liquidity concentrated to a finite interval a position. LPs may have many different positions per pool, creating individualized price curves that reflect the preferences of each LP.
    Active Liquidity
    
    As the price of an asset rises or falls, it may exit the price bounds that LPs have set in a position. When the price exits a position's interval, the position's liquidity is no longer active and no longer earns fees.
    
    As price moves in one direction, LPs gain more of the one asset as swappers demand the other, until their entire liquidity consists of only one asset. (In v2, we don't typically see this behavior because LPs rarely reach the upper or lower bound of the price of two assets, i.e., 0 and ∞). If the price ever reenters the interval, the liquidity becomes active again, and in-range LPs begin earning fees once more.
    
    Importantly, LPs are free to create as many positions as they see fit, each with its own price interval. Concentrated liquidity serves as a mechanism to let the market decide what a sensible distribution of liquidity is, as rational LPs are incentivize to concentrate their liquidity while ensuring that their liquidity remains active.
    Ticks
    
    To achieve concentrated liquidity, the once continuous spectrum of price space has been partitioned with ticks.
    
    Ticks are the boundaries between discrete areas in price space. Ticks are spaced such that an increase or decrease of 1 tick represents a 0.01% increase or decrease in price at any point in price space.
    
    Ticks function as boundaries for liquidity positions. When a position is created, the provider must choose the lower and upper tick that will represent their position's borders.
    
    As the spot price changes during swapping, the pool contract will continuously exchange the outbound asset for the inbound, progressively using all the liquidity available within the current tick interval1 until the next tick is reached. At this point, the contract switches to a new tick and activates any dormant liquidity within a position that has a boundary at the newly active tick.
    
    While each pool has the same number of underlying ticks, in practice only a portion of them are able to serve as active ticks. Due to the nature of the v3 smart contracts, tick spacing is directly correlated to the swap fee. Lower fee tiers allow closer potentially active ticks, and higher fees allow a relatively wider spacing of potential active ticks.
    
    While inactive ticks have no impact on transaction cost during swaps, crossing an active tick does increase the cost of the transaction in which it is crossed, as the tick crossing will activate the liquidity within any new positions using the given tick as a border.
    
    In areas where capital efficiency is paramount, such as stable coin pairs, narrower tick spacing increases the granularity of liquidity provisioning and will likely lower price impact when swapping - the result being significantly improved prices for stable coin swaps.
    
    For more information on fee levels and their correlation to tick spacing, see the whitepaper.

    Fees
Swap Fees

Swap fees are distributed pro-rata to all in-range1 liquidity at the time of the swap. If the spot price moves out of a position’s range, the given liquidity is no longer active and does not generate any fees. If the spot price reverses and reenters the position’s range, the position’s liquidity becomes active again and will generate fees.

Swap fees are not automatically reinvested as they were in previous versions of Uniswap. Instead, they are collected separately from the pool and must be manually redeemed when the owner wishes to collect their fees.
Pool Fees Tiers

Uniswap v3 introduces multiple pools for each token pair, each with a different swapping fee. Liquidity providers may initially create pools at three fee levels: 0.05%, 0.30%, and 1%. More fee levels may be added by UNI governance, e.g. the 0.01% fee level added by this governance proposal in November 2021, as executed here.

Breaking pairs into separate pools was previously untenable due to the issue of liquidity fragmentation. Any incentive alignments achieved by more fee optionality invariably resulted in a net loss to traders, due to lower pairwise liquidity and the resulting increase in price impact upon swapping.

The introduction of concentrated liquidity decouples total liquidity from price impact. With price impact concerns out of the way, breaking pairs into multiple pools becomes a feasible approach to improving the functionality of a pool for assets previously underserved by the 0.30% swap fee.
Finding The Right Pool Fee

We anticipate that certain types of assets will gravitate towards specific fee tiers, based on where the incentives for both swappers and liquidity providers come nearest to alignment.

We expect low volatility assets (stable coins) will likely congregate in the lowest fee tier, as the price risk for liquidity providers holding these assets is very low, and those swapping will be motivated to pursue an execution price closest to 1:1 as they can get.

Similarly, we anticipate more exotic assets, or those traded rarely, will naturally gravitate towards a higher fee - as liquidity providers will be motivated to offset the cost risk of holding these assets for the duration of their position.
Protocol Fees
Uniswap v3 has a protocol fee that can be turned on by UNI governance. Compared to v2, UNI governance has more flexibility in choosing the fraction of swap fees that go to the protocol. For details regarding the protocol fee, see the whitepaper.

Range Orders

Customizable liquidity positions, along with single-sided asset provisioning, allow for a new style of swapping with automated market makers: the range order.

In typical order book markets, anyone can easily set a limit order: to buy or sell an asset at a specific predetermined price, allowing the order to be filled at an indeterminate time in the future.

With Uniswap V3, one can approximate a limit order by providing a single asset as liquidity within a specific range. Like traditional limit orders, range orders may be set with the expectation they will execute at some point in the future, with the target asset available for withdrawal after the spot price has crossed the full range of the order.

Unlike some markets where limit orders may incur fees, the range order maker generates fees while the order is filled. This is due to the range order technically being a form of liquidity provisioning rather than a typical swap.
Possibilities of Range orders

The nature of AMM design makes some styles of limit orders possible, while others cannot be replicated. The following are four examples of range orders and their traditional counterparts; the first two are possible, the second two are not.

  One important distinction: range orders, unlike traditional limit orders, will be unfilled if the spot price crosses the given range and then reverses to recross in the opposite direction before the target asset is withdrawn. While you will be earning LP fees during this time, if the goal is to exit fully in the desired destination asset, you will need to keep an eye on the order and either manually remove your liquidity when the order has been filled or use a third party position manager service to withdraw on your behalf.
  The Aavenomics introduce a formalized path to the decentralization and autonomy of the Aave Protocol. Covering governance mechanisms and financial incentives, it aims to share a vision of alignment between various stakeholders within the Aave ecosystem, protocol functionality and the AAve token as a core securing element of the Aave Protocol.

  A blockchain is a public database that is updated and shared across many computers in a network.

"Block" refers to data and state being stored in consecutive groups known as "blocks". If you send ETH to someone else, the transaction data needs to be added to a block to be successful.

"Chain" refers to the fact that each block cryptographically references its parent. In other words, blocks get chained together. The data in a block cannot change without changing all subsequent blocks, which would require the consensus of the entire network.

Every computer in the network must agree upon each new block and the chain as a whole. These computers are known as "nodes". Nodes ensure everyone interacting with the blockchain has the same data. To accomplish this distributed agreement, blockchains need a consensus mechanism.

Ethereum uses a proof-of-stake-based consensus mechanism. Anyone who wants to add new blocks to the chain must stake ETH - the native currency in Ethereum - as collateral and run validator software. These "validators" can then be randomly selected to propose blocks that other validators check and add to the blockchain. There is a system of rewards and penalties that strongly incentivize participants to be honest and available online as much as possible.

If you would like to see how blockchain data is hashed and subsequently appended to the history of block references, be sure to check out this demo(opens in a new tab)↗ by Anders Brownworth and watch the accompanying video below.

Watch Anders explain hashes in blockchains:


Ethereum is a blockchain with a computer embedded in it. It is the foundation for building apps and organizations in a decentralized, permissionless, censorship-resistant way.

In the Ethereum universe, there is a single, canonical computer (called the Ethereum Virtual Machine, or EVM) whose state everyone on the Ethereum network agrees on. Everyone who participates in the Ethereum network (every Ethereum node) keeps a copy of the state of this computer. Additionally, any participant can broadcast a request for this computer to perform arbitrary computation. Whenever such a request is broadcast, other participants on the network verify, validate, and carry out ("execute") the computation. This execution causes a state change in the EVM, which is committed and propagated throughout the entire network.

Requests for computation are called transaction requests; the record of all transactions and the EVM's present state gets stored on the blockchain, which in turn is stored and agreed upon by all nodes.

Cryptographic mechanisms ensure that once transactions are verified as valid and added to the blockchain, they can't be tampered with later. The same mechanisms also ensure that all transactions are signed and executed with appropriate "permissions" (no one should be able to send digital assets from Alice's account, except for Alice herself).
  
Ether (ETH) is the native cryptocurrency of Ethereum. The purpose of ETH is to allow for a market for computation. Such a market provides an economic incentive for participants to verify and execute transaction requests and provide computational resources to the network.

Any participant who broadcasts a transaction request must also offer some amount of ETH to the network as a bounty. The network will award this bounty to whoever eventually does the work of verifying the transaction, executing it, committing it to the blockchain, and broadcasting it to the network.

The amount of ETH paid corresponds to the resources required to do the computation. These bounties also prevent malicious participants from intentionally clogging the network by requesting the execution of infinite computation or other resource-intensive scripts, as these participants must pay for computation resources.

ETH is also used to provide crypto-economic security to the network in three main ways: 1) it is used as a means to reward validators who propose blocks or call out dishonest behavior by other validators; 2) It is staked by validators, acting as collateral against dishonest behavior—if validators attempt to misbehave their ETH can be destroyed; 3) it is used to weigh 'votes' for newly proposed blocks, feeding into the fork-choice part of the consensus mechanism.
What are smart contracts?

In practice, participants don't write new code every time they want to request a computation on the EVM. Rather, application developers upload programs (reusable snippets of code) into EVM state, and users make requests to execute these code snippets with varying parameters. We call the programs uploaded to and executed by the network smart contracts.

At a very basic level, you can think of a smart contract like a sort of vending machine: a script that, when called with certain parameters, performs some actions or computation if certain conditions are satisfied. For example, a simple vendor smart contract could create and assign ownership of a digital asset if the caller sends ETH to a specific recipient.

Any developer can create a smart contract and make it public to the network, using the blockchain as its data layer, for a fee paid to the network. Any user can then call the smart contract to execute its code, again for a fee paid to the network.

Thus, with smart contracts, developers can build and deploy arbitrarily complex user-facing apps and services such as: marketplaces, financial instruments, games, etc.

A cryptocurrency is a medium of exchange secured by a blockchain-based ledger.

A medium of exchange is anything widely accepted as payment for goods and services, and a ledger is a data store that keeps track of transactions. Blockchain technology allows users to make transactions on the ledger without reliance upon a trusted third party to maintain the ledger.

The first cryptocurrency was Bitcoin, created by Satoshi Nakamoto. Since Bitcoin's release in 2009, people have made thousands of cryptocurrencies across many different blockchains.
Ether (ETH) is the cryptocurrency used for many things on the Ethereum network. Fundamentally, it is the only acceptable form of payment for transaction fees, and after The Merge, ether is required to validate and propose blocks on Mainnet. Ether is also used as a primary form of collateral in the DeFi lending markets, as a unit of account in NFT marketplaces, as payment earned for performing services or selling real-world goods, and more.

Ethereum allows developers to create decentralized applications (dapps), which all share a pool of computing power. This shared pool is finite, so Ethereum needs a mechanism to determine who gets to use it. Otherwise, a dapp could accidentally or maliciously consume all network resources, which would block others from accessing it.

The ether cryptocurrency supports a pricing mechanism for Ethereum's computing power. When users want to make a transaction, they must pay ether to have their transaction recognized on the blockchain. These usage costs are known as gas fees, and the gas fee depends on the amount of computing power required to execute the transaction and the network-wide demand for computing power at the time.

Therefore, even if a malicious dapp submitted an infinite loop, the transaction would eventually run out of ether and terminate, allowing the network to return to normal.

It is common(opens in a new tab)↗ to(opens in a new tab)↗ conflate(opens in a new tab)↗ Ethereum and ether — when people reference the "price of Ethereum," they are describing the price of ether.

Minting ether

Minting is the process in which new ether gets created on the Ethereum ledger. The underlying Ethereum protocol creates the new ether, and it is not possible for a user to create ether.

Ether is minted as a reward for each block proposed and at every epoch checkpoint for other validator activity related to reaching consensus. The total amount issued depends on the number of validators and how much ether they have staked. This total issuance is divided equally among validators in the ideal case that all validators are honest and online, but in reality, it varies based on validator performance. About 1/8 of the total issuance goes to the block proposer; the remainder is distributed across the other validators. Block proposers also receive tips from transaction fees and MEV-related income, but these come from recycled ether, not new issuance.
As well as creating ether through block rewards, ether can be destroyed through a process called 'burning'. When ether gets burned, it gets removed from circulation permanently.

Ether burn occurs in every transaction on Ethereum. When users pay for their transactions, a base gas fee, set by the network according to transactional demand, gets destroyed. This, coupled with variable block sizes and a maximum gas fee, simplifies transaction fee estimation on Ethereum. When network demand is high, blocks(opens in a new tab)↗ can burn more ether than they mint, effectively offsetting ether issuance.

Burning the base fee hinders a block producers ability to manipulate transactions. For example, if block producers received the base fee, they could include their own transactions for free and raise the base fee for everyone else. Alternatively, they could refund the base fee to some users off-chain, leading to a more opaque and complex transaction fee market.

Definition of a dapp

A dapp has its backend code running on a decentralized peer-to-peer network. Contrast this with an app where the backend code is running on centralized servers.

A dapp can have frontend code and user interfaces written in any language (just like an app) to make calls to its backend. Furthermore, its frontend can get hosted on decentralized storage such as IPFS(opens in a new tab)↗.

  Decentralized - dapps operate on Ethereum, an open public decentralized platform where no one person or group has control
  Deterministic - dapps perform the same function irrespective of the environment in which they get executed
  Turing complete - dapps can perform any action given the required resources
  Isolated - dapps are executed in a virtual environment known as Ethereum Virtual Machine so that if the smart contract has a bug, it won’t hamper the normal functioning of the blockchain network

  On smart contracts

  To introduce dapps, we need to introduce smart contracts – a dapp's backend for lack of a better term. For a detailed overview, head to our section on smart contracts.
  
  A smart contract is code that lives on the Ethereum blockchain and runs exactly as programmed. Once smart contracts are deployed on the network you can't change them. Dapps can be decentralized because they are controlled by the logic written into the contract, not an individual or company. This also means you need to design your contracts very carefully and test them thoroughly.
  
  Benefits of dapp development 

  Zero downtime – Once the smart contract is deployed on the blockchain, the network as a whole will always be able to serve clients looking to interact with the contract. Malicious actors, therefore, cannot launch denial-of-service attacks targeted towards individual dapps.
  Privacy – You don’t need to provide real-world identity to deploy or interact with a dapp.
  Resistance to censorship – No single entity on the network can block users from submitting transactions, deploying dapps, or reading data from the blockchain.
  Complete data integrity – Data stored on the blockchain is immutable and indisputable, thanks to cryptographic primitives. Malicious actors cannot forge transactions or other data that has already been made public.
  Trustless computation/verifiable behavior – Smart contracts can be analyzed and are guaranteed to execute in predictable ways, without the need to trust a central authority. This is not true in traditional models; for example, when we use online banking systems, we must trust that financial institutions will not misuse our financial data, tamper with records, or get hacked.

Drawbacks of dapp development
Maintenance – Dapps can be harder to maintain because the code and data published to the blockchain are harder to modify. It’s hard for developers to make updates to their dapps (or the underlying data stored by a dapp) once they are deployed, even if bugs or security risks are identified in an old version.
Performance overhead – There is a huge performance overhead, and scaling is really hard. To achieve the level of security, integrity, transparency, and reliability that Ethereum aspires to, every node runs and stores every transaction. On top of this, proof-of-stake consensus takes time as well.
Network congestion – When one dapp uses too many computational resources, the entire network gets backed up. Currently, the network can only process about 10-15 transactions per second; if transactions are being sent in faster than this, the pool of unconfirmed transactions can quickly balloon.
User experience – It may be harder to engineer user-friendly experiences because the average end-user might find it too difficult to set up a tool stack necessary to interact with the blockchain in a truly secure fashion.
Centralization – User-friendly and developer-friendly solutions built on top of the base layer of Ethereum might end up looking like centralized services anyways. For example, such services may store keys or other sensitive information server-side, serve a frontend using a centralized server, or run important business logic on a centralized server before writing to the blockchain. Centralization eliminates many (if not all) of the advantages of blockchain over the traditional model.

Web3 benefits

Many Web3 developers have chosen to build dapps because of Ethereum's inherent decentralization:

  Anyone who is on the network has permission to use the service – or in other words, permission isn't required.
  No one can block you or deny you access to the service.
  Payments are built in via the native token, ether (ETH).
  Ethereum is turing-complete, meaning you can program pretty much anything.

Practical comparisons
Web2	Web3
Twitter can censor any account or tweet	Web3 tweets would be uncensorable because control is decentralized
Payment service may decide to not allow payments for certain types of work	Web3 payment apps require no personal data and can't prevent payments
Servers for gig-economy apps could go down and affect worker income	Web3 servers can't go down – they use Ethereum, a decentralized network of 1000s of computers as their backend

This doesn't mean that all services need to be turned into a dapp. These examples are illustrative of the main differences between web2 and web3 services.
Web3 limitations

Web3 has some limitations right now:

  Scalability – transactions are slower on web3 because they're decentralized. Changes to state, like a payment, need to be processed by a node and propagated throughout the network.
  UX – interacting with web3 applications can require extra steps, software, and education. This can be a hurdle to adoption.
  Accessibility – the lack of integration in modern web browsers makes web3 less accessible to most users.
  Cost – most successful dapps put very small portions of their code on the blockchain as it's expensive.

Centralization vs decentralization

In the table below, we list some of the broad-strokes advantages and disadvantages of centralized and decentralized digital networks.
Centralized Systems	Decentralized Systems
Low network diameter (all participants are connected to a central authority); information propagates quickly, as propagation is handled by a central authority with lots of computational resources.	The furthest participants on the network may potentially be many edges away from each other. Information broadcast from one side of the network may take a long time to reach the other side.
Usually higher performance (higher throughput, fewer total computational resources expended) and easier to implement.	Usually lower performance (lower throughput, more total computational resources expended) and more complex to implement.
In the event of conflicting data, resolution is clear and easy: the ultimate source of truth is the central authority.	A protocol (often complex) is needed for dispute resolution, if peers make conflicting claims about the state of data which participants are meant to be synchronized on.
Single point of failure: malicious actors may be able to take down the network by targeting the central authority.	No single point of failure: network can still function even if a large proportion of participants are attacked/taken out.
Coordination among network participants is much easier, and is handled by a central authority. Central authority can compel network participants to adopt upgrades, protocol updates, etc., with very little friction.	Coordination is often difficult, as no single agent has the final say in network-level decisions, protocol upgrades, etc. In the worst case, network is prone to fracturing when there are disagreements about protocol changes.
Central authority can censor data, potentially cutting off parts of the network from interacting with the rest of the network.	Censorship is much harder, as information has many ways to propagate across the network.
Participation in the network is controlled by the central authority.	Anyone can participate in the network; there are no “gatekeepers.” Ideally, the cost of participation is very low.

Note that these are general patterns that may not hold true in every network. Furthermore, in reality the degree to which a network is centralized/decentralized lies on a spectrum; no network is entirely centralized or entirely decentralized.
Further reading.

Ethereum accounts have four fields:

  nonce – A counter that indicates the number of transactions sent from an externally-owned account or the number of contracts created by a contract account. Only one transaction with a given nonce can be executed for each account, protecting against replay attacks where signed transactions are repeatedly broadcast and re-executed.
  balance – The number of wei owned by this address. Wei is a denomination of ETH and there are 1e+18 wei per ETH.
  codeHash – This hash refers to the code of an account on the Ethereum virtual machine (EVM). Contract accounts have code fragments programmed in that can perform different operations. This EVM code gets executed if the account gets a message call. It cannot be changed, unlike the other account fields. All such code fragments are contained in the state database under their corresponding hashes for later retrieval. This hash value is known as a codeHash. For externally owned accounts, the codeHash field is the hash of an empty string.
  storageRoot – Sometimes known as a storage hash. A 256-bit hash of the root node of a Merkle Patricia trie that encodes the storage contents of the account (a mapping between 256-bit integer values), encoded into the trie as a mapping from the Keccak 256-bit hash of the 256-bit integer keys to the RLP-encoded 256-bit integer values. This trie encodes the hash of the storage contents of this account, and is empty by default.

  USD Coin (USDC) is a stablecoin that is pegged to the value of the US dollar. It was created in 2018 by Circle and Coinbase through a partnership called the CENTRE consortium. USDC is an ERC-20 token, which means it is built on the Ethereum blockchain and follows a set of standardized protocols. It allows users to send US dollars over the internet and on public blockchains, giving them greater accessibility and faster transfer speeds. In addition, USDC can be easily converted back to US dollars at any time.

  Circle is a Boston-based financial services company that was founded in 2013. It offers a variety of products and services, including a peer-to-peer payment platform, a cryptocurrency exchange, and a trading platform for institutional investors. In addition to creating USDC, Circle has also played a significant role in the development of the stablecoin market.
  
  Coinbase is a San Francisco-based cryptocurrency exchange that was founded in 2012. It is one of the largest and most well-known exchanges in the world, and it offers a range of products and services for both individual and institutional investors.
  
  USDC was developed to address two main issues with other cryptocurrencies: volatility and the difficulty of converting between fiat currencies and cryptocurrencies. To maintain stability and transparency, USDC is fully backed by US dollars held in reserve, and the CENTRE consortium publishes regular reports on the total supply of USDC and the amount of backing it has. In addition, members of the consortium must meet certain standards, including licensing, compliance, technology, and accounting, in order to issue USDC.
  Working

  Mint and Burn
  
  Businesses can open a Circle Account to trade US dollars for USDC. When a company deposits USD into their Circle Account, Circle credits the company with the corresponding amount of USDC. "Minting" is the process of creating a new USDC. This operation generates new USDC for circulation.
  
  Similarly, if a company wants to trade its USDC for US dollars, they can deposit USDC into their Circle Account and request to receive US dollars for free. "Burning" is the process of redeeming USDC. This procedure removes USDC from circulation.
  
  When US dollars are exchanged for USDC on a digital asset exchange, the exchange will normally supply the balance of USDC on hand to complete the trade. If the exchange needs additional USDC to complete the deal, it will frequently use its Circle Account to create extra USDC.
  Transparency
  
  Since its launch in 2018, Circle has published monthly reserve reports for USDC that are attested to by Grant Thornton, a global accounting firm. These reports provide independent confirmation that Circle holds at least as much in dollar-denominated reserves as the amount of USDC in circulation. In addition to the standard information provided in these reports, Circle also recently began publishing details about the CUSIPs, maturity dates, and market values of the T-bills in its portfolio, as well as the financial institutions that hold the cash portion of the USDC reserve and the weighted average maturity of the entire reserve. Starting in July 2022, Grant Thornton's attestations will cover all of this additional information, providing independent confirmation of the detailed composition and sufficiency of the USDC reserve. An attestation from an accounting firm is similar to an audit in that it provides assurance around specific statements or criteria. In this case, the firm reviews the supporting documentation prepared by Circle's management and verifies the criteria presented in the reserve report. Circle also files annual audited financial statements with the SEC that cover the USDC reserve. In order to prepare the reserve report, Circle must reconcile the differences between the real-time movement of USDC on the blockchain and the settlement delays and business hours of traditional financial institutions. These differences are accounted for in the attested reserve asset balances and do not impact the overall size of the reserve or the fact that USDC is always redeemable 1:1 for US dollars. Circle's commitment to providing transparent and timely reporting on its risk minimization and liquidity maintenance efforts helps to give the market confidence in USDC. It plans to continue enhancing its transparency as policy and regulatory requirements evolve and better reporting opportunities arise.
  Backing
  
  USDC is fully backed by the equivalent value of U.S. dollar-denominated assets and is held in the management and custody of leading U.S. financial institutions, including BlackRock and Bank of New York Mellon. The USDC reserve consists of cash and short-dated U.S. government obligations, specifically U.S. Treasuries with maturities of three months or less. As of May 13, 2022, the USDC reserve was worth $50.6 billion and consisted of $11.6 billion in cash (22.9%) and $39.0 billion in U.S. Treasuries (77.1%). As of Jan 5, 2023 the total USDC in circulation is $44 B. The total circulating supply is also equal to $44 billion.
  
  USDC is always redeemable 1:1 for U.S. dollars. Customers of Circle can mint or redeem USDC in exchange for U.S. dollars through their Circle account, with the exchange happening nearly instantly subject to the settlement of funds. Individual retail users can also exchange USDC for U.S. dollars globally through leading digital asset exchanges such as Binance and Coinbase. As of May 13, 2022, Circle had minted 99.3 billion USDC and redeemed 61.1 billion USDC during the year. There are thousands of projects and exchanges supporting USDC in over 190 countries, facilitating its use and exchange for market participants. On Jan 5, 2023, the 24-hour trading volume of USDC was $ 4 billion.

  What is Asset Tokenization?

A token is a digital unit of cryptocurrency that is either used as a specific asset or it represents a particular use on the blockchain. Tokens can have multiple use cases but the most common ones are as security, utility or governance tokens.

Asset tokenization refers to the process of creating a digital token that represents a physical or digital asset, such as real estate, artwork, or even company shares, on a blockchain network.

This token can then be bought, sold, and traded like any other cryptocurrency, and can also enable fractional ownership of assets, making it more accessible to a wider range of investors. Tokenization can also enable smart contract functionality, which can automate the process of buying and selling assets and can also provide a tamper-proof and transparent record of ownership.
Issues

  Public and Private Markets
      https://securitize.io/learn/three-things-investors-should-know-about-private-equity
      https://securitize.io/learn/differences-between-public-markets-and-private-markets
  Liquidity
  Ownership Cost
  Settlement Time -

Use Cases of Tokenization

There are many examples of tokenized assets, some of which include:

  Real estate: Tokenization allows for the creation of digital tokens that represent ownership of a physical property, enabling fractional ownership and more efficient trading of real estate.

  Art: Tokenization can be used to represent ownership of fine art, making it more accessible to a wider range of investors and collectors.

  Stocks: Tokenization can be used to represent ownership of company shares, enabling more efficient and secure trading of stocks.

  Commodities: Tokenization can be used to represent ownership of commodities such as gold, oil, and other precious metals, enabling more efficient trading and storage.

  Collectibles: Tokenization can be used to represent ownership of collectible items such as sports cards, comic books, and other rare items, making it more accessible to a wider range of collectors.

  Music rights: Tokenization can be used to represent ownership of music rights, making it more efficient for creators and investors to manage and monetize music.

  Luxury goods: Tokenization can be used to represent ownership of luxury goods such as designer clothes, watches and handbags, making it more accessible for investors and collectors.

These are just a few examples and the possibilities are endless, as any asset can be tokenized.


About Compound

Introduction

Compound is one of the first DeFi platforms in the DeFi space. Like other DeFi lending and borrowing platforms, users in Compound can Lend asserts to earn interest and can also borrow by having a over collateralized position.

Compound recently released their version three of the protocol, also Called "Compound III". and it is quite different from V2. Compound III prioritized safely and isolation of the assets above everything. In V3 when you supply collateral, it remains your property. It can never be withdrawn by other users (except during liquidation).

In the new version of the protocol, there is a separate market for each token. That token acts as the "base token" in that market. A supplier can lend the base token in the market and can earn interest. When a borrower wants to borrow that base token from the market, he can deposit one or more of the other tokens listed in the market as collateral. No interest will be accrued by these assets that are supplied as collateral and cTokens are no longer used.

The major concepts to understand in Compound III are,
Utilization and Interest Rates

The interest rates for supply and borrowing are based on the utilization rate of the base asset. There is a point beyond which the interest rate starts to increase more rapidly, called the "kink." Interest accrues every second, using the block timestamp. Collateral assets do not earn or pay interest.

This function returns the current protocol utilization of the base asset. The formula for producing the utilization is:

Utilization = TotalBorrows / TotalSupply

function getUtilization() public view returns (uint)

// RETURNS: The current protocol utilization percentage as a decimal, represented by an unsigned integer, scaled up by 10 ^ 18. E.g. 1e17 or 100000000000000000 is 10% utilization.

Supply

The supply function allows users to add assets to the protocol in order to increase their borrowing capacity. This function can be used to add collateral, supply the base asset, or repay an open borrow of the base asset. Collateral can only be added if the market is below its supplyCap.

Compound III enables users to earn interest on their positive balances of the base asset, based on separate interest rate models that are set by governance.

To calculate the Compound III supply APR as a percentage, divide the current utilization by 10 ^ 18 and multiply by the approximate number of seconds in one year, then scale up by 100.

function getSupplyRate(uint utilization) public view returns (uint64)

//  utilization: The utilization at which to calculate the rate.
//  RETURNS: The per second supply rate as the decimal representation of a percentage scaled up by 10 ^ 18. E.g. 317100000 indicates, roughly, a 1% APR.

Withdraw (borrow)

The withdraw method is used to take out collateral that isn't being used to support an open borrow. The base asset can be borrowed using the withdraw function. The resulting balance must meet the borrowing collateral factor requirements. The collateral assets that a user adds to their account using the supply function increases their borrowing capacity. The percentage of the collateral value that can be borrowed is represented by the borrowing collateral factor. If an account fails to meet the required borrow collateral factor, the user cannot borrow any additional assets until they supply more collateral or reduce their borrow balance using the supply function.

Comet comet = Comet(0xCometAddress);
comet.withdraw(0xwbtcAddress, 100000000);

Liquidation

When an account’s borrow balance exceeds the set liquidation collateral limit (which is separate and higher than borrow collateral factor), the account is then eligible for liquidation. The latest version of the Compound protocol has a different liquidation system than the one before it. In order to keep the system running smoothly, the protocol takes in borrower accounts that don't meet the collateral requirements.

If a borrower accrues too much interest on their borrow, or the USD value of their collateral reduces, or the USD value of their borrow increases, the account becomes liquidatable.

Range Orders

Customizable liquidity positions, along with single-sided asset provisioning, allow for a new style of swapping with automated market makers: the range order.

In typical order book markets, anyone can easily set a limit order: to buy or sell an asset at a specific predetermined price, allowing the order to be filled at an indeterminate time in the future.

With Uniswap V3, one can approximate a limit order by providing a single asset as liquidity within a specific range. Like traditional limit orders, range orders may be set with the expectation they will execute at some point in the future, with the target asset available for withdrawal after the spot price has crossed the full range of the order.

Unlike some markets where limit orders may incur fees, the range order maker generates fees while the order is filled. This is due to the range order technically being a form of liquidity provisioning rather than a typical swap.
Possibilities of Range orders

The nature of AMM design makes some styles of limit orders possible, while others cannot be replicated. The following are four examples of range orders and their traditional counterparts; the first two are possible, the second two are not.

    One important distinction: range orders, unlike traditional limit orders, will be unfilled if the spot price crosses the given range and then reverses to recross in the opposite direction before the target asset is withdrawn. While you will be earning LP fees during this time, if the goal is to exit fully in the desired destination asset, you will need to keep an eye on the order and either manually remove your liquidity when the order has been filled or use a third party position manager service to withdraw on your behalf.



 `;

export const uniswapString2 = `
Introduction

The defining idea of Uniswap v3 is concentrated liquidity: liquidity that is allocated within a custom price range. In earlier versions, liquidity was distributed uniformly along the price curve between 0 and infinity.

The previously uniform distribution allowed trading across the entire price interval (0, ∞) without any loss of liquidity. However, in many pools, the majority of the liquidity was never used.

Consider stablecoin pairs, where the relative price of the two assets stays relatively constant. The liquidity outside the typical price range of a stablecoin pair is rarely touched. For example, the v2 DAI/USDC pair utilizes ~0.50% of the total available capital for trading between $0.99 and $1.01, the price range in which LPs would expect to see the most volume - and consequently earn the most fees.

With v3, liquidity providers may concentrate their capital to smaller price intervals than (0, ∞). In a stablecoin/stablecoin pair, for example, an LP may choose to allocate capital solely to the 0.99 - 1.01 range. As a result, traders are offered deeper liquidity around the mid-price, and LPs earn more trading fees with their capital. We call liquidity concentrated to a finite interval a position. LPs may have many different positions per pool, creating individualized price curves that reflect the preferences of each LP.
Active Liquidity

As the price of an asset rises or falls, it may exit the price bounds that LPs have set in a position. When the price exits a position's interval, the position's liquidity is no longer active and no longer earns fees.

As price moves in one direction, LPs gain more of the one asset as swappers demand the other, until their entire liquidity consists of only one asset. (In v2, we don't typically see this behavior because LPs rarely reach the upper or lower bound of the price of two assets, i.e., 0 and ∞). If the price ever reenters the interval, the liquidity becomes active again, and in-range LPs begin earning fees once more.

Importantly, LPs are free to create as many positions as they see fit, each with its own price interval. Concentrated liquidity serves as a mechanism to let the market decide what a sensible distribution of liquidity is, as rational LPs are incentivize to concentrate their liquidity while ensuring that their liquidity remains active.
Ticks

To achieve concentrated liquidity, the once continuous spectrum of price space has been partitioned with ticks.

Ticks are the boundaries between discrete areas in price space. Ticks are spaced such that an increase or decrease of 1 tick represents a 0.01% increase or decrease in price at any point in price space.

Ticks function as boundaries for liquidity positions. When a position is created, the provider must choose the lower and upper tick that will represent their position's borders.

As the spot price changes during swapping, the pool contract will continuously exchange the outbound asset for the inbound, progressively using all the liquidity available within the current tick interval1 until the next tick is reached. At this point, the contract switches to a new tick and activates any dormant liquidity within a position that has a boundary at the newly active tick.

While each pool has the same number of underlying ticks, in practice only a portion of them are able to serve as active ticks. Due to the nature of the v3 smart contracts, tick spacing is directly correlated to the swap fee. Lower fee tiers allow closer potentially active ticks, and higher fees allow a relatively wider spacing of potential active ticks.

While inactive ticks have no impact on transaction cost during swaps, crossing an active tick does increase the cost of the transaction in which it is crossed, as the tick crossing will activate the liquidity within any new positions using the given tick as a border.

In areas where capital efficiency is paramount, such as stable coin pairs, narrower tick spacing increases the granularity of liquidity provisioning and will likely lower price impact when swapping - the result being significantly improved prices for stable coin swaps.

For more information on fee levels and their correlation to tick spacing, see the whitepaper.

What is Uniswap?

Uniswap is a protocol on Ethereum for swapping ERC20 tokens. Unlike most exchanges, which are designed to take fees, Uniswap is designed to function as a public good—a tool for the community to trade tokens without platform fees or middlemen. Also unlike most exchanges, which match buyers and sellers to determine prices and execute trades, Uniswap uses a simple math equation and pools of tokens and ETH to do the same job.
Uniswap is trying to solve decentralized exchanges' liquidity problem, by allowing the exchange to swap tokens without relying on buyers and sellers creating that liquidity.

Below we explore how Uniswap works—and how it became one of the leading decentralized exchanges built on Ethereum.
What is Uniswap?

Uniswap is a protocol on Ethereum for swapping ERC20 tokens. Unlike most exchanges, which are designed to take fees, Uniswap is designed to function as a public good—a tool for the community to trade tokens without platform fees or middlemen. Also unlike most exchanges, which match buyers and sellers to determine prices and execute trades, Uniswap uses a simple math equation and pools of tokens and ETH to do the same job.
Did you know?

Uniswap was created by Hayden Adams, who was inspired to create the protocol by a post made by Ethereum founder Vitalik Buterin.
What’s so special about Uniswap?

Uniswap’s main distinction from other decentralized exchanges is the use of a pricing mechanism called the “Constant Product Market Maker Model.”

Any token can be added to Uniswap by funding it with an equivalent value of ETH and the ERC20 token being traded. For example, if you wanted to make an exchange for an altcoin called Durian Token, you would launch a new Uniswap smart contract for Durian Token and create a liquidity pool with–for example–$10 worth of Durian Token and $10 worth of ETH.

Where Uniswap differs is that instead of connecting buyers and sellers to determine the price of Durian Token, Uniswap uses a constant equation: x * y = k.

In the equation, x and y represent the quantity of ETH and ERC20 tokens available in a liquidity pool and k is a constant value. This equation uses the balance between the ETH and ERC20 tokens–and supply and demand–to determine the price of a particular token. Whenever someone buys Durian Token with ETH, the supply of Durian Token decreases while the supply of ETH increases–the price of Durian Token goes up.

As a result, the price of tokens on Uniswap can only change if trades occur. Essentially what Uniswap is doing is balancing out the value of tokens, and the swapping of them based on how much people want to buy and sell them.

As a result, the price of tokens on Uniswap can only change if trades occur. Essentially what Uniswap is doing is balancing out the value of tokens, and the swapping of them based on how much people want to buy and sell them.
What else is different about Uniswap?

Absolutely any ERC20 token can be listed on Uniswap–no permission required. Each token has its own smart contract

and liquidity pool–if one doesn’t exist, it can be created easily.

Once a token has its own exchange smart contract and liquidity pool, anyone can trade the token or contribute to the liquidity pool while earning a liquidity provider fee of 0.3%. To contribute to a liquidity pool, you need an equal value of ETH and ERC20 tokens.

As a result, the price of tokens on Uniswap can only change if trades occur. Essentially what Uniswap is doing is balancing out the value of tokens, and the swapping of them based on how much people want to buy and sell them.
What else is different about Uniswap?

Absolutely any ERC20 token can be listed on Uniswap–no permission required. Each token has its own smart contract

and liquidity pool–if one doesn’t exist, it can be created easily.

Once a token has its own exchange smart contract and liquidity pool, anyone can trade the token or contribute to the liquidity pool while earning a liquidity provider fee of 0.3%. To contribute to a liquidity pool, you need an equal value of ETH and ERC20 tokens.
How are Uniswap tokens produced?

Whenever new ETH/ERC20 tokens are contributed to a Uniswap liquidity pool, the contributor receives a “pool token”, which is also an ERC20 token.

Pool tokens are created whenever funds are deposited into the pool and as an ERC20 token, pool tokens can be freely exchanged, moved, and used in other dapps. When funds are reclaimed, the pool tokens are burned or destroyed. Each pool token represents a user’s share of the pool’s total assets and share of the pool’s 0.3% trading fee.
How to make your first trade on Uniswap

Through Uniswap, you’re able to purchase ether (ETH) and any of the thousands of ERC20 tokens supported by the platform.

To do this, you’re going to need some ETH in your balance to pay for any transaction fees, as well as something to trade for the ERC20 token you want. This might be ETH, or another ERC20 token. For example, if you’re looking to trade USD Coin (USDC) for UNI, you’re going to need to hold USDC in your wallet plus some ether to cover the transaction fee.

Here, we’ll cover how to make your first trade on Uniswap—by purchasing some UNI tokens with ETH.

Step 1: First head over to the Uniswap exchange platform.

On the top right, click the ‘Connect to a wallet’ button, and log in with the wallet you wish to trade with. This can be either a MetaMask, WalletConnect, Coinbase Wallet, Fortmatic, or Portis Wallet.
For the purposes of this tutorial, we’ll log in with a MetaMask wallet.
Uniswap "connect to a wallet" screenshot

Step 2: Once logged in, the trading interface will appear.

In the top field, select the token you wish to exchange for the token you want. We’ll select ETH. In the bottom field, search for the token you wish to purchase, or select it from the drop-down menu, in this case UNI.
For the purposes of this tutorial, we’ll log in with a MetaMask wallet.
Uniswap "connect to a wallet" screenshot

Step 2: Once logged in, the trading interface will appear.

In the top field, select the token you wish to exchange for the token you want. We’ll select ETH. In the bottom field, search for the token you wish to purchase, or select it from the drop-down menu, in this case UNI.
Uniswap "select token" screenshot

Step 3: Now you’re ready to set up your order. You can either choose how much you want to spend by entering a number in the top field, or choose how much to buy by entering a number in the bottom one.

In our example, we’ll buy 0.1 ETH worth of UNI tokens.
Step 4: At the bottom of the order menu, you’ll then see how much you can expect to receive.

If you’re happy with these figures, click the ‘Swap’ button.

Your wallet click will then prompt you to confirm the trade, and potentially adjust the fees to a number that works best for you.
Next steps

Once you've completed your first trade on Uniswap, there are plenty of options for more advanced users.

Since Uniswap is an open protocol of smart contracts, a number of different front-end user interfaces have already been created for it. For example, InstaDApp allows you to add funds into Uniswap pools without needing to access the official Uniswap user interface.

Interfaces such as Zapper.fi allow users to add funds to Uniswap pools using just ETH instead of ETH and another token. The interface even offers simple one-click solutions for purchasing pool tokens in combination with bZx token strategies.


With an array of official and unoffical resources for developers to build on the protocol, we should expect to see many more integrations between Uniswap’s unique token swapping system and new decentralized finance (DeFi

   ) products in the coming years.
   Uniswap V2 and V3
   
   Though Uniswap launched back in November 2018, it wasn't until relatively recently that the protocol began to see significant traction.
   
   The release of Uniswap V2 in May 2020 saw a major upgrade that allows for direct ERC20 to ERC20 swaps, cutting Wrapped Ether (WETH) out of the equation where possible. Uniswap V2 also added support for incompatible ERC20 tokens like OmiseGo (OMG) and Tether (USDT), and added a host of technical improvements that make it more desirable to use.
   
   As liquidity mining and yield farming platforms dramatically increased in popularity in 2020, Uniswap saw a corresponding surge in interest, since many DeFi platforms allow Uniswap liquidity providers to see an additional return on their LP tokens.

   This, in combination with the 0.3% exchange fees distributed to liquidity providers—and the platform’s popularity as a launchpad for popular DeFi project tokens—has seen Uniswap rise the ranks to become one of the leading DeFi platforms by total value locked (TVL)—a measure of the total value of crypto assets locked up in the platform.

In May 2021, Uniswap V3 launched, with the latest iteration of the DEX adding a number of new features. First up is concentrated liquidity, which enables liquidity providers to allocate liquidity within a custom price range. That, in turn, means that traders don't have to put as much capital on the line to achieve results.

This, in combination with the 0.3% exchange fees distributed to liquidity providers—and the platform’s popularity as a launchpad for popular DeFi project tokens—has seen Uniswap rise the ranks to become one of the leading DeFi platforms by total value locked (TVL)—a measure of the total value of crypto assets locked up in the platform.

In May 2021, Uniswap V3 launched, with the latest iteration of the DEX adding a number of new features. First up is concentrated liquidity, which enables liquidity providers to allocate liquidity within a custom price range. That, in turn, means that traders don't have to put as much capital on the line to achieve results.

V3 also adds more fee tiers, enabling traders to better determine their risk level when trading volatile assets (which can change in price between when a trade's initiated and executed). It also adds "easier and cheaper" oracles

, which ensures that the DEX's price data is up to date.

Finally (and perhaps least essentially) it also generates non-fungible tokens (NFTs) based on LP positions, turning them into "on-chain generated art".

UNI token launch and airdrop

In September 2020, Uniswap launched UNI, the network’s governance token, airdropping 400 UNI tokens to every wallet address that had interacted with the Uniswap protocol before September 1.

From a distribution of 150 million UNI tokens, around 66 million were claimed in the first 24 hours following the airdrop. After distributing 40% of the tokens in the first year, it will taper down by 10 percentage points in each subsequent year, until all the tokens have been allocated.

Uniswap plans to distribute a capped total of 1 billion UNI over four years, with 60% earmarked for distribution to the community, 21.5% allocated to Uniswap employees, and the remaining 18.5% going to investors and advisors.

As a governance token, UNI entitles holders to a vote in how the protocol is run, affording them immediate ownership of Uniswap governance, the UNI community treasury, the protocol fee switch, eth ENS, the Uniswap Default List (tokens.uniswap.eth) and SOCKS liquidity tokens. The token was quickly listed on the Coinbase Pro exchange, and soon after on the main Coinbase exchange.

Recent developments

In less than a year, Uniswap V2 has propelled the platform to meteoric growth.

In February 2021, it became the first decentralized exchange to process more than $100 billion in trading volume, and now frequently exceeds $1 billion in trading volume each day. This performance has seen it become not only the largest DEX by trading volume, but one of the top five most popular exchanges period.

Meanwhile, the Uniswap governance token (UNI) has climbed to become the 10th largest cryptocurrency by market capitalization after reaching a peak value of over $44. This was at least partially driven by the growing popularity of yield farming pools, many of which require users to hold UNI or Uniswap LP tokens.

The platform also found itself at the center of the recent Unisocks (SOCKS) craze, a token backed by a physical pair of socks. Although the first pair sold for just $12, in February 2021, a unique sale format that uses a bonding curve to set the price saw one pair sell for a whopping $92,000.

But it hasn’t all been smooth sailing for Uniswap. As a result of massive congestion on the Ethereum network, transaction fees have shot through the roof—making trading on Uniswap an expensive task, particularly when concerning low-value trades.

This has seen the proliferation and growth of a huge range of alternative platforms, including TRON’s JustSwap, Qtum’s QiSwap, and Kyber Network—all of which promise faster transitions, lower fees, or both. Uniswap also saw its daily transaction volume briefly exceeded by PancakeSwap—a similar automated market maker (AMM) built on Binance Smart Chain.

But Uniswap's position as one of the leading DEXs has given it considerable clout. Some are looking to leverage that as the DeFi sector grows—and, inevitably, comes under the gaze of regulators. In May 2021, members of the Uniswap community launched a governance proposal to set up a "political defense" fund with a budget of 1-1.5 million UNI.

The aim of the fund is to preempt regulatory and tax threats using lawyers, lobbyists and organizers, enabling the nascent DeFi space to counter "massive spending from traditional finance players."

With the likes of the SEC and CFTC now considering the question of DeFi regulation, Uniswap may have a fight on its hands.

Uniswap is a leading decentralized crypto exchange that runs on the Ethereum blockchain.

The vast majority of crypto trading takes place on centralized exchanges such as Coinbase and Binance. These platforms are governed by a single authority (the company that operates the exchange), require users to place funds under their control and use a traditional order book system to facilitate trading.

Order book-based trading is where buy and sell orders are presented in a list along with the total amount placed in each order. The amount of open buy and sell orders for an asset is known as “market depth.” In order to make a successful trade using this system, a buy order has to be matched with a sell order on the opposite side of the order book for the same amount and price of an asset, and vice versa.

For example, if you wanted to sell one bitcoin (BTC) at a price of $33,000 on a centralized exchange, you’d need to wait for a buyer to appear on the other side of the order book who’s looking to buy an equal or higher amount of bitcoin at that price.

The main problem with this type of system is liquidity, which in this context refers to the depth and number of orders there are on the order book at any given time. If there’s low liquidity, it means traders may not be able to fill their buy or sell orders.

Another way to think of liquidity: Imagine you own a food stall in a street market. If the street market is busy with stall owners selling goods and people buying produce and products, it would be considered a "liquid market." If the market was quiet and there was little buying and selling going on, it would be considered a "narrow market."

What is Uniswap?

Uniswap is a completely different type of exchange that‘s fully decentralized – meaning it isn’t owned and operated by a single entity – and uses a relatively new type of trading model called an automated liquidity protocol (see below).

The Uniswap platform was built in 2018 on top of the Ethereum blockchain, the world’s second-largest cryptocurrency project by market capitalization, which makes it compatible with all ERC-20 tokens and infrastructure such as wallet services like MetaMask and MyEtherWallet.

Uniswap is also completely open source, which means anyone can copy the code to create their own decentralized exchanges. It even allows users to list tokens on the exchange for free. Normal centralized exchanges are profit-driven and charge very high fees to list new coins, so this alone is a notable difference. Because Uniswap is a decentralized exchange (DEX), it also means users maintain control of their funds at all times as opposed to a centralized exchange that requires traders to give up control of their private keys so that orders can be logged on an internal database rather than be executed on a blockchain, which is more time consuming and expensive. By retaining control of private keys, it eliminates the risk of losing assets if the exchange is ever hacked. According to the latest figures, Uniswap is currently the fourth-largest decentralized finance (DeFi) platform and has over $3 billion worth of crypto assets locked away on its protocol.

How Uniswap works

Uniswap runs on two smart contracts; an “Exchange” contract and a “Factory” contract. These are automatic computer programs that are designed to perform specific functions when certain conditions are met. In this instance, the factory smart contract is used to add new tokens to the platform and the exchange contract facilitates all token swaps, or “trades.” Any ERC20-based token can be swapped with another on the updated Uniswap v.2 platform.
Automated liquidity protocol

The way Uniswap solves the liquidity problem (described in the introduction) of centralized exchanges is through an automated liquidity protocol. This works by incentivizing people trading on the exchange to become liquidity providers (LPs): Uniswap users pool their money together to create a fund that’s used to execute all trades that take place on the platform. Each token listed has its own pool that users can contribute to, and the prices for each token are worked out using a math algorithm run by a computer (explained in “How token price is determined,” below).

With this system, a buyer or seller does not have to wait for an opposite party to appear to complete a trade. Instead, they can execute any trade instantly at a known price provided there’s enough liquidity in the particular pool to facilitate it.

In exchange for putting up their funds, each LP receives a token that represents the staked contribution to the pool. For example, if you contributed $10,000 to a liquidity pool that held $100,000 in total, you would receive a token for 10% of that pool. This token can be redeemed for a share of the trading fees. Uniswap charges users a flat 0.30% fee for every trade that takes place on the platform and automatically sends it to a liquidity reserve.

Whenever a liquidity provider decides they want to exit, they receive a portion of the total fees from the reserve relative to their staked amount in that pool. The token they received which keeps a record of what stake they’re owed is then destroyed.

After the Uniswap v.2 upgrade, a new protocol fee was introduced that can be turned on or off via a community vote and essentially sends 0.05% of every 0.30% trading fee to a Uniswap fund to finance future development. Currently, this fee option is turned off, however, if it is ever turned on it means LPs will start receiving 0.25% of pool trading fees.
How token price is determined

Another important element of this system is how it determines the price of each token. Instead of an order book system where the price of each asset is determined by the highest buyer and lowest seller, Uniswap uses an automated market maker system. This alternative method for adjusting the price of an asset based on its supply and demand uses a long-standing mathematical equation. It works by increasing and decreasing the price of a coin depending on the ratio of how many coins there are in the respective pool.

It’s important to note that whenever someone adds a new ERC-20 token to Uniswap, that person has to add a certain amount of the chosen ERC-20 token and an equal amount of another ERC-20 token to start the liquidity pool.

The equation for working out the price of each token is x*y=k, where the amount of token A is x and the amount of token B is y. K is a constant value, aka a number that doesn’t change.

For example, Bob wants to trade chainlink (LINK) for ether using the Uniswap LINK/ETH pool. Bob adds a large number of LINK to the pool which increases the ratio of LINK in the pool to ether. Since the value K must remain the same, it means the cost of ether increases while the cost of link in the pool decreases. So the more LINK Bob puts in, the less ether he gets in return because the price of it increases.

The size of the liquidity pool also determines how much the price of tokens will change during a trade. The more money, aka liquidity, there is in a pool, the easier it is to make larger trades without causing the price to slide as much.

Arbitrage

Arbitrage traders are an essential component of the Uniswap ecosystem. These are traders that specialize in finding price discrepancies across multiple exchanges and use them to secure a profit. For example, if bitcoin was trading on Kraken for $35,500 and Binance at $35,450, you could buy bitcoin on Binance and sell it on Kraken to secure an easy profit. If done with large volumes it’s possible to bank a considerable profit with relatively low risk.

What arbitrage traders do on Uniswap is find tokens that are trading above or below their average market price – as a result of large trades creating imbalances in the pool and lowering or raising the price – and buy or sell them accordingly. They do this until the price of the token rebalances in line with the price on other exchanges and there is no more profit to be made. This harmonious relationship between the automated market maker system and arbitrage traders is what keeps Uniswap token prices in line with the rest of the market.
How to use Uniswap

Getting started with Uniswap is relatively straightforward, however, you will need to make sure you already have an ERC-20 supported wallet setup such as MetaMask, WalletConnect, Coinbase wallet, Portis, or Fortmatic.

Once you have one of those wallets, you need to add ether to it in order to trade on Uniswap and pay for gas – this is what Ethereum transaction fees are called. Gas payments vary in price depending on how many people are using the network. Most ERC-20 compatible wallet services give you three choices when making a payment over the Ethereum blockchain: slow, medium or fast. Slow is the cheapest option, fast is the most expensive and medium is somewhere in between. This determines how quickly your transaction is processed by Ethereum network miners.
Read more: Ethereum 101: What is Ethereum Mining?

1. Head to https://uniswap.org 2. Click “Use Uniswap” in the top right-hand corner. 3. Go to “Connect wallet” in the top right-hand corner and select the wallet you have. 4. Log into your wallet and allow it to connect to Uniswap.5. On the screen it will give you an option to swap tokens directly using the drop-down options next to the “from” and “to” sections. 6. Select which token you’d like to swap, enter the amount and click “swap.” 7. A preview window of the transaction will appear and you will need to confirm the transaction on your ERC-20 wallet. 8. Wait for the transaction to be added to the Ethereum blockchain. You can check its progress by copying and pasting the transaction ID into https://etherscan.io/. The transaction ID will be available in your wallet by finding the transaction in your sent transaction history.

Uniswap's UNI token

Uniswaps native token, UNI, is known as a governance token. This gives holders the right to vote on new developments and changes to the platform, including how minted tokens should be distributed to the community and developers as well as any changes to fee structures. The UNI token was originally created in September 2020 in an effort to prevent users from defecting to rival DEX SushiSwap. One month before UNI tokens launched, SushiSwap – a fork of Uniswap – had incentivized users from Uniswap to allow SushiSwap to reallocate their funds to the new platform by rewarding them with SUSHI tokens. This was a new type of token that gave users governance rights over the new protocol as well as a proportionate amount of all transaction fees paid to the platform.

Uniswap responded by creating 1 billion UNI tokens and decided to distribute 150 million of them to anybody who had ever used the platform. Each person received 400 UNI tokens, which at the time amounted to over $1,000.
This article was originally published on Feb 4, 2021 at 3:39 p.m. 



`;

export const uniswapString3 = ` 
Fees
Swap Fees

Swap fees are distributed pro-rata to all in-range1 liquidity at the time of the swap. If the spot price moves out of a position’s range, the given liquidity is no longer active and does not generate any fees. If the spot price reverses and reenters the position’s range, the position’s liquidity becomes active again and will generate fees.

Swap fees are not automatically reinvested as they were in previous versions of Uniswap. Instead, they are collected separately from the pool and must be manually redeemed when the owner wishes to collect their fees.
Pool Fees Tiers

Uniswap v3 introduces multiple pools for each token pair, each with a different swapping fee. Liquidity providers may initially create pools at three fee levels: 0.05%, 0.30%, and 1%. More fee levels may be added by UNI governance, e.g. the 0.01% fee level added by this governance proposal in November 2021, as executed here.

Breaking pairs into separate pools was previously untenable due to the issue of liquidity fragmentation. Any incentive alignments achieved by more fee optionality invariably resulted in a net loss to traders, due to lower pairwise liquidity and the resulting increase in price impact upon swapping.

The introduction of concentrated liquidity decouples total liquidity from price impact. With price impact concerns out of the way, breaking pairs into multiple pools becomes a feasible approach to improving the functionality of a pool for assets previously underserved by the 0.30% swap fee.
Finding The Right Pool Fee

We anticipate that certain types of assets will gravitate towards specific fee tiers, based on where the incentives for both swappers and liquidity providers come nearest to alignment.

We expect low volatility assets (stable coins) will likely congregate in the lowest fee tier, as the price risk for liquidity providers holding these assets is very low, and those swapping will be motivated to pursue an execution price closest to 1:1 as they can get.

Similarly, we anticipate more exotic assets, or those traded rarely, will naturally gravitate towards a higher fee - as liquidity providers will be motivated to offset the cost risk of holding these assets for the duration of their position.
Protocol Fees
Uniswap v3 has a protocol fee that can be turned on by UNI governance. Compared to v2, UNI governance has more flexibility in choosing the fraction of swap fees that go to the protocol. For details regarding the protocol fee, see the whitepaper.

`;

export const uniswapString4 = `
Range Orders

Customizable liquidity positions, along with single-sided asset provisioning, allow for a new style of swapping with automated market makers: the range order.

In typical order book markets, anyone can easily set a limit order: to buy or sell an asset at a specific predetermined price, allowing the order to be filled at an indeterminate time in the future.

With Uniswap V3, one can approximate a limit order by providing a single asset as liquidity within a specific range. Like traditional limit orders, range orders may be set with the expectation they will execute at some point in the future, with the target asset available for withdrawal after the spot price has crossed the full range of the order.

Unlike some markets where limit orders may incur fees, the range order maker generates fees while the order is filled. This is due to the range order technically being a form of liquidity provisioning rather than a typical swap.
Possibilities of Range orders

The nature of AMM design makes some styles of limit orders possible, while others cannot be replicated. The following are four examples of range orders and their traditional counterparts; the first two are possible, the second two are not.

    One important distinction: range orders, unlike traditional limit orders, will be unfilled if the spot price crosses the given range and then reverses to recross in the opposite direction before the target asset is withdrawn. While you will be earning LP fees during this time, if the goal is to exit fully in the desired destination asset, you will need to keep an eye on the order and either manually remove your liquidity when the order has been filled or use a third party position manager service to withdraw on your behalf.
 `;
