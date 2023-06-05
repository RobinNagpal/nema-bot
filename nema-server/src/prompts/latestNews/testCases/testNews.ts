import { PageMetadata } from '@/contents/projectsContents';
import { getEmbeddingVectors } from '@/indexer/getEmbeddingVectors';
import { LATEST_NEWS_NAMESPACE } from '@/prompts/latestNews/constants';

import { indexVectorsInPinecone } from '@/prompts/latestNews/indexVectorsInPinecone';
import { Vector } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { Document as LGCDocument } from 'langchain/document';
import { lemmatizer } from 'lemmatizer';
import { getNewsContentsUsingCheerio } from '../getNewsContentsUsingCheerio';

const testNews: { summary: string; url: string }[] = [
  // {
  //   summary:
  //     'ftx crypto exchange files chapter 11 bankruptcy founder resigns liabilities 10-50b new ceo plans restructuring bitcoin price drops ftx group involved bitpesa erroneously listed',
  //   url: 'https://www.coindesk.com/policy/2022/11/11/ftx-files-for-bankruptcy-protections-in-us/',
  // },
  // {
  //   summary:
  //     'ftx crypto exchange investigating relaunch fees hinting at possible reboot as early as q2 new management exploring tax security user experience and long term options unclear if restart is for withdrawals or broader relaunch community reaction varied',
  //   url: 'https://coingape.com/ftx-news-bankrupt-exchange-looking-for-a-comeback/',
  // },
  // {
  //   summary:
  //     "silvergate agrees with fed deadline for wind-down plan of crypto-friendly bank skale network introduces ethereum zk-rollup levitation protocol ton foundation proposes burning 50% of network fees formula 1's red bull racing forges crypto alliance with mysten labs avalanche hits 1 million monthly active users for the first time animoca brands was given an extension until the end of q1 this year for publishing audited 2020 accounts, but it is yet to do so animoca brands is yet to produce a long-delayed set of accounts for 2020, but it is now the events of 2021 and 2022 - the first a year of wild exuberance in crypto markets, the second one marked by catastrophe - that are holding them up yat siu, chairman of animoca, said the company is working closely with its auditor dfn international to sign them off and that the biggest part is essentially the subsequent events animoca has made around 450 investments in web3 projects and sits on a trove of highly volatile tokens, placing a value on that haul is no mean feat and the two years in question were times of extreme contrast in crypto markets",
  //   url: 'https://www.theblock.co/post/232851/animoca-accounts-delays',
  // },
  // {
  //   summary:
  //     'silvergate agrees with fed deadline for wind-down plan of crypto-friendly bank, skale network introduces ethereum zk-rollup levitation protocol, ton foundation proposes burning 50% of network fees, formula 1’s red bull racing forges crypto alliance with mysten labs, avalanche hits 1 million monthly active users for the first time, rocket pool has been deployed on the zksync era network, rocket pool users will be able to move its token rETH faster and cheaper, rocket pool is a more decentralized liquid staking protocol that’s run by node operators, uphold offers easy, secure, reserved and transparent crypto platform to trade over 260+ cryptoassets, minimum of 0 locked acs tokens are required to access pro’s crypto ecosystem content from the block.',
  //   url: 'https://www.theblock.co/post/232862/ethereum-liquid-staking-protocol-rocket-pool-deploys-on-zksync-era',
  // },
  // {
  //   summary:
  //     "silvergate agrees with fed deadline for wind-down plan of crypto-friendly bank, skale network introduces ethereum zk-rollup levitation protocol, ton foundation proposes burning 50% of network fees, formula 1's red bull racing forges crypto alliance with mysten labs, avalanche hits 1 million monthly active users for the first time, circle says it's launching usdc natively on arbitrum, cross-chain transfer protocol to be brought to layer 2 network after launch of native usdc, circle rolls out euro coin stablecoin on avalanche network, uphold offers easy, secure and transparent crypto platform, lock acs tokens with the block to access pro's crypto ecosystem content.",
  //   url: 'https://www.theblock.co/post/232867/circle-says-its-launching-usdc-natively-on-arbitrum',
  // },
  // {
  //   summary: `avalanche, a layer 1 blockchain network, has crossed 1 million monthly active users for the first time. the recent launch of avacloud is the main reason for the growth, according to ava labs, the creator of avalanche. avacloud is a no-code platform for launching "custom blockchains," also known as subnets, on top of the avalanche network. several projects have committed to building subnets via avacloud, including korean conglomerate sk group, gaming app blitz, and aaa game studio shrapnel. circle, the issuer of the second-largest stablecoin usdc, announced recently that its euro-backed stablecoin euroc is now natively available on avalanche. alibaba's cloud division also built a launchpad for businesses to deploy metaverse spaces on the avalanche blockchain. avalanche is currently the seventh largest blockchain network with a total value locked or tvl of around $700 million.`,
  //   url: 'https://www.theblock.co/post/232881/avalanche-avax-1-million-mau',
  // },
  // {
  //   summary:
  //     "silvergate agrees with fed deadline for wind-down plan of crypto-friendly bank, skale network introduces ethereum zk-rollup levitation protocol, ton foundation proposes burning 50% of network fees, formula 1’s red bull racing forges crypto alliance with mysten labs, avalanche hits 1 million monthly active users for the first time, mysten co-founder and ceo evan cheng and three other former meta employees founded mysten in 2021, the company's sui network is a layer 1 blockchain positioned as a more efficient alternative to competitors, announcement comes ahead of this weekend’s formula 1 race in spain, uphold offers easy, secure, reserved and transparent crypto platform to instantly trade over 260+ cryptoassets, minimum of 0 locked acs tokens are required to access pro’s crypto ecosystem content from the block, locking acs tokens with the block is at your sole risk.",
  //   url: 'https://www.theblock.co/post/232800/formula-1s-red-bull-racing-forges-crypto-alliance-with-mysten-labs',
  // },
  // {
  //   summary:
  //     "silvergate agrees with fed deadline for wind-down plan of crypto-friendly bank, skale network introduces ethereum zk-rollup levitation protocol, ton foundation proposes burning 50% of network fees, formula 1’s red bull racing forges crypto alliance with mysten labs, avalanche hits 1 million monthly active users for the first time, the block unveils real-time news api for seamless integration of its sector-specific coverage of crypto and digital assets, the block pro has arrived with a new platform powered by industry's most sought-after experts, uphold offers easy, secure, reserved and transparent crypto platform to instantly trade over 260+ cryptoassets, lock acs tokens with the block to access pro’s crypto ecosystem content from the block",
  //   url: 'https://www.theblock.co/post/232778/the-block-unveils-real-time-news-api-for-seamless-integration-of-its-sector-specific-coverage-of-crypto-and-digital-assets',
  // },
  // {
  //   summary:
  //     "silvergate agrees with fed deadline for wind-down plan of crypto-friendly bank, skale network introduces ethereum zk-rollup levitation protocol, ton foundation proposes burning 50% of network fees, formula 1's red bull racing forges crypto alliance with mysten labs, avalanche hits 1 million monthly active users for the first time, bitcoin active users, fees and transactions had a wild ride in may amid memecoin mania, up to 16 million transactions in may, fees hit an average of $16.08 on may 11, memecoins total market value surpassed $900 million but has since receded to $475 million",
  //   url: 'https://www.theblock.co/post/232897/bitcoin-active-users-fees-and-transactions-had-a-wild-ride-in-may-amid-memecoin-mania',
  // },
  // {
  //   summary:
  //     'companies silvergate agrees with fed deadline for wind-down plan of crypto-friendly bank skale network introduces ethereum zk-rollup levitation protocol ton foundation proposes burning 50% of network fees formula 1’s red bull racing forges crypto alliance with mysten labs avalanche hits 1 million monthly active users for the first time uniswap community votes against initial feedback poll for protocol fee on trades uphold - easy, secure, reserved & transparent. discover and instantly trade over 260+ cryptoassets on uphold’s easy to use, 100% reserved and transparent crypto platform lock acs - a minimum of 0 locked acs tokens are required to access pro’s crypto ecosystem content from the block. if you elect to lock your acs tokens with the block, you acknowledge and agree that you will be subject to the terms and conditions of your third party digital wallet provider, any applicable terms and conditions of the access foundation, and any applicable terms and conditions of the block',
  //   url: 'https://www.theblock.co/post/232951/uniswap-community-votes-against-proposal-for-protocol-fee-on-trades',
  // },
  // {
  //   summary:
  //     'stablecoins offer global financial access and on-chain transactions without limitations, while fednow falls short in terms of utility, global reach and inclusivity. according to bitwise crypto research analyst ryan rasmussen, stablecoins are expected to maintain their relevance due to five clear advantages. these include making the us dollar more accessible worldwide, providing access to financial services, being borderless and accessible anywhere, allowing dollars to exist on-chain and having no transaction limits. stablecoins have seen a massive surge in demand with over $17 trillion transferred to date, including $2 trillion in q1 2023 alone.',
  //   url: 'https://blockworks.co/news/stablecoins-vs-fednow',
  // },
  // {
  //   summary:
  //     'connext is an interoperability protocol that has introduced chain abstraction to simplify the layer-2 experience for users. this allows users to interact with multiple dapps on different chains without ever needing to leave the user interface. connext plugs into native bridges to move data securely and has an optimistic system to shorten the time to move messages from rollups. it has been audited and is available to developers on various platforms, with dapps such as prode and fjord already adopting the concept. mainnet launches for other dapps integrating the connext toolkit are planned for the coming weeks.',
  //   url: 'https://blockworks.co/news/connecting-multichain-with-chain-abstraction',
  // },
  // {
  //   summary:
  //     'gamestop has partnered with the telos foundation to pilot a new web3 game launcher called gamestop playr. the intent of the platform is to deliver aaa studio games through the platform utilizing telos blockchain as the core infrastructure. some games that are compatible or “close to fully integrated” on the telos blockchain include gambling platforms such as w3poker and owldao, as well as a mobile game called monkey empire. head of business development at the telos foundation, aj dinger, said this partnership will drive new customers into the web3 gaming space and break down many of the barriers currently deterring web2 players from embracing web3',
  //   url: 'https://blockworks.co/news/gamestop-telos-game-launcher',
  // },
  // {
  //   summary:
  //     'the european parliament has commissioned a study to consider areas where the markets in crypto assets (mica) policy package may be lacking. the study found that mica does not adequately consider the nuances between different defi protocols and their respective levels of decentralization, and leaves out staking, lending and nfts altogether. the report also references us policy, noting that the eu should consider the us’s howey test when classifying tokens. industry members and lawmakers have admitted there are areas where mica falls flat for months ahead of the law’s enactment, but believe it is a great step forward for europe.',
  //   url: 'https://blockworks.co/news/european-parliament-mica-doesnt-touch',
  // },
  // {
  //   summary:
  //     "mysten labs, a web3 infrastructure firm, has partnered with oracle red bull racing to introduce their layer-1 platform sui to a new audience. the partnership was announced by adeniyi abiodun, mysten labs' co-founder and chief product officer, and christian horner, red bull racing team chief. this is the latest example of the crypto and racing worlds colliding, following okx's partnership with mclaren racing in may 2022 and the debut of a new nft ticketing system around last weekend's monaco formula one grand prix.",
  //   url: 'https://blockworks.co/news/sui-blockchain-formula-one-red-bull',
  // },
  // {
  //   summary:
  //     "the unlocking of tokens equivalent to 114% of optimism's previous circulating supply of its op token caused a steady decline of nearly 50% in the token's value over recent weeks. despite this market negativity, the convergence of a number of developments that are building on the op stack signals a positive outlook for the ambitious ethereum layer-2 solution. upcoming projects such as the bedrok upgrade, worldcoin and coinbase's base testnet are timed to maintain positivity. research analysts suggest that token value could hinge on whether the op stack chain returns revenue from the sequencer back to public goods funding.",
  //   url: 'https://blockworks.co/news/optimism-op-value-drops',
  // },
  // {
  //   summary:
  //     'two lords in england have expressed their concern that the bank of england is exploring technologies for implementing a digital pound without legislative backing. they are pushing for legislation that would guarantee that a “britcoin” could not be introduced without primary legislation and proper parliamentary scrutiny. the boe has been exploring a possible cbdc since last year and recently wrapped its distributed ledger technology project, project meridian. the us is also engaged in conversations about cbdc implementation, with florida having already enacted an anti-cbdc law and a bill being introduced on capitol hill to prevent a cbdc.',
  //   url: 'https://blockworks.co/news/lords-upset-britcoin-stealth-cbdc',
  // },
  // {
  //   summary:
  //     'uniswap community members voted on a proposal to switch fees, with 45% voting for no fee and 42% in favor of a fee equivalent to 1/5 of the pool fees across the v3 pools. over 23 million uni tokens voted in favor of turning on pool fees overall, but the proposal did not pass due to concerns around possible tax and legal implications. porter smith from a16z crypto team noted that if any action relating to the fee switch could result in a tax obligation, then there needs to be an ability to pay such obligation. a16z is actively looking at ways to create this programmatic flow of funds and will provide an update with solutions in the next month or so.',
  //   url: 'https://blockworks.co/news/uniswap-doesnt-pass-fee-switch',
  // },
  // {
  //   summary:
  //     "nike has partnered with ea sports to incorporate nft's into their games. nike has also launched its first nft collection, our force 1, and is working with top athletes such as cristiano ronaldo, lebron james, michael jordan and serena williams. the our force 1 collection is limited to those with .swoosh ids and the general access sale opened on may 24 and closed on june 1. more information about how nike's nfts will be included in ea's games will be released in the coming months.",
  //   url: 'https://blockworks.co/news/nike-nfts-ea-sports-games',
  // },
  // {
  //   summary:
  //     "openzeppelin's experiment tested whether openai's gpt-4 could identify smart contract vulnerabilities within 28 ethernaut challenges. gpt-4 was able to solve 19 of the 23 challenges before its training data cutoff date, but failed the final five tasks. it lacked knowledge of events after the cutoff date and did not learn from its experience. in some cases, it identified vulnerabilities correctly but failed to explain the correct attack vector or propose a solution. a security expert had to offer additional prompts to guide it to correct solutions. openzeppelin concluded that extensive security knowledge is necessary to assess whether the answer provided by ai is accurate or nonsensical and that human auditors are unlikely to be replaced in the near future. other crypto companies are more bullish on ai technology, but openzeppelin believes the weaknesses of large language models like chatgpt are too great to use reliably for security.",
  //   url: 'https://blockworks.co/news/openai-limited-success-iding-vulnerabilities',
  // },
  // {
  //   summary:
  //     'giddy has partnered with bitrefill to enable users to pay for everyday consumer items with cryptocurrency yield. users can access defi lending pools and general defi protocols to earn yield through their investments, and use the giddy app to access auto-compounding yield. users can purchase mastercard gift cards up to $10,000 if they provide identity information, and can use bitcoin, ether, usdc, usdt, litecoin, dogecoin, dash and binance pay to purchase gift cards. bitrefill has also partnered with other popular crypto wallets including binance pay, coinbase, kraken, trust wallet and bitfinex.',
  //   url: 'https://blockworks.co/news/giddy-defi-yield-gift-cards',
  // },
  // {
  //   summary:
  //     'folklore founder rafa spoke to host chase chapman about the complexities of standardizing a broader range of nft interactions on a recent episode of the on the other side podcast. he recognizes that, as much as it’s a cliché to say, we’re still very early. token standards like erc-721 are “very limited on purpose” and provide flexibility to service providers, but many common nft functions, like minting and burning, do not exist as standards. rafa suggests a pathway to greater content liquidity for creators through the expansion of standard sets, but whichever protocol “lobbies the hardest and has the largest voice” will be the most influential in determining the standard. in a more distant future, rafa envisions a solution that abstracts away these sorts of issues for creators so that their audience doesn’t even know what protocol they use.',
  //   url: 'https://blockworks.co/news/creators-need-token-standards',
  // },
  // {
  //   summary:
  //     'wrapped tokens were initially used as a band-aid solution to cross-chain interoperability, but they introduce counterparty risk and security challenges. they also cause fragmentation, making everything less efficient and more expensive for users. usdc and usdt are natively issued on dozens of chains, which has improved usd denominated markets across all of these ecosystems. the industry needs to shift toward true decentralization, upending the defi ecosystem for the better and making wrapped tokens obsolete in order to unlock defi access for the masses',
  //   url: 'https://blockworks.co/news/wrapped-tokens-obsolete-defi',
  // },
  // {
  //   summary:
  //     "deutsche telekom mms, a subsidiary of t-mobile parent company deutsche telekom, has become a validator on polygon, a popular ethereum scaling solution. they will be running nodes and providing staking services to polygon's supernets. deutsche telekom is also exploring the possibility of productizing their services and is working on an advanced solution specifically tailored for the ethereum network. they have previously supported infrastructure and run nodes on at least five other chains, including ethereum. to check on deutsche telekom's progress as a polygon validator, visit their page to see how much matic they have staked, their wallet balance, and the checkpoints they've signed off on.",
  //   url: 'https://blockworks.co/news/deutsche-telekom-polygon-validator',
  // },
  // {
  //   summary:
  //     'AI crypto tokens are digital assets that users can leverage to get access to AI technology. With the power of AI incorporated into the crypto space, it will be easier to strengthen the blockchain’s security, improve the user experience, and enhance scalability. The uses of AI crypto tokens are also prevalent – from blockchain governance to portfolio management. The primary drivers behind the popularity of AI tokens are mainly the rise and upsurge of different AI tools like ChatGPT and DALL.E. Top AI crypto tokens include Oasis, Rose, AITECH, Render, and Ocean Protocol. Oasis is a Layer-1 blockchain that creates a secure architecture by separating the smart contract execution procedure from the consensus mechanism process. Rose is the native token of Oasis and can be used for staking, governance, and transaction fees. AITECH is a deflationary Ai utility token which can be used to licence AIaaS (Artificial-Intelligence-as-a-Service), BaaS (Blockchain-as-a-Service), and HPC power (High Performance Computing). Render is a GPU network that excels in high performance and enables developers to code in different programming languages. RNDR is an ERC-20 token that powers the GPU rendering network. Ocean Protocol allows both businesses and individuals to see the full potential of their data and also monetize it by using ERC-20-based data coins. All these tokens offer unique features and use cases that make them attractive investments for investors and crypto enthusiasts alike. OCEAN is an ERC-20 token that provides added security through PoW mining. It can be used for staking, community governance on data, buying and selling data. Stakers can become liquidity providers in OCEAN-datatoken pools and earn a part of the transaction fees generated by the pool. The Graph is a decentralized, open-source protocol that serves as a global APU for indexing and organizing data. It indexes blockchain data in a similar way that Google indexes data on the web. GRT is the native token of The Graph, which is an ERC-20 token that runs on the Ethereum network and can be stored in ETH and ETH-compatible wallets. Fetch.ai is an AI lab building a decentralized platform that aims to create a new digital economy. FET is the utility token that can be used to find data on a blockchain through Fetch.ai. Staking FET allows validation nodes to facilitate network validation. All these tokens provide researchers and data analysts with reliable data they need to make informed decisions.',
  //   url: 'https://coingape.com/ai-crypto-coins/',
  // },
  // {
  //   summary:
  //     'floki inu has unveiled a strategic partnership with binance pay to boost adoption and provide more exposure to the 4th largest meme coin by market capitalization. users who purchase at least $1 worth of goods using floki through binance pay from any eligible binance marketplace merchants will be rewarded with cashbacks. the partnership also includes collaboration with aliexpress through shopping.io, giving floki exposure to billions of people in over 200 countries. coingape comprises an experienced team of native content writers and editors working round the clock to cover news globally and present news as a fact rather than an opinion.',
  //   url: 'https://coingape.com/floki-inu-announces-strategic-partnership-with-binance-pay/',
  // },
  // {
  //   summary:
  //     "xrp news: ripple's native crypto, xrp exhibited signs of major decoupling from the current market sentiment for the biggest of the digital assets. xrp price jumped by 9% in the last 30 days, while bitcoin (btc) took a dump of 5%. it is expected that xrp price might behave uniquely ahead as ripple's monthly escrow just got unlocked. xrp is on an upward trend as ripple labs, defendants in the lawsuit filed by u.s. securities and exchange commission (sec), has bagged several major wins. these positive updates helped the xrp price to jump by almost 50% on year to date (ytd) basis. however, ripple's native crypto might take a hit ahead as ripple unlocked its escrow to add 1 billion more xrp (approx worth $515 million) into circulation. whales have cumulatively moved almost 100 million xrp (approx worth $50 million) to crypto exchanges in order to dump amid the escrow transactions. xrp price has dropped by around 1% in the last 24 hours and is trading at an average price of $0.50, at the press time.",
  //   url: 'https://coingape.com/ripple-escrow-unlocked-whales-dump-100-million-xrp/',
  // },
  // {
  //   summary:
  //     'Crypto companies are popping up all around us due to the increasing demand for cryptocurrencies. To stay ahead of the competition, marketing has become one of the most important aspects of making a crypto project successful. A crypto marketing agency specializes in driving traffic, creating a trustworthy brand image, and making a crypto project visible. Web 3/Crypto marketing agencies can reward customers in digital tokens and cryptocurrencies in exchange for their engagement towards a brand or branding campaign. \n' +
  //     'This article will help you discover the top crypto marketing agencies in 2023. OMNI Digital Marketing Agency, Market Across, FINPR, Luna PR, EmergenceMedia.Agency, InCryptoland, CryptoPR, CryptoVirally, and Coinbound are some of the leading crypto marketing firms that offer comprehensive services to elevate blockchain projects to new heights. These companies specialize in PR distribution, influencer marketing, editorial services, ad campaign management, interviews, AMAs, Twitter Spaces, and more. They have vast networks of influencers and media outlets to ensure maximum exposure for clients’ projects and help them establish a prominent presence in the highly competitive market. Coinbound is a blockchain marketing agency that helps its clients to achieve aggressive virality on social media. After taking over the Twitter accounts of their clients, Coinbound saw a follower growth of more than 400%. They also offer PR services and help deliver coverage for their clients through their contacts at major publishing houses. Additionally, they provide SEO tailored specifically for web3 and discord services. Other blockchain marketing agencies such as TokenMinds, Blockchainmarketing.io, Kaikoku, SICOS, EMURGO, Blockchain Intelligence Group, Cryptoken Media, Yellow Mango, QuickShock, and Blockchain Intelligence Group are also available to help companies with their marketing needs. These firms offer services such as strategic and tactical marketing, digital consultancy services, digital marketing, enterprise architecture, business analysis, systems analysis, product ownership, Google Analytics Consultancy, paid search engine marketing, email marketing campaigns, content creation and copywriting, and SEO services. They also provide tools to ensure that companies mitigate any legal risks associated with working in the blockchain sector. With the help of these agencies, companies can launch successful digital marketing campaigns that help them maximize their ROI on ad dollars.',
  //   url: 'https://coingape.com/top-7-crypto-marketing-firms-of-the-year/',
  // },
  // {
  //   summary:
  //     'binance announces plan to delist and update the leverage and margins for the USDⓈ-M 1000LUNCBUSD Perpetual Contract on June 8. users are advised to close any open positions prior to the delisting time to avoid automatic settlement. varinder has 10 years of experience in the fintech sector, with over 5 years dedicated to blockchain, crypto, and web3 developments. he is currently covering all the latest updates and developments in the crypto industry. terra classic to under major changes in june including cosmwasm v2.1.0 parity upgrade, developer edward kim’s ai app chain “block entropy”, burn rate, validator commission fees, and others. these will potentially push up lunc prices after june.',
  //   url: 'https://coingape.com/just-in-binance-delists-terra-classic-lunc-perpetual-futures-contract-selloff-coming/',
  // },
  // {
  //   summary:
  //     'european central bank president christine lagarde said in a speech thursday that it is not yet apparent that core inflation has peaked in the euro zone, signaling further hikes in interest rates in the continent. data showed inflation in the 20-nation euro zone slowed markedly last month, indicating that the toughest monetary-tightening campaign of the euro era can soon draw to a close. however, lagarde said that there is no clear evidence of that yet, signaling more rate hikes in the coming months. core price pressures indicate that there’s probably still at least one more hike to come to ensure the 2% inflation target is reached. in the united states of america, fomc will meet on 15th and 16th june to decide further interest rate hikes. analysts are expecting one more hike in the interest rates in the current cycle. jai pratap is a crypto and blockchain enthusiast with over three years of working experience with different major media houses.',
  //   url: 'https://coingape.com/european-central-bank-chief-signals-further-hikes-in-interest-rates/',
  // },
  // {
  //   summary:
  //     'us futures pointed to a higher opening on thursday after the house of representatives passed a crucial deal aimed at averting a potential us default. the optimism was further fueled by hints from federal reserve officials suggesting a pause in interest-rate hikes. treasury secretary janet yellen had warned that the default could occur as early as monday, leading to growing apprehension in the markets. however, with a triumphant 314-117 vote in favor, the bill will now move to the senate, followed by the president’s signature to finally make it a law. futures contracts linked to the s&p 500 rose 0.34%, while the dow jones industrial average gained 48 points or 0.2% and the technology-heavy nasdaq composite advanced by 0.76%. the positive trajectory of us futures and the potential for a strong market opening can have a ripple effect on the broader cryptocurrency market. bitcoin’s price has witnessed a marginal increase of 0.35% while the price of ethereum experienced a surge of 0.28% in the minutes leading up to the market opening. most major altcoins followed a similar uptrend, with polygon, dogecoin and litecoin securing maximum price appreciation due to increased support from the community',
  //   url: 'https://coingape.com/us-futures-rise-signalling-crypto-market-rally/',
  // },
  // {
  //   summary:
  //     'binance on thursday burned 1.04 billion lunc tokens in the 10th batch of the lunc burn mechanism. traders responded immediately to the latest burn by binance and lunc price jumped. the total lunc burned by the crypto exchange as part of its monthly burn mechanism reached almost 33 billion. varinder has 10 years of experience in the fintech sector, with over 5 years dedicated to blockchain, crypto, and web3 developments. he is currently covering all the latest updates and developments in the crypto industry. other developments include burn tax changes, a 5% minimum commission fee for validators, and working with ustc repeg team to set up a ustc test environment.',
  //   url: 'https://coingape.com/binance-burns-billion-terra-classic-lunc-tokens-price-jumps/',
  // },
  // {
  //   summary:
  //     'south african cricket legend ab de villiers revealed how he became a victim of nft hack. he owned as much as 300 nfts before the hack. in an interview with cointelegraph, ab revealed that he tapped on a malicious link which looked very legit and ended up giving the hacker access to his wallet. he lost a good chunk of his collection before sending the remainder of his nfts to another wallet for safekeeping. ab is a fan of xrpw token and he started investing in it even before the sec lawsuit began. he got introduced to crypto through his brothers and likes bore ape nfts, neo tokyo and impostors. ab expressed his wish to explore web3 industry in various capacities. jai pratap is a crypto and blockchain enthusiast with over three years of working experience with different major media houses.',
  //   url: 'https://coingape.com/cricket-legend-ab-de-villiers-reveals-how-he-got-his-nfts-stolen/',
  // },
  // {
  //   summary:
  //     "sui network has announced a partnership with oracle red bull racing, one of the most popular formula one racing teams. as the team's official blockchain partner, this multi-year partnership will give fans more ways to connect with the team and sui blockchain will benefit from the massive publicity of the protocol to a global audience. sui network was launched recently to put a stop to scalability issues in the crypto ecosystem and is composed of meta alumni who worked on the libra/diem project. benjamin godfrey is a blockchain enthusiast and journalist who contributes to renowned blockchain based media and sites.",
  //   url: 'https://coingape.com/sui-network-becomes-the-official-blockchain-partner-of-red-bull-racing/',
  // },
  // {
  //   summary:
  //     'circle has announced the launch of native usdc on the arbitrum layer 2 network, which will eliminate bridge withdrawal delays, upgradeable smart contracts for future enhancements and the possibility for institutional on and off-ramps. the native usdc on arbitrum will remain fully reserved and always redeemable 1:1 for us dollars, ensuring stability and trust in the digital asset. circle plans to bring the cross-chain transfer protocol (cctp) to arbitrum following the launch of native usdc, allowing the stablecoin to move natively to-and-from ethereum and other supported chains within minutes. the official launch of native usdc on arbitrum is slated to happen on june 8.',
  //   url: 'https://coingape.com/crypto-news-circle-announces-launch-usdc-arbitrum/',
  // },
  // {
  //   summary:
  //     'attorney kylie chiseul kim moved the southern district court of new york to withdraw as counsel to ripple labs and the court granted the motion. defense lawyer james filan informed that no delay or prejudice to any party will result from the withdrawal. meanwhile, the wait for summary judgement in the sec lawsuit continues whereas the hinman speech documents are set for release by june 13, 2023. anvesh reports major crypto updates around regulation, lawsuits and trading trends and is currently based in hyderabad, india. published around 1,000 articles and counting on crypto and web 3.0. reach out to him at anvesh@coingape.com or twitter.com/bitcoinreddy',
  //   url: 'https://coingape.com/xrp-lawsuit-court-grants-ripple-lawyers-motion-to-withdraw-what-next/',
  // },
  // {
  //   summary:
  //     'elon musk is being sued for allegedly manipulating the price of dogecoin through his twitter posts, paid online influencers, and other publicity stunts. the lawsuit claims that musk exploited various platforms to trade profitably through multiple dogecoin wallets controlled by him or his electric vehicle company, tesla. the investors assert that these actions led to significant financial losses for themselves, while musk reaped substantial gains. the lawsuit is currently filed in the u.s. court of the southern district of new york and musk has previously sought the dismissal of the second amended complaint, dismissing it as a “fanciful work of fiction”. coin gape comprises an experienced team of native content writers and editors working round the clock to cover news globally and present news as a fact rather than an opinion.',
  //   url: 'https://coingape.com/breaking-elon-musk-faces-lawsuit-over-dogecoin-price-manipulation/',
  // },
  // {
  //   summary:
  //     'avalanche (avax) has reached a milestone of one million monthly active users (mau) about a week after the launch of avacloud platform, its innovative cloud computing service. ava labs, the creator of avalanche, believes the launch of avacloud has played a crucial role in the rapid growth of avalanche’s user base. avacloud is a no-code outfit that enables the creation and launch of “custom blockchains” on top of the avalanche network. several projects have committed to building subnets via avacloud, highlighting the growing recognition and adoption of avalanche’s customizable blockchain solutions across diverse industries. with one million monthly active users, the protocol has demonstrated its ability to handle a significant load of transactions and interactions on its network. looking ahead, the blockchain network’s rapid growth and expanding user base suggests a promising future for the platform as more developers and consumers discover the benefits of avalanche’s technology.',
  //   url: 'https://coingape.com/avalanche-hits-1m-monthly-active-users-a-week-after-avacloud-went-live/',
  // },
  // {
  //   summary:
  //     'the us federal reserve has ordered the crypto friendly collapsed bank, silvergate to carry on with its winding down operations. it gave the bank a 10 day deadline to submit detailed information regarding the process. bitcoin, the biggest cryptocurrency price dipped to trade around the $20k level at the beginning of march but registered a massive rally to end the month trading at around $28k level. silvergate witnessed heavy outflows during the bear market due to its dependency on the crypto market. ashish believes in decentralisation and has a keen interest in evolving blockchain technology, cryptocurrency ecosystem, and nfts. he aims to create awareness around the growing crypto industry through his writings and analysis.',
  //   url: 'https://coingape.com/banking-crisis-crypto-bank-silvergate-self-liquidation-fed-news/',
  // },
  // {
  //   summary:
  //     "silvergate bank has agreed to file a self-liquidation plan with california financial regulators within 10 days in response to a consent order issued by the federal reserve board. the bank has been ordered to responsibly manage its cash reserves and other available resources in order to compensate depositors in full. the order links the bank's failure to its involvement with the now-defunct crypto exchange, ftx. silvergate bank managed to weather the storm caused by ftx's collapse and absorb losses from the write-down on diem, a facebook-linked digital asset, by securing an emergency loan from the federal home loan bank of san francisco. coingape comprises an experienced team of native content writers and editors working round the clock to cover news globally and present news as a fact rather than an opinion",
  //   url: 'https://coingape.com/breaking-silvergate-bank-prepares-to-self-liquidate-following-fed-approval/',
  // },
  // {
  //   summary:
  //     'litecoin (ltc) is showing good price action to the north as the most-awaited litecoin halving event approaches closer. with the ltc halving event just two months away from here onwards, the on-chain transaction volumes on the litecoin blockchain and the whale activity have shot up. data from intotheblock also shows that litecoin witnessed a strong month in may 2023 with total ltc addresses surging past 8.5 million. litecoin (ltc) is one of the highly used payment cryptos and as a result, the total number of addresses for ltc easily exceeds other notable assets such as cardano, dogecoin, and polygon. if the increase in the on-chain volume for litecoin continues, it would be a strong sign that big players are willing to jump into the ltc investments ahead of halving. futures and derivatives contracts have also been buzzing recently with litecoin futures volumes surging past $472 million.',
  //   url: 'https://coingape.com/litecoin-ltc-jumps-by-over-5-with-strong-address-activity-before-halving/',
  // },
  // {
  //   summary:
  //     "on thursday, the us senate passed the bipartisan legislation to raise the us debt ceiling from $31.4 trillion, thereby averting the possibility of a default. markets reacted positively with the s&p 500 gaining 1% and the broader cryptocurrency market also gained over 1%. however, market analysts are not quite bullish as this raising of the debt ceiling may lead to further quantitative tightening which won't be a good sign for risk-on assets such as crypto and equities. bhushan is a fintech enthusiast who is interested in blockchain technology and cryptocurrency markets.",
  //   url: 'https://coingape.com/crypto-inches-bit-higher-as-us-senate-agrees-to-raise-debt-ceiling-whats-ahead/',
  // },
  // {
  //   summary:
  //     'crypto and stock markets recovered as the us senate passed the biden-mccarthy debt ceiling deal, with president joe biden to sign the deal and address averting debt default and the bipartisanship budget agreement tomorrow. the global crypto market cap increased 1.31% to 1.14 trillion on friday. bitcoin price rallied over 2% to hit a 24-hour high of $27,203, while ethereum price also jumped over 2% to almost $1900. the market expects the us nonfarm payrolls increased by 190,000 jobs in may, far lower than 253,000 in april. the unemployment rate is also expected to be higher in may, with consensus showing 3.5%. the ism manufacturing data on thursday also showed manufacturing activity contracted for the 5th consecutive month and price pressures eased significantly. these macro factors will potentially allow the us federal reserve to “skip” an interest rate hike this month for the first since maintaining its hawkish approach for more than a year. as a result of us debt ceiling deal and fed eyeing to skip a rate hike, the benchmark treasuries and the us dollar dipped today with us dollar index (dxy) falling below 103.50 from a high of 104.50 this week. the global stock market rallied on cues from the us debt ceiling deal and fed pause talks, with all global stock indices expect to close green on friday. btc price currently trades at $27,145, with a 24-hour low and high of $26,574 and $27,203 respectively. altcoins followed suit and rose higher, with eth price trading 2% higher at $1,891. varinder has 10 years of experience in the fintech sector, with over 5 years dedicated to blockchain, crypto, and web3 developments. being a technology enthusiast and analytical thinker, he has shared his knowledge of disruptive technologies in over 5000+ news, articles, and papers.',
  //   url: 'https://coingape.com/bitcoin-ethereum-recover-on-debt-ceiling-deal-us-fed-pause-easing-jobs-market/',
  // },
  // {
  //   summary:
  //     'popular crypto influencer ben.eth launched his another project today after rug pulling three coins in a month and making millions of dollars from the scheme. he then announced another project, presale for his new token psyop, liquidated the supply and swapped everything for eth, leaving his project worthless and making off with millions from his followers. ben.eth then announced a third project loyal, allocating 33% to users who bought the token on pre-sale and keeping 67% of the remaining tokens. he also partnered with bitboy and dropped a 10,000 collection of orange square nfts for 0.1eth. as per a recent report from blockchain security firm beosin, rug pulls and exit scams losses in the cryptocurrency market surpassed those from decentralized finance (defi) hacks in may with over $45 million in total losses  jai pratap is a crypto and blockchain enthusiast with over three years of working experience with different major media houses',
  //   url: 'https://coingape.com/ben-eth-launches-another-project-after-three-rugpulls-in-a-month/',
  // },
  // {
  //   summary:
  //     'hong kong is set to receive its first spot bitcoin etf while the us securities and exchange commission remains reluctant to approve one. virtual asset management firm vsfg (yibo finance) is negotiating with hong kong exchange-traded fund (etf) issuers and regulators to allow funds tracking spot bitcoin prices to be listed as etfs. the firm is also applying for a virtual asset service provider (vasp) license and a category 7 license for automated trading services. recently, samsung asset management hong kong launched a bitcoin futures etf. hong kong allowed retail investors to trade top cryptocurrencies but not stablecoins due to pending regulations. top crypto exchanges such as okx and huobi are applying for licenses in hong kong. varinder has 10 years of experience in the fintech sector, with over 5 years dedicated to blockchain, crypto, and web3 developments. he is currently covering all the latest updates and developments in the crypto industry.',
  //   url: 'https://coingape.com/while-us-awaits-hong-kong-to-get-its-first-spot-bitcoin-etf/',
  // },
  // {
  //   summary:
  //     'the terra classic community is looking for ways to revive lunc and ustc prices to $1. the current proposal seeks to increase the on-chain tax to 1.5%, with a 1.2% burn tax and 0.3% to the community pool. the proposal has received 20% votes in favor and 77% “no with veto” votes, with other top validators yet to vote. the terra classic chain will undergo a major v2.1.0 upgrade on june 14 that will bring the chain in parity with blockchains such as terra 2.0 and cosmos. core developer edward kim’s ai app chain “block entropy” will integrate into terra classic soon. lunc price jumped 1% in the last 24 hours, with the price currently trading at $0.000085, however, trading volume continues to be lower. varinder has 10 years of experience in the fintech sector, with over 5 years dedicated to blockchain, crypto, and web3 developments. he is currently covering all the latest updates and developments in the crypto industry',
  //   url: 'https://coingape.com/lunc-news-terra-classic-community-votes-on-proposal-vision-plan-for-lunc-to-1/',
  // },
  // {
  //   summary:
  //     'european stock markets opened higher friday morning as the us passed a bill to raise the debt ceiling and cap government spending for two years, averting a global economic catastrophe. jai pratap is a crypto and blockchain enthusiast with over three years of working experience with different major media houses. his current role at coingape includes creating high-impact web stories, cover breaking news, and write editorials. the debt ceiling bill passed the senate vote late thursday, after passing the house of representatives on wednesday. the uncertainty around the debt ceiling bill has only slightly rattled markets in the past month. now all eyes turn to the outlook for the u.s. economy, recession risk, and whether the federal reserve will raise, pause or even look at beginning to cut interest rates. european central bank president christine lagarde said inflation was still “too high” and that the hiking cycle needed to continue until it was clear inflation would come down to its 2% target in a “timely manner”. jai pratap also reads russian literature or watches some swedish movie when not working.',
  //   url: 'https://coingape.com/europe-stocks-rise-after-hitting-two-month-lows-amid-us-debt-deal/',
  // },
  // {
  //   summary:
  //     'proof of stake is a consensus algorithm whereby new blocks are secured by validators before being added to the blockchain. validators stake a certain amount of coins in a bound wallet and are rewarded with block rewards and transaction fees. it is more energy efficient and environmentally friendly than proof of work and has a reduced threat of 51% attack. popular coins that use proof of stake include neo, lisk, stratis, pivx, okcash, nav coin and ethereum which is transitioning to a proof of stake system.',
  //   url: 'https://www.coinbureau.com/education/comprehensive-guide-pos-mining/',
  // },
  // {
  //   summary:
  //     "In 2021, cryptocurrency has become increasingly popular, with more people asking about crypto-related matters than ever before. Institutional money is pouring in, and people who used to pooh-pooh crypto are now showing interest via NFTs. For those still on the sidelines, they may need some convincing. Brenda, a college student and art school student, found a way to explain cryptocurrency and Bitcoin to her grandmother, Nana. She showed her an app with her bank balance of 6-figure digits, which she got from buying and selling cryptocurrency early in the year. She explained that cryptocurrency is digital money used for buying and selling mostly digital stuff, but it's not controlled by a bank. She used the example of a $5 bill to explain how transactions work and how blockchain technology makes it safe like a bank. She also explained that banks don't need our money and can make money out of thin air. Jessica, Brenda's mother, was worried about where Brenda got the money for the teapot she bought for Nana until Brenda explained her cryptocurrency dealings. To wrap up, Nana advised Brenda to talk to her mother about it and Jessica gave Brian a Ledger Nano X as a Christmas present. In this article, Julie-Anne Chong explains the basics of cryptocurrency to a friend. She explains that Bitcoin is the first cryptocurrency to appear and was created by Satoshi Nakamoto in 2008. It works by rewarding people who keep records of the movement of Bitcoin on the network with Bitcoin. Ethereum is another cryptocurrency that has a much bigger plan than Bitcoin. It uses blockchain technology and has a smart contract that works on the Ethereum blockchain. People pay gas fees in ETH and services built on Ethereum also accept ETH as payment. ETH is also destroyed as it is used, making it different from cash. Lastly, she explains that Ledger devices don't store crypto but give access to what can be claimed on the blockchain. Crypto is a complicated and sometimes confusing world, but with patience and understanding, it can be explained to non-techies.",
  //   url: 'https://www.coinbureau.com/education/explaining-crypto-to-your-family/',
  // },
  // {
  //   summary:
  //     'Decentralized Finance (DeFi) is a revolutionary concept that has the potential to dethrone the traditional financial system and bring financial health and freedom to the masses. It is a peer-to-peer payment system that cuts out third-party intermediaries, allowing users to access lending products for much lower interest rates and less red tape, while also providing investors and those willing to lend with significantly higher returns than any bank will ever give their customers. However, DeFi also has its share of risks such as lack of anonymity, personal risk, regulatory crackdowns, vulnerabilities in the code, lack of liquidity, impermanent loss, flash loan attacks, and rug pulls. Despite these risks, DeFi is still a promising technology that can revolutionize the way we handle our finances. In 2020, blockchain fraud exceeded hacks and thefts as the primary risk for users of decentralized finance (DeFi) applications. DeFi users need to put up crypto as collateral and lock it in for a period of time, which can be risky due to the volatile nature of cryptocurrencies. To minimize risk, users should stick to tried and tested DeFi platforms, look for independent audit checks, consider CeDeFi or CeFi platforms, check for liquidity and total value locked (TVL), do their own research (DYOR), look for open source code, keep their wallets safe, and be aware of scams. Additionally, Binance offers a level of protection to investors and are willing to pull from their own treasury to reimburse clients who suffer hacks. By being careful, doing research, being skeptical, and using due diligence, users can navigate DeFi with as little risk as possible.',
  //   url: 'https://www.coinbureau.com/adoption/how-safe-is-decentralized-finance/',
  // },
  // {
  //   summary:
  //     "Crypto investing has become increasingly popular in recent years, with many people looking for the next big opportunity. Blockchain games are one such opportunity, with projects like Axie Infinity and Cryptoblades already showing us what they can do. In 2021, the NFT market surged from nothing to $10.7 billion, and blockchain gaming is already taking off late in 2021. These games are revolutionizing the world with their play-to-earn gaming model, and many analysts believe that blockchain gaming is a trend that is here to stay. Projects like Axie Infinity and Cryptoblades have already seen massive returns, and there are still plenty of opportunities to be found in this budding industry. Other projects worth keeping an eye on include Star Atlas, which is an ambitious gaming and metaverse project, and Atari Chain, which has made its entrance into blockchain gaming in a big way. With the right research and knowledge, investors can make life-changing wealth from these projects. Atari has 50 years of experience in the video game industry and is now fully immersed in NFTs, Blockchain gaming, and metaverses. Investors and gamers can gain exposure to Atari’s upside potential by purchasing Atari Token (ATRI) and keeping an eye on future launch dates for projects. Big Time is another blockchain gaming NFT project with an all-star team of gaming industry veterans from companies such as Epic Games, Blizzard, EA, and Riot. It is a multiplayer RPG where players can team up with friends to adventure across time and space while collecting valuable NFTs. NovaX provides players with the opportunity to own their own planet, with players needing to own one to play the game and there can only ever be 8,888 planets minted. Players can construct and level up buildings on their planets, each building having a different function. Phantom Galaxies is an open-world space sim with fast-paced mech shooter action and an enticing storyline. Players can go on space missions and into battle, provide an education for their soldiers so they can be better equipped for those missions, and build up an intelligence agency to gain valuable information about missions. Cradles: Origin of Species is a game that begins in prehistoric times where a player must first get familiar with the landscape and gameplay, hunting and protecting a village. The game takes a seriously evolutionary turn as players come across or purchase crystals with the DRepublic Coin (DRPC) that they can use to make props or use TimeSpaceSand to travel through time and space. The world will offer a main city and adventure area, in which players can find creatures that have long been extinct. Players can create their own worlds, introducing different species, landscapes, cities and building constructs to see how long their ecosystem can last. Cradles creates open worlds that lacks in mainline and background stories which is up to the player to develop. Third parties can interact with the world, players can introduce new features and concepts in the world and vote on future development proposals. Cradles is a blockchain gaming project that is looking to create the world's biggest metaverse yet. It is a salute to all life and civilization that has ever existed on Earth and will be developed by the combined actions of the Cradles community. Enjinstarter Launchpad is a great option for investors looking to get into projects early and offers early access to the next big projects gaming and metaverse projects. Blockchain gaming is revolutionizing economies as thousands of people who struggled in poverty are now able to earn a living wage by playing games, and people quitting their full-time jobs to earn higher salaries in virtual worlds that pay them in cryptocurrencies. This revolution is being referred to as the largest transfer of wealth in human history, with opportunities for investment and wealth generation of this scale being something that comes along once a century or less. With advancements in technology, blockchain technology, NFTs, and gaming all merging together, we are at the crux of a fourth revolution that will shape our lives and the future in ways we can’t even fully conceive yet.",
  //   url: 'https://www.coinbureau.com/analysis/blockchain-games-investing/',
  // },
  // {
  //   summary:
  //     "Crypto debit cards are becoming increasingly popular as a way to spend crypto easily and safely. The seven best crypto cards available right now are Crypto.com, Nexo, Monolith, BlockCard, Wirex, BitPay, and Coinbase Card. Crypto.com offers metal cards with cashback and rewards, Nexo allows users to spend their crypto without selling it, Monolith is a non-custodial card built on Ethereum, BlockCard is US and global-friendly, Wirex is a great choice for those who want to save on fees, BitPay is perfect for those who want to use Bitcoin, and Coinbase Card is the best choice for those who want to use multiple coins. Each card has its own benefits and rewards and some will only be suitable for those living in certain countries or regions. The BlockCard is a Visa debit card that allows users to preload crypto in much the same way as other cards on this list. It supports an impressive list of crypto assets and there are no deposit exchange or withdrawal charges. What makes the Unbanked Blockcard different is that a user's crypto remains as crypto right up until the point of sale. It also works with Apple and Google Pay, and users can earn rewards by staking UNBK tokens. Wirex is another Visa-backed card that supports a great list of supported assets and fiat currencies, and offers a decent crypto cashback return of up to 2% in WXT for spending with the card. BitPay is available in the US and has daily spend limit of $10,000 and daily ATM withdrawal limit of $500. Coinbase Card is available in Europe and supports nine different cryptos but has high fees. All these cards offer different features and benefits, so it's important to consider all factors before choosing one.",
  //   url: 'https://www.coinbureau.com/analysis/best-crypto-debit-cards/',
  // },
  // {
  //   summary: '',
  //   url: 'https://www.coinbureau.com/services/crypto-tax-software/',
  // },
  // {
  //   summary:
  //     'Technical analysis is a practice of using past price information on an asset to make forecasts about its future direction. It is based on the notion of behavioral economics, believing that price trends tend to repeat themselves due to the collective behavior of investors. It can be used to map the price of any asset over any period of time and is not an exact science. Critics of technical analysis argue that it is subjective and that it cannot yield excess returns in the long run. However, these arguments can be refuted by showing that technical analysis can be used as a tool to inform trading decisions and manage risks. It has advantages over fundamental analysis, such as being less opinionated and better for risk management. Technical analysis should not be used in isolation, but rather as part of a broader strategy that incorporates other forms of analysis. Technical analysis is a tool used by traders to make calculated and risk-controlled trades on a consistent basis. It involves analyzing the price movements of an asset over a period of time in order to identify patterns and trends that can be used to predict future price movements. Traders will usually hold the asset over a long period of time in the hope that the price will eventually reflect their analysis. Technical traders often incorporate stop losses, limit and take profit positions based on technical levels, allowing them to quickly cut losses if their analysis appears to be wrong. Technical analysis can be effective in liquid markets with high volume, but is less effective in smaller market cap coins due to market manipulation. To be successful, traders should use technical analysis in a systematic and methodical way, disregarding emotions and augmenting their analysis with other indicators and fundamental research.',
  //   url: 'https://www.coinbureau.com/education/crypto-technical-analysis/',
  // },
  // {
  //   summary:
  //     'Taurus is a digital asset infrastructure provider that offers custody, tokenization, and trading of digital assets. They recently linked with the Ethereum scaling network Polygon to support staking and decentralized finance (DeFi). Tokenization is seen as attractive to mainstream financial institutions and Bank of America reported that the tokenized gold market had surpassed $1 billion in April. Polygon is designed to process transactions quickly and at a lower cost than the main Ethereum network. It also has aspirations to expand beyond Ethereum to become an "internet of blockchains".',
  //   url: 'https://www.coindesk.com/business/2023/06/02/credit-suisse-deutsche-bank-backed-taurus-deploys-on-polygon-blockchain/',
  // },
  // {
  //   summary:
  //     "the us economy added 339,000 jobs in may, higher than economist forecasts of 195,000. the unemployment rate rose to 3.7% and average hourly earnings were up 0.3% in may versus april's 0.4%. the federal reserve has embarked on an historic string of rate hikes since early 2022 but the strong employment market has given them reason to continue tightening monetary policy. markets are divided on whether the fed will again boost rates and this switch in attitude has taken its toll on bitcoin, which tumbled from nearly $30,000 to the $27,000 level it was at just prior to this morning's data",
  //   url: 'https://www.coindesk.com/business/2023/06/02/us-adds-339k-jobs-in-may-blowing-through-estimates-for-195k-bitcoin-steady-at-27k/',
  // },
  // {
  //   summary:
  //     'opnx has issued a new governance token called "open exchange token" (ox) designed to reduce trading fees on the platform. zack seward, jennifer sanasie, william foxley, wendy o and will foxley are the hosts of "the hash" on coindesk tv, a daily news show that connects the dots on why crypto stories matter beyond crypto native communities. the coindesk bitcoin price index (x bx) is the world’s leading reference for the price of bitcoin used by the largest institutions active in crypto assets. consensus 2024 is coindesk’s longest-running and most influential event that brings together all sides of crypto, blockchain and web3. bitcoin has started june dropping back below $27k and is on pace for its first monthly loss in 6 months. ripple exec discusses cbdc platform rollout and axie infinity game debuts on apple app store in key markets.',
  //   url: 'https://www.coindesk.com/tv/the-hash/upcoming-the-hash-6223/',
  // },
  // {
  //   summary:
  //     "litecoin (ltc) has begun the month with a rally, rising 7% over the last 24 hours. bulls are noting the network's halving in two months and a significant uptick in activity in may. litecoin is up 7.5% over the last 30 days, outperforming bitcoin and ether. data from intotheblock shows that the total of addresses holding a balance has now pushed to nearly 8.5 million. litecoin is also approaching a halving in august which analysts are deeming a significant event for both the network and the price of ltc. investors are anticipating the halving to push the price of btc, ltc and the market. litecoin might also be benefitting from the congestion that the bitcoin network has been witnessing due to the recent burst of activity related to the ordinals protocol, leading to soaring costs for users. open interest for litecoin futures and perpetual contracts during the last week of may has risen by 30%.",
  //   url: 'https://www.coindesk.com/markets/2023/06/01/litecoin-starts-june-strong-as-investors-eye-august-halving-uptick-in-activity/',
  // },
  // {
  //   summary:
  //     'EtherCoinbaseTether\n' +
  //     '\n' +
  //     "coinbase derivatives exchange is set to offer bitcoin and ether tracked futures for institutional clients starting june 5. the news comes as tether's usdt has hit an all-time high market capitalization, even as the stablecoin market overall is shrinking. bitcoin climbed nearly 1% to back above $27,000 ahead of the u.s. government's nonfarm payrolls report set to release at 8:30 am et. stocks and gold also inched upward, with some analysts predicting the jobs report might push the metal back above $2,000. top performing digital assets include quant network (qnt) and the graph (grt), which gained 16% and 14% respectively over the last seven days.",
  //   url: 'https://www.coindesk.com/markets/2023/06/02/first-mover-americas-bitcoin-bounces-back-to-27k-ahead-of-jobs-report/',
  // },
  // {
  //   summary:
  //     'Cathedra BitcoinCoinDesk\n' +
  //     '\n' +
  //     'cathedra bitcoin (cbit) plans to deploy equipment at a texas site owned by 360 mining, which uses off-grid natural gas to supply electricity for bitcoin production. the agreement covers a total supply of 2 megawatts of mining capacity, with an initial 0.3 megawatt deployment in the next 60 days. the deal sees vancouver-based cathedra paying $55 per megawatt hour of power used plus 10% of gross bitcoin mined at the site to the austin, texas-based company. cathedra said the agreement makes it the first publicly listed miner utilizing both on- and off-grid energy, allowing them to escape criticism of destabilizing the electricity grid due to power consumption and providing the option of selling power to the grid if advantageous',
  //   url: 'https://www.coindesk.com/business/2023/06/02/cathedra-bitcoin-to-deploy-crypto-miners-at-360-minings-texas-site/',
  // },
  // {
  //   summary:
  //     'Bitcoin is experiencing selling pressure at the $28,000 price level, which may be due to miners being forced to liquidate any new inventory produced as profit margins have compressed in recent weeks. Mining difficulty has hit an all-time high and most machines produced before 2022 appear to be unprofitable. This means miners are selling their inventory instead of holding on till prices increase. There is upside convexity for miners if bitcoin prices increase by 10% plus. CoinDesk journalists are not allowed to purchase stock outright in Digital Currency Group, but may receive exposure to DCG equity in the form of stock appreciation rights.',
  //   url: 'https://www.coindesk.com/markets/2023/06/02/bitcoin-miners-are-probably-selling-their-output-at-the-28k-level-matrixport/',
  // },
  // {
  //   summary: '',
  //   url: 'https://www.coindesk.com/podcasts/coindesks-money-reimagined/exploring-the-intersection-of-money-regulation-and-technology-insights-from-europes-post-brexit-crypto-landscape/',
  // },
  // {
  //   summary:
  //     "scryptocurrencyBinance australia has halted australian dollar (aud) deposits and withdrawals by bank transfer. users can still buy and sell crypto using credit or debit cards, and the exchange is working hard to find an alternative provider. bitcoin (btc) has been trading at nearly a 20% discount on binance’s australia arm compared with rival exchanges. in april, after a request from binance, the australian securities and investments commission (asic) canceled binance australia's derivatives license. coinbase and other companies have held consultations with australia's treasury and reserve bank.",
  //   url: 'https://www.coindesk.com/business/2023/06/02/binance-australia-stops-aud-bank-transfers-as-search-for-payment-partner-drags-on/',
  // },
  // {
  //   summary:
  //     'Coinbase Derivatives Exchange, a regulated futures offering by crypto exchange Coinbase (COIN), will offer bitcoin (BTC) and ether (ETH) tracked futures for institutional clients starting June 5. The BTI and ETI futures contracts, sized at 1 bitcoin and 10 ether per contract respectively, will be settled in U.S. dollars monthly and let institutional traders hedge market bets, express long-term market views, or utilize the products in complex trading strategies. Crypto derivatives markets are a popular, albeit mostly unregulated, market among participants with over $134 billion in notional volume traded across exchanges in the past 24 hours. coinbase said btc and eti are offered at “significantly lower fees” compared to traditional offerings.',
  //   url: 'https://www.coindesk.com/markets/2023/06/02/coinbase-derivatives-exchange-to-offer-institutional-bitcoin-and-ether-futures/',
  // },
  // {
  //   summary:
  //     "Uniswap community members voted on a proposal to charge fees from liquidity providers (LPs) on the protocol, with 45% voting for 'no fee' and 42% voting for one-fifth of the fee generated by Uniswap version 3 (V3) pools to be charged to LPs. an early temperature check for such a feature in December concluded that users were positive about the change but remained cautious. results of the poll could likely mean a formal poll expected for later this year incorporates community sentiment and changes parameters to keep community members satisfied. a gfx labs' proposal floated earlier this year strived to change that, noting that uniswap is in a strong position to turn on protocol fees and prove that the protocol can generate significant revenues. lps making the most money off uniswap are not retail traders, they are professional market makers, just like the ones seen on traditional exchanges.",
  //   url: 'https://www.coindesk.com/tech/2023/06/02/uniswap-community-votes-down-protocol-fees-for-liquidity-providers/',
  // },
  // {
  //   summary:
  //     'PacificBitcoin prices remain below $27K, but an analyst says that the largest crypto by market value is in an "accumulation phase." BRC-20 tokens reach toward a $500 million market cap, and Glassnode data shows that they continue to be a lucrative source of fees for miners. Ether is up 0.6% over the past 24 hours, while litecoin continues its recent winning ways to rise more than 3%. U.S. equities closed largely up, despite ongoing concerns about the inflation and the potential for more hawkish interest rate hikes this year.\n' +
  //     '\n' +
  //     `bitcoin prices remain below $27k but an analyst says it is in an accumulation phase. brc-20 tokens are pushing toward a market cap of $500 million and are a lucrative source of fees for miners. ether is up 0.6% over the past 24 hours while litecoin continues its recent winning ways to rise more than 3%. u.s. equities closed largely up despite ongoing concerns about inflation and potential for more hawkish interest rate hikes this year. maverick's baxley wrote optimistically that crypto investors seem "to be a general accumulation phase" and what matters most is liquidity which depends on how carefully the treasury can carry out its replenishing process.`,
  //   url: 'https://www.coindesk.com/markets/2023/06/02/first-mover-asia-bitcoin-has-reached-a-general-accumulation-phase-analyst/',
  // },
  // {
  //   summary:
  //     'Christy Goldsmith Romero\n' +
  //     '\n' +
  //     "the cftc has proposed an overhaul of its rules for risk management, commissioner christy goldsmith romero said the changes should prepare firms for crypto volatility and the risks from holding customers' digital assets. romero said technological advancements necessitate revisiting regulatory oversight, including risk management requirements. she flagged ongoing issues regarding the industry's custody practices, saying brokers may explore holding customer property in the form of stablecoins or other digital assets that could result in unknown and unique risks. the cftc will take public comments for 60 days on its advance notice of proposed rulemaking before a formal proposed rule and then a vote on a final version",
  //   url: 'https://www.coindesk.com/policy/2023/06/02/us-commodities-agency-may-change-risk-rules-to-consider-crypto/',
  // },
  // {
  //   summary:
  //     'Disclosure\n' +
  //     '\n' +
  //     `tether's usdt has regained its previous all-time high market capitalization despite a shrinking stablecoin market. the milestone is significant as it runs counter to a 14-month stablecoin market decline. usdt has greatly benefited from the recent woes of its closest rivals and has been criticized for years for lack of transparency about its reserve assets. stablecoin holders have flocked to usdt due to its perceived safety from u.s. regulators and banks, propelling its market share to its highest level in at least 22 months. kaiko raised suspicion about what it termed usdt's "inordinate" market cap surge because the increase was inconsistent with a plunge in trading volumes to multi-year lows. paolo ardoino, tether's chief technology officer, said that the difference comes from usdt's growing use for payments predominantly in the developing world, which now accounts for about 40% of all token activity`,
  //   url: 'https://www.coindesk.com/markets/2023/06/01/tether-market-cap-climbs-to-all-time-high-of-832b-even-as-stablecoin-market-sinks/',
  // },
  // {
  //   summary:
  //     "adam b. levine hosted an episode discussing the european parliament's call to treat crypto as securities by default, usdc issuer circle ditching u.s. treasuries from $24b reserve fund, elizabeth warren calling for shutdown of crypto funding for fentanyl, jimbos protocol working with u.s. homeland security to help recover $7.5m from flash loan exploit, and other stories such as brent crude oil continuous contract overview, debt ceiling saga, desantis and the growing culture war around bitcoin, cathie wood's thoughts on the u.s. crypto exodus, will the u.s. pay its bills after june 1st?, bitcoin dropping back to 24k, lawsuit questions from crypto engineers and investors, consensus survey on tradfi investors' bullishness on crypto's long-term prospects, jamie dimon's warnings on qt, and elizabeth warren's bill not stopping money laundering but potentially banning crypto",
  //   url: 'https://www.coindesk.com/podcasts/markets-daily/crypto-update-markets-are-mixed-as-the-current-debt-ceiling-resolution-bill-could-be-a-double-whammy-for-liquidity/',
  // },
  // {
  //   summary:
  //     'dropped slightly on thursday, with bitcoin trading at about $26,950, down 0.5% over the past 24 hours. ether was recently trading at about $1,870, up slightly from wednesday. other major digital assets were mostly down, although litecoin rose more than 7%. coinmarketindex dropped 0.4%. stocks rose a day after the u.s. house of representatives passed a bill to raise the debt limit. gold inched up 0.6%. venture funding is creeping back in and there is positive energy flowing into the space which sets the foundations for the next bull cycle.',
  //   url: 'https://www.coindesk.com/markets/2023/06/01/bitcoin-lingers-under-27k-to-continue-its-may-sluggishness-amid-inflation-concerns/',
  // },
  // {
  //   summary:
  //     "investors have been cautious about parking their funds with centralized exchanges due to the collapse of large crypto projects like ftx and blockfi. decentralized finance (defi) protocols have risen to provide customers with the ability to earn rewards from staking and yield farming without tokens ever leaving their wallet. launched in 2023, yieldflow is one such protocol that acts as a connector between investors and staking pools, making it simple to earn a yield without funds ever leaving a user's wallet. users can also put their crypto to work in other ways, including liquidity mining and lending. yieldflow curates the available options to ensure the highest quality and regularly adds new products and coins to the platform. users can access the best of defi without the risk of impairment loss from relying on a centralized exchange.",
  //   url: 'https://www.coindesk.com/sponsored-content/yieldflow-is-driving-web3-adoption-by-making-it-easy-to-earn-passive-income-safely/',
  // },
  // {
  //   summary:
  //     'Real World Assets\n' +
  //     '\n' +
  //     'real world assets (rwa) are a use case for blockchain technology that is expected to reach between $4 trillion and $16 trillion by 2030. rwa tokens are representations of assets that are not necessarily blockchain-native, and are not volatile assets like crypto. they are programmable and can be used for transparency, efficiency, liquidity, self-custody, and collateralization. advisors should understand the increased transparency and liquidity of rwa tokens, as well as self-custody and the efficiencies and security risks associated with it. clients may have the chance to invest in alternatives such as private credit, real estate, and collectibles with double-digit returns without crypto volatility risk. the increase in activity around rwa will also drive more use of the networks, potentially triggering higher token prices.',
  //   url: 'https://www.coindesk.com/markets/2023/06/01/for-financial-advisors-real-world-assets-could-be-a-safer-path-to-crypto/',
  // },
  // {
  //   summary:
  //     "on this episode of the hash, the panel discusses bankruptcy claims exchange opnx issuing a new governance token, the european parliament's study that cryptocurrencies should be treated as securities by default, and blockchain sui signing a multi-year deal with red bull racing. other topics discussed include binance reevaluating roles after reported job cuts, the future of winklevoss twins' gemini exchange, criminal charges against sam bankman-fried, ether balance on exchanges nearing all-time low, sam altman's crypto project worldcoin raising $115m, cathie wood saying us is 'losing' the bitcoin movement, ledger delays key-recovery service after uproar, bitcoin-based nfts popularity increasing, tornado cash attacker submitting proposal to undo attack, bitcoin pizza day turning sour, coinbase praising canada's crypto approach, ledger's new bitcoin key recovery feature debate swirling, ripple starting platform for central banks to issue their cbdcs, and us crypto firms moving offshore 'welcome' in france.",
  //   url: 'https://www.coindesk.com/podcasts/coindesk-podcast-network/opnx-issues-new-governance-token-european-parliament-study-examines-crypto-assets/',
  // },
  // {
  //   summary: '',
  //   url: 'https://www.coindesk.com/web3/2023/06/01/japans-largest-airline-group-ana-launches-nft-marketplace/',
  // },
  // {
  //   summary:
  //     'EA Sports\n' +
  //     '\n' +
  //     "nike virtual studios and ea sports are partnering together to bring digital creations from nike's .swoosh platform to the ea sports gaming ecosystem. this includes immersive experiences and new levels of customization within the ea sports ecosystem. nike's .swoosh platform released its first non-fungible token (nft) sneaker collection last week, surpassing $1 million in sales. the partnership will allow .swoosh members and ea sports fans to express their personal style through play. coin desk is a media outlet that strives for the highest journalistic standards and abides by a strict set of editorial policies. coin desk journalists are not allowed to purchase stock outright in dcg. rosie perper is the deputy managing editor for the web3 news section, focusing on the metaverse, nfts, daos and emerging technology like vr/ar",
  //   url: 'https://www.coindesk.com/web3/2023/06/01/nike-is-bringing-its-swoosh-nfts-to-ea-sports-games/',
  // },
  // {
  //   summary: `makerdao's community voted to ditch $500 million paxos dollar (usdp) stablecoin from the lending protocol's reserves. nike teams up with ea sports and coindesk's jennifer sanasie presents the major stories shaping the crypto industry on "coindesk daily". consensus 2023 highlights, bermuda's premier addresses ftx implosion, state of crypto regulation, yat siu on significance of building on permissionless chains, caitlin long on custodia bank's legal battle with the fed and breaking down the crypto scene in switzerland are also discussed.`,
  //   url: 'https://www.coindesk.com/video/makerdao-votes-to-ditch-dollar500m-in-paxos-dollar-stablecoin-from-reserve-nike-teams-up-with-ea-sports/',
  // },
  // {
  //   summary:
  //     "IndustryZuzalu is a first-of-its-kind event in lustica bay, montenegro, that blends a crypto-conference with burning man and summer camp. it is invite-only and has about 200 executives and developers focused on cryptography, technology and longevity. attendees get to meet ethereum co-founder vitalik buterin and participate in daily “cold plunges” in the adriatic sea. participants are put up in the chedi, a five-star hotel, or can rent an airbnb in the montenegrin hills or stay on a yacht or catamaran at bay. the agenda includes official business conference–style events, with many sessions taking place at the “dome”, a structure built by volunteers specifically for the event. at night, the dome hosts dance parties that turn into a club-like atmosphere. participants are encouraged to explore their own ideas and join in with “experiments” proposed by others. zuzalu is a community-driven atmosphere where not everything revolves around the structure and how to score an invite for next year's zuzalu is still ambiguous. zuzalu is a unique event that blends crypto-conference with burning man and summer camp, where attendees get to meet ethereum co-founder vitalik buterin and participate in daily “cold plunges” in the adriatic sea. participants are put up in luxurious accommodations and have access to official business conference–style events as well as dance parties. there are also experiments proposed by attendees that everyone can join in on.",
  //   url: 'https://www.coindesk.com/tech/2023/05/23/zuzalu-is-2-months-in-montenegro-with-crypto-elites-cold-plunges-vitalik-selfies/',
  // },
  // {
  //   summary:
  //     "a non-fungible token (nft) charity scam is highlighting the potential dangers of nft influencer culture. sotheby's is auctioning off nfts seized from 3ac, including a landmark dmitri cherniak work. nft trading volume is on pace to drop below $1b according to dappradar. china's top prosecution agency says nfts have crypto-like attributes. coindesk's consensus 2024 event brings together all sides of crypto, blockchain and web3",
  //   url: 'https://www.coindesk.com/video/exploring-the-dangers-of-nft-influencer-culture/',
  // },
  // {
  //   summary:
  //     "sui blockchain has announced a multiyear deal with red bull racing, a formula one team. this comes less than a month after sui's blockchain went live. sotheby's is also auctioning off nfts seized from 3ac, including a landmark dmitri cherniak work. the brc-721e token standard converts ethereum nfts to bitcoin nfts. bankruptcy claims exchange opnx has issued a new governance token. coindesk is hosting consensus 2024, an event that brings together all sides of crypto, blockchain and web3",
  //   url: 'https://www.coindesk.com/video/sui-blockchain-announces-multiyear-deal-with-red-bull-racing/',
  // },
  // {
  //   summary:
  //     'Bitcoin and ether started June with losses after their first losing months of 2023 in May. the CoinDesk Indices Trend Indicator for both assets implies differences in their near term direction, with bitcoin flashing a “neutral” signal and ether in a “significant uptrend”. ether’s trend is relatively young, having moved from neutral to significant uptrend three days ago while bitcoin flipped from downtrend to neutral just four days ago. bitcoin’s 62% advance this year continues to outperform, but the gap has narrowed over the past month as bitcoin dipped nearly 8% in May while ether was roughly flat. on-chain data suggests that investors remain bullish on ETH with the funding rate for ether futures being positive since April 7, with the exception of just two days. funding rates for bitcoin remain positive as well, a sign that bullish sentiment remains despite recent weakness in price',
  //   url: 'https://www.coindesk.com/markets/2023/06/01/on-heels-of-first-losing-month-of-2023-bitcoin-and-ether-flash-differing-signals/',
  // },
  // {
  //   summary:
  //     "Cryptocurrency ExchangeKraken is reaping the benefits of staying in Canada after rivals such as Binance and OKX said they plan to withdraw. Kraken's customer deposits in the country grew by 25% in the weeks following Binance's announced departure in early May, and it saw a fivefold increase in downloads of its two mobile apps for Canadian clients within a week of OKX saying it planned to leave back in March. Canada tightened its regulatory framework for digital asset trading earlier this year, resulting in an exodus of some of the largest crypto exchanges. Kraken has been in Canada for over 10 years, has more than 250 staff there and has been a money services business since 2019. Kraken is benefiting from staying in Canada as other crypto exchanges have left due to tightened regulations, with customer deposits increasing by 25% and downloads of its two mobile apps increasing fivefold.",
  //   url: 'https://www.coindesk.com/business/2023/06/01/crypto-exchange-krakens-canada-customer-deposits-rose-25-after-binance-announced-departure/',
  // },
  // {
  //   summary:
  //     "research from blockchain analytic firms chainalysis and elliptic has found that bitcoin and tether (usdt) have become cornerstones to the global fentanyl trade. u.s. sen. elizabeth warren (d-mass.) is calling for a greater crypto crackdown in response, but the data suggests that crypto's role in the illegal and gray area drug trade is only a fraction of a fraction of total crypto transactions. chainalysis' estimate of $37.8 million worth of crypto sent to drug manufacturers in china since 2018 is likely contingent on a number of factors, and the total global illicit drug trade ranges anywhere from tens of billions to hundreds of trillions of dollars. coin desk journalists are not allowed to purchase stock outright in digital currency group, which invests in cryptocurrencies and blockchain startups.",
  //   url: 'https://www.coindesk.com/consensus-magazine/2023/06/01/why-elizabeth-warren-is-wrong-about-crypto-and-the-fentanyl-epidemic/',
  // },
  // {
  //   summary:
  //     "Maker has paved the way to purchase up to an additional $1.28 billion in U.S. government bonds via crypto asset manager BlockTower Capital. maker will pay a 0.15% arranger fee to BlockTower and Celadon Financial Group will act as a broker and Wedbush Securities will custody assets. this decision fits into maker's ambitions to diversify reserve assets backing its $5 billion stablecoin DAI and boost protocol revenues by investing in yield-generating strategies. maker earns a yield on storing $500 million USDC at Coinbase Prime, while Gemini pays rewards to Maker for holding Gemini Dollar (GUSD) among the reserve assets. the platform's investment plan also underscores the growing demand for traditional financial instruments among crypto native entities such as DAOs as a means to earn a stable yield on their treasury.",
  //   url: 'https://www.coindesk.com/markets/2023/06/01/makerdao-paves-way-for-additional-128b-us-treasury-purchase/',
  // },
  // {
  //   summary:
  //     'The ICO era was a period of chaotic, fraud-filled investment in crypto projects from early 2017 to mid-2018. Many of the downsides and threats they brought into crypto have remained big problems, such as investment fraud and securities violations. However, some of the most important projects in present-day decentralized finance launched as part of the ICO bubble, including key pillars like Aave and 0x. The historical significance of the ICO boom goes far beyond the relative handful of actual winners who got funded, as it fulfilled crypto’s promise of cutting out financial middlemen and allowing anyone to invest regardless of their geographic location or citizenship. An ICO at the time looked a good deal like an initial public offering in equities markets, but with tokens instead of legal claims on a company. There is an argument that “utility tokens” are not securities, but it has been abused into almost unrecognizable shape. On-chain anonymity and universal access made some basic due-diligence processes unreliable or impossible, leading to a lack of transparency and many scams. Despite this, there were some huge successes to emerge from the ICO era, such as Aave (AAVE), Filecoin (FIL) and Cosmos (ATOM). The takeaway seems to be that ICOs can be very effective fundraising tools in individual cases where founders are trustworthy and well-informed investors can make informed decisions. The ICO era of 2017-2019 was a period of intense experimentation in the world of cryptocurrency and blockchain. The idea of tokenizing assets and services, and selling them to the public, was a novel one that promised to revolutionize the way startups raised capital. Unfortunately, the reality of ICOs did not live up to the hype. Many projects were legitimate, but investors often lacked the technical knowledge to understand what they were buying into. This led to a misalignment of interests between founders and investors, with many projects raising huge amounts of money up front without any real obligation to actually build their product. This created an environment ripe for fraud and speculation, with many projects failing to deliver on their promises. The regulatory backlash that followed put an end to the ICO era, but it also highlighted the need for better transparency and controls in order for token launches to be successful. While it may take years or decades for a suitable regulatory framework to be established, there is still hope that the lessons learned from this period will lead to a more rational and honest market in the future.',
  //   url: 'https://www.coindesk.com/consensus-magazine/2023/06/01/coindesk-turns-10-the-ico-era-what-went-right/',
  // },
  // {
  //   summary: '',
  //   url: 'https://www.coindesk.com/policy/2023/06/01/bitcoin-miners-gain-support-from-texas-with-two-bills-passed-one-halted/',
  // },
  // {
  //   summary:
  //     'opnx has issued a new governance token called "open exchange token" (ox) designed to reduce trading fees on the platform. zack seward, jennifer sanasie, william foxley, and wendy o co-host "the hash" on coindesk tv, a daily news show that connects the dots on why crypto stories matter beyond crypto native communities. the coindesk bitcoin price index (x bx) is the world’s leading reference for the price of bitcoin, used by the largest institutions active in crypto assets. consensus 2024 is coindesk’s longest-running and most influential event that brings together all sides of crypto, blockchain and web3. bitcoin is on pace for its first monthly loss in 6 months and digital currency group has shuttered tradeblock. ripple president has addressed sec lawsuit and ledger ceo has discussed key recovery rollout delay.',
  //   url: 'https://www.coindesk.com/tv/the-hash/opnx-issues-new-governance-token-european-parliament-study-examines-crypto-assets/',
  // },
  // {
  //   summary:
  //     "in 2022, coinsdesk's reporting triggered the events that led to the collapse of ftx. this resulted in a mix of good and bad news for coindesk, as they received their first prestigious journalistic prize, the george polk award, but also their parent company dcg and trading subsidiary genesis were affected. the collapse of ftx was the culmination of an unprecedented hellscape of disasters in crypto, with other major companies like celsius, terra/luna and three arrows capital also collapsing. it was revealed that ftx and alameda had been led by a close-knit group of sbf's friends, with little transparency and accountability. before its downfall, some players on the market could smell something suspicious around the workings of alameda. following coindesk's scoop, the ceo of binance said he was going to sell all the ftt binance owned, pushing down its price and prompting fears of an ftx insolvency. this led to a bank run on ftx and its eventual bankruptcy. the consequences of the ftx collapse were as big as its success used to be - or even bigger - as it frustrated regulators and made people question the merits of crypto before they learned anything good about it.",
  //   url: 'https://www.coindesk.com/consensus-magazine/2023/06/01/coindesk-turns-10-2022-how-crypto-gods-turn-into-monsters/',
  // },
  // {
  //   summary:
  //     "kraken, a cryptocurrency exchange, is reaping the benefits of staying in canada after binance and okx said they plan to withdraw. nearly $275 million in ether has been burnt this month amid a deflationary trend, and bitcoin investors are hodling more than ever according to glassnode. nvidia has also joined the $1 trillion club amid an ai boom. consensus 2024, coindesk's longest-running and most influential event that brings together all sides of crypto, blockchain and web3, is now open for registration",
  //   url: 'https://www.coindesk.com/video/krakens-canada-customer-deposits-rose-after-binance-okx-plan-to-leave/',
  // },
  // {
  //   summary:
  //     "a study commissioned by european parliament lawmakers published tuesday suggests that crypto assets should be treated as securities by default and autonomous organizations governing decentralized finance (defi) should be granted legal status. sotheby's is auctioning off nfts seized from 3ac, nft influencer culture is explored, nansen cuts 30% of staff to reduce expenses, bankruptcy claims exchange opnx issues new governance token, and brc-721e token standard converts ethereum nfts to bitcoin nfts.",
  //   url: 'https://www.coindesk.com/video/treat-crypto-as-securities-by-default-european-parliament-study-says/',
  // },
  // {
  //   summary: `opnx, a bankruptcy claims exchange, has issued a new governance token called "open exchange token" (ox). this token is designed to reduce trading fees on the platform. this news comes as sotheby's is set to auction off more nfts seized from 3ac, including a landmark dmitri cherniak work, and as nansen cuts 30% of staff to reduce expenses. coinbase is also hosting consensus 2024, an event that brings together all sides of crypto, blockchain and web3.`,
  //   url: 'https://www.coindesk.com/video/bankruptcy-claims-exchange-opnx-issues-new-governance-token/',
  // },
  // {
  //   summary:
  //     `Bitcoin is a decentralized, digital currency exchanged through a peer-to-peer network without centralized authorities. It was introduced in 2008 by an anonymous creator known as Satoshi Nakamoto and is the world's first decentralized cryptocurrency, using blockchain technology to secure and verify transactions. Bitcoin combines its network, cryptocurrency, and blockchain to record transactions transparently, prevent double spending, and ensure consensus via a process called "proof-of-work". It is designed in such a way that users can exchange value with one another directly through a peer-to-peer network without a central server or intermediary company acting in the middle. \n` +
  //     '\n' +
  //     'Bitcoin was created as an alternative to traditional money, with the goal for it to eventually become a globally accepted legal tender so people could use it to purchase goods and services. However, its utility for payments has been stymied somewhat by its price volatility. Bitcoin runs on a peer-to-peer network where users do not require the help of intermediaries to execute and validate transactions. The Bitcoin network is completely public and open-source, meaning anyone in the world with an internet connection and a device that can connect to it can participate without restriction. \n' +
  //     '\n' +
  //     'The Bitcoin blockchain is a digital string of chronologically ordered “blocks” — chunks of code that contain bitcoin transaction data. Whenever new transactions are confirmed and added to the ledger, the network updates every user’s copy of the ledger to reflect the latest changes. To ensure consensus is achieved, even though there are countless copies of the public ledger stored all over the world, computers in the Bitcoin network use a process called proof-of-work (PoW) to validate transactions and secure the network. When a new block is discovered, the successful miner who found it through the mining process gets to fill it with 1 megabyte’s worth of validated transactions. Bitcoin mining is a process that adds transactions to the blockchain and mints new Bitcoin. It involves solving complex mathematical problems using powerful, specialized computer hardware. Miners utilize hardware—often Application-Specific Integrated Circuits (ASICs)—to solve these problems. This process is competitive; the first to solve the problem adds the next block to the blockchain and receives a Bitcoin reward. The Bitcoin network automatically releases newly minted bitcoin to miners when they find and add new blocks to the blockchain. The total supply of bitcoin has a cap of 21 million coins, meaning once the number of coins in circulation reaches 21 million, the protocol will stop minting new coins. In order to incentivize miners, they are allowed to keep any fees attached to the transactions they add, plus they’re given an amount of newly minted bitcoin as a “block reward”. All Bitcoin users have to pay a network fee each time they send a transaction (usually based on the size of it) before the payment can be queued for validation. The goal when adding a transaction fee is to match or exceed the average fee paid by other network participants so your transaction is processed in a timely manner. Bitcoin halving is a coin distribution strategy that ensures the amount of bitcoin distributed to miners reduces over time, helping support the asset’s price (based on the fundamental principles of supply and demand). A bitcoin wallet is a software program that runs on a computer or a dedicated device that provides the functionality required to secure, send and receive bitcoin. It uses public-key cryptography (PKC) to preserve the integrity of its blockchain, allowing only individuals with the right set of keys to access specific coins.',
  //   url: 'https://www.coindesk.com/learn/what-is-bitcoin/',
  // },
  // {
  //   summary:
  //     "-builder Multichain (MULTI) is causing concern in the Fantom (FTM) ecosystem due to its faltering infrastructure and AWOL CEO. DeFi protocols are trying to insulate themselves from a potential bridge outage that could devalue or even strand wrapped assets, including USDC, ETH and many others. A handful of DeFi projects have already begun moving crypto to other networks out of fear, while the Fantom Foundation has assured that the bridge is still operational. The FUD is spreading fast, and some protocols are incentivizing traders away from Multichain-linked assets. A native form of USDC on Fantom could solve the crisis, but it hasn't happened yet.",
  //   url: 'https://www.coindesk.com/business/2023/06/01/as-multichain-wobbles-some-fantom-based-defi-projects-flee-bridged-tokens/',
  // },
  // {
  //   summary:
  //     'Las criptomonedas son activos volátiles y operar con ellas puede ser riesgoso. Es importante gestionar el riesgo al invertir en criptomonedas, como invirtiendo solamente lo que se está dispuesto a perder, transfiriendo los activos a un almacenamiento en frío, cubriendo el porfolio y diversificando. También es importante evitar el apalancamiento excesivo y operar con cautela. Las criptomonedas pueden perder su valor rápidamente como respuesta a las cambiantes políticas gubernamentales, las plataformas de trading de criptomonedas pueden ser víctimas de hackeos o cancelar operaciones, por lo que es importante gestionar el riesgo al invertir en criptomonedas. Las formas para gestionar el riesgo incluyen invirtiendo solamente lo que se está dispuesto a perder, transfiriendo los activos a un almacenamiento en frío, cubriendo el porfolio y diversificando. También es importante evitar el apalancamiento excesivo y operar con cautela. \n' +
  //     'Las criptomonedas son activos volátiles y operar con ellas puede ser riesgoso. Es importante gestionar el riesgo al invertir en criptomonedas para reducir la posibilidad de pérdidas significativas. Esto incluye invirtiendo solamente lo que se está dispuesto a perder, transfiriendo los activos a un almacenamiento en frío, cubriendo el porfolio y diversificando. También es importante evitar el apalancamiento excesivo y operar con cautela para reducir la posibilidad de sufrir pérdidas financieras.',
  //   url: 'https://www.coindesk.com/es/markets/2023/06/01/como-puedes-gestionar-el-riesgo-al-operar-con-criptomonedas/',
  // },
  // {
  //   summary:
  //     "the number of ether (eth) on exchanges has hit a low not seen since july 2016 as staking saps up available ether. data from glassnode shows that as of thursday, 14.85% of all ether was held in wallets owned by centralized exchanges, nearly halving in three years. typically low exchange balances are a bullish sign as it means the supply of ether available for purchase is limited, thus, it puts pressure on prices to increase. in the last few weeks, staking's growing popularity has helped soak up supply from the market with over 4.4 million additional coins deposited since the upgrade. this trend is anticipated to persist as large ether holders increasingly opt for generating passive income rather than liquidating their assets. binance experienced a 48% decrease in spot trading volume for the second consecutive month in april, reaching $287 billion with its market share also reducing to 46%. ether is currently trading for $1,816, up 2%.",
  //   url: 'https://www.coindesk.com/markets/2023/05/26/ether-balance-on-exchanges-nears-all-time-low/',
  // },
  // {
  //   summary:
  //     "gamestop is partnering with the telos foundation to expand its web3 gaming offerings. the collaboration will link web3 games utilizing telos' decentralized blockchain infrastructure to gamestop's upcoming web3 game launchpad playr, providing new opportunities for mainstream gaming distribution. telos' native token tlos jumped 10% on the news before receding. gamestop has been steadily moving away from its brick and mortar strategy to focus on a digital expansion that includes web3 gaming, such as a partnership with layer 1 blockchain immutable x to build a non-fungible token (nft) marketplace and the release of its self-custodial crypto and nft wallet.",
  //   url: 'https://www.coindesk.com/web3/2023/06/01/gamestop-teams-up-with-the-telos-foundation-to-grow-web3-gaming-strategy/',
  // },
  // {
  //   summary:
  //     'Los mercados de criptomonedas se preparan para una caída a medida que el endurecimiento de la liquidez se reanude tras el aumento del límite de la deuda de Estados Unidos. La reposición de la cuenta general del Tesoro y la reducción del saldo de la Reserva Federal eliminarán cientos de miles de millones de dólares estadounidenses del sistema financiero, lo que podría afectar los precios de las criptomonedas. El proyecto de ley de resolución del techo de la deuda, si se aprueba tal como está, también contribuirá con el impacto negativo sobre la liquidez. Esto significa que el dinero que normalmente estaría en el sistema financiero se reducirá, lo que ejercerá presión sobre las inversiones de riesgo y los activos digitales. Esta situación es un doble golpe negativo para la liquidez y los inversores deben estar preparados para la volatilidad. \n' +
  //     'los mercados de criptomonedas se preparan para una caída a medida que el endurecimiento de la liquidez se reanude tras el aumento del límite de la deuda de estados unidos. la reposición de la cuenta general del tesoro y la reducción del saldo de la reserva federal eliminarán cientos de miles de millones de dólares estadounidenses del sistema financiero, lo que podría afectar los precios de las criptomonedas. el proyecto de ley de resolución del techo de la deuda, si se aprueba tal como está, también contribuirá con el impacto negativo sobre la liquidez. esto significa que el dinero que normalmente estaría en el sistema financiero se redu',
  //   url: 'https://www.coindesk.com/es/markets/2023/06/01/los-precios-de-bitcoin-y-otras-criptomonedas-se-preparan-para-una-caida-ante-la-proxima-crisis-de-liquidez/',
  // },
  // {
  //   summary:
  //     "nigeria's securities and exchange commission is considering allowing tokenized coin offerings backed by equity, debt or property on licensed digital asset exchanges. the regulator is also processing applications for digital exchanges on a trial basis, intending them to undergo one year of “regulatory incubation” with limited services offered and under sec monitoring. the sec will not start registering digital asset exchanges until it reaches an agreement with the nation's central bank, which has blocked local financial institutions from interacting with crypto services providers. there have been attempts to include crypto in the scope of regulations, with a new bill in the works that could recognize crypto as capital for investment",
  //   url: 'https://www.coindesk.com/policy/2023/05/01/nigerias-sec-mulls-allowing-tokenized-equity-property-but-not-crypto-bloomberg/',
  // },
  // {
  //   summary:
  //     "Nigerians have been turning to the country's central bank digital currency (cbdc) eNaira amid cash shortages. The number of eNaira wallets has jumped more than 12-fold to 13 million since october, and the value of transactions has climbed 63% to 22 billion naira ($48 million) this year. currency in circulation has slumped to about 1 trillion naira from 3.2 trillion naira in september due to the central bank replacing old naira notes with new ones late last year. the eNaira isn't a straightforward alternative as there is a $220 billion informal economy that thrives on cash and too few merchants and too little infrastructure for extensive eNaira use.",
  //   url: 'https://www.coindesk.com/policy/2023/03/22/nigerias-enaira-wallet-use-transactions-climb-amid-cash-shortages-bloomberg/',
  // },
  // {
  //   summary:
  //     "nigeria's government approved a national blockchain policy on wednesday as part of the country's effort to transition to a digital economy. the policy document doesn't appear to have been made public yet and the tweet did not mention cryptocurrencies. the cabinet directed regulators to develop regulatory instruments for the deployment of blockchain tech across various sectors of the economy. bloomberg reported nigeria's sec was considering allowing tokenized coin offerings backed by equity, debt or property but “not crypto” on licensed digital asset exchanges. a multi-sectoral steering committee has also been approved to oversee the implementation of the policy",
  //   url: 'https://www.coindesk.com/policy/2023/05/04/nigeria-approves-national-policy-to-create-blockchain-powered-economy/',
  // },
  // {
  //   summary:
  //     'Cryptocurrency ExchangeKrakenInflationEuropean Central BankChristine LagardeOPNXThree Arrows CapitalCoinFLEXBybitCoinDeskCoinDesk is a media outlet that strives for the highest journalistic standards and abides by a strict set of editorial policies. It is an independent operating subsidiary of Digital Currency Group, which invests in cryptocurrencies and blockchain startups. CoinDesk journalists are not allowed to purchase stock outright in DCG. Kraken, a cryptocurrency exchange, has seen customer deposits in Canada grow by 25% after rivals such as Binance and OKX set withdrawal plans. Bankruptcy claims exchange OPNX has issued a new governance coin called "Open Exchange token" (OX) designed to reduce trading fees on the platform. fears over inflation and continued rate hikes resurfaced, causing bitcoin and the broad cryptocurrency market to sell off for the second consecutive day. european central bank president christine lagarde signaled that additional interest rate rises are needed. new eurozone data showed that inflation fell more than expected to 6.1% in may from 7% in april.',
  //   url: 'https://www.coindesk.com/markets/2023/06/01/first-mover-americas-bitcoin-begins-june-dropping-back-below-27k/',
  // },
  // {
  //   summary:
  //     'as we approach the halfway mark for 2023, the year has been difficult to characterize for both equities and digital assets. ongoing debates about the macroeconomic picture have analysts wondering when the next shoe will drop. digital assets have been touted as a safe-haven asset and hedge against financial armageddon, but almost any meaningful headline has been shrugged off as unimportant. traders are pressing short vol bets, wagering that the current conditions will persist, but with the june 1 debt-ceiling deadline looming, bond markets have been pricing in risks and the us dollar index has initiated a strong double bottom rally off the 101.0 level. typically, holding above this level hasn’t been good for bitcoin. the recent calm in bitcoin and ether volatility should not lull market participants into a false sense of security as the winds of macroeconomic change continue to blow',
  //   url: 'https://www.coindesk.com/markets/2023/05/31/sell-crypto-volatility-in-may-and-go-away/',
  // },
  // {
  //   summary: `the securities and futures commission (sfc) of hong kong will begin accepting applications for crypto trading platform licenses on june 1. the regulator has agreed to allow licensed virtual asset providers to serve retail investors, provided that operators assess understanding of the risks involved. the rulebook explicitly bans crypto "gifts" designed to incentivize retail customers to invest, likely including airdrops. the guidelines place the onus squarely on platform operators to conduct due diligence and maintain at least 5,000,000 hong kong dollars in capital. approved tokens on regulated exchanges need a 12 month "track record" and must go through due diligence procedures before being listed. the sfc will also consult a separate review on allowing derivatives and implementing the financial action task force's travel rule for sharing information on crypto transactions between financial institutions. the revised guidelines come into force on june 1.`,
  //   url: 'https://www.coindesk.com/policy/2023/05/23/hong-kong-securities-regulator-to-accept-license-applications-for-crypto-exchanges-starting-june-1/',
  // },
  // {
  //   summary:
  //     'El yuan chino ha perdido un 2,7% de su valor con respecto al dólar estadounidense en mayo, lo que marca su peor rendimiento desde septiembre. El Banco Popular de China (PBOC) fija el valor del CNY a un conjunto de 24 monedas mediante el régimen de flotación administrada. Esto presiona el índice del dólar estadounidense al alza, lo que provoca un endurecimiento financiero mundial y podría generar una aversión al riesgo. El gobernador del PBOC anunció en abril que el banco central podría reducir las intervenciones regulares. el yuan chino ha perdido un 2,7% de su valor con respecto al dólar estadounidense en mayo, el banco popular de china (pboc) fija el valor del cny a un conjunto de 24 monedas mediante el régimen de flotación administrada. esto presiona el índice del dólar estadounidense al alza, lo que provoca un endurecimiento financiero mundial y podría generar una aversión al riesgo. el gobernador del pboc anunció en abril que el banco central podría reducir las intervenciones regulares, aunque también resaltó que estas acciones no están aseguradas. aquellos con préstamos en dólares estadounidenses e ingresos en otras monedas tienen dificultades para cumplir con su deuda cuando el dólar aumenta. la fortaleza del dólar estadounidense tiende a crear una aversión al riesgo en todo el mundo.',
  //   url: 'https://www.coindesk.com/es/markets/2023/06/01/los-traders-de-criptomonedas-necesitan-mirar-al-yuan-chino-segun-analisis/',
  // },
  // {
  //   summary:
  //     "bitcoin prices dropped below $27k as the us house of representatives passed a debt ceiling bill. the treasury secretary janet yellen said the us would run out of money to pay its bills on time if the bill was not passed. astaria cto discussed nft lending platform roll out to public, rep. davidson discussed role of crypto mining in upcoming elections and state of us crypto sector. rep. davidson also discussed fed's mester favoring unabated tightening. sec settled insider trading charges with former coinbase employee",
  //   url: 'https://www.coindesk.com/video/bitcoin-below-dollar27k-as-us-debt-ceiling-bill-passes-house-moves-to-senate/',
  // },
  // {
  //   summary:
  //     "nestcoin ceo and co-founder yele bademosi discusses the state of crypto adoption in nigeria after the government approved a national blockchain policy. elon musk says twitter has no choice about government censorship demands. the sec settles insider trading charges with a former coinbase employee. bitcoin is below $27k as the us debt ceiling bill passes house and moves to senate. rep. davidson talks about the role of crypto mining in upcoming elections and the state of the us crypto sector. coindesk's consensus 2024 event brings together all sides of crypto, blockchain and web3",
  //   url: 'https://www.coindesk.com/video/nestcoin-ceo-addresses-state-of-crypto-adoption-in-nigeria/',
  // },
  // {
  //   summary:
  //     "nestcoin ceo yele bademosi discusses the use of stablecoins like usdt in nigeria for cross-border money movements. rep. davidson talks about the state of crypto adoption and mining in the us, and elon musk comments on twitter's lack of choice when it comes to government censorship demands. coindesk's consensus 2024 event brings together all sides of crypto, blockchain and web3 and registration is now open.",
  //   url: 'https://www.coindesk.com/video/nestcoin-ceo-on-real-world-utilities-of-stablecoins-in-nigeria/',
  // },
  // {
  //   summary:
  //     'nestcoin ceo recently discussed the state of crypto in nigeria, which has recently approved a national blockchain policy. he also addressed the real world utilities of stablecoins and adoption of crypto in the country. he also mentioned bitcoin slipping below $27k after its first monthly loss since december and hong kong securities regulator accepting license applications for crypto exchanges',
  //   url: 'https://www.coindesk.com/video/nestcoin-ceo-on-state-of-crypto-in-nigeria/',
  // },
  // {
  //   summary:
  //     'elon musk has said that twitter has no actual choice when it comes to government censorship demands. this is in response to reports that twitter has complied with over 80% of government takedown requests since musk took over. this comes as the us debt ceiling bill passes the house and moves to the senate, and as crypto and blockchain become more prominent in upcoming elections.',
  //   url: 'https://www.coindesk.com/video/twitter-has-no-actual-choice-about-government-censorship-demands-elon-musk-says/',
  // },
  // {
  //   summary:
  //     "hong kong's securities and futures commission (sfc) will begin accepting applications for crypto trading platform licenses on june 1. this follows an earlier announcement from the sfc. this news comes as the crypto industry is facing increased scrutiny from regulators, with the sec settling insider trading charges with a former coinbase employee and the us criminal charges against sam bankman-fried not warranting dismissal according to prosecutors",
  //   url: 'https://www.coindesk.com/video/hong-kong-securities-regulator-accepting-license-applications-for-crypto-exchanges/',
  // },
  // {
  //   summary:
  //     "bitcoin slipped below $27k after its first monthly loss since december. this was due to uncertainty over the us debt limit and inflationary concerns. bitcoin options market suggests weakness over 6 months amid debt ceiling deadline and microstrategy represents attractive alternative to coinbase according to berenberg. coindesk's consensus 2024 event brings together all sides of crypto, blockchain and web3",
  //   url: 'https://www.coindesk.com/video/bitcoin-slips-below-dollar27k-after-first-monthly-loss-since-december/',
  // },
  // {
  //   summary:
  //     "Qatarqatar has taken little action against crypto companies breaching a ban announced in 2019, according to a report from the financial action task force (fatf). the report accused qatar of being too lax on terrorist fundraising and not proactively identifying and taking enforcement action for potential breaches of the prohibition. fatf also noted that no formal sanctions have been applied on a natural or legal person for contravening the prohibition. qatar's central bank governor has pointed to the potential benefits of faster payments and has said the bank was exploring a digital riyal. the central bank said the assessment found the country was compliant or largely compliant with each of forty technical requirements and “demonstrate the country’s commitment to combatting illicit financing”.",
  //   url: 'https://www.coindesk.com/policy/2023/06/01/qatar-didnt-properly-enforce-its-crypto-ban-global-money-laundering-watchdog-says/',
  // },
  // {
  //   summary:
  //     'Antminer S19 XP\n' +
  //     '\n' +
  //     'cleanspark has purchased 12,500 bitcoin mining rigs for $40.5 million, adding 1.76 exahash/second of computing power to their operations. the machines were bought at a price of $23 per terahash and will be shipped by the manufacturer in june and august. cleanspark has been buying assets from distressed miners during the crypto bear market and in april they purchased 45,000 antminer s19 xps and in february they acquired 20,000 rigs at a 25% discount',
  //   url: 'https://www.coindesk.com/business/2023/06/01/bitcoin-miner-cleanspark-buys-12500-bitmain-machines-for-405m/',
  // },
  // {
  //   summary: '',
  //   url: 'https://www.coindesk.com/business/2023/06/01/sui-blockchain-signs-multiyear-deal-with-red-bull-racing/',
  // },
  // {
  //   summary:
  //     'NewsCoinDesk is a media outlet that strives for the highest journalistic standards and abides by a strict set of editorial policies. Crypto foundations are non-profit organizations created to support specific blockchains and related projects. They foster community building, support decentralized control over a project, provide marketing and education, and offer non-financial and financial support. Foundations are typically kicked off by for-profit entities and receive an allocation of tokens at the launch. They also provide a pseudo-safe haven for developers to continue building without a token becoming a security, as long as there isn’t a centralized nature to the development. Debates around decentralization and crypto foundations arise when discussing the relationship between for-profit entities and non-profit foundations. coindesk provides news and information on cryptocurrency, digital assets and the future of money. cryptofoundations are non-profit organizations created to support specific blockchains and related projects, providing marketing, education, non-financial and financial support. they are typically kicked off by for-profit entities and receive an allocation of tokens at the launch. they also provide a pseudo-safe haven for developers to continue building without a token becoming a security as long as there isn’t a centralized nature to the development. debates around decentralization and crypto foundations arise when discussing the relationship between for-profit entities and non-profit foundations.',
  //   url: 'https://www.coindesk.com/learn/what-is-a-crypto-foundation/',
  // },
  // {
  //   summary:
  //     'and get smart about DeFi and Web3. This week, the battle over how to regulate crypto in the US wages on, with the SEC refusing to respond to a legal action from Coinbase asking for regulatory guidelines. The EU Council approved a regulatory framework for crypto, providing certainty to digital asset firms. Memecoin mania continues with users sending $7M worth of Ether to Ben.eth for the pre-sale of PSYOP. Ledger launched an optional feature allowing users to recover their seed phrase after passing ID verification, raising privacy concerns. Polygon co-founder Mihailo Bjelic discussed scaling Ethereum and major deals with Starbucks and the NFL. Become a premium subscriber today to read the whole post along with the rest of our suscriber-only content. \n' +
  //     '\n' +
  //     'this week, the battle over how to regulate crypto in the us continues, with the sec refusing to respond to a legal action from coinbase asking for regulatory guidelines. the eu council approved a regulatory framework for crypto, providing certainty to digital asset firms. memecoin mania continues with users sending $7m worth of ether to ben.eth for the pre-sale of psyop. ledger launched an optional feature allowing users to recover their seed phrase after passing id verification, raising privacy concerns. polygon co-founder mihailo bjelic discussed scaling ethereum and major deals with starbucks and the nfl. become a premium subscriber today to read more about these topics and other subscriber-only content.',
  //   url: 'https://thedefiant.io/regulatory-battle-defi-week-of-may-14',
  // },
  // {
  //   summary:
  //     "and get smart about DeFi and Web3. This week, developers are aiming to bring new DeFi strategies to the $17B liquid staking market. Curve's stablecoin trades within a 0.5% range for its first month. Ethereum staking deposits have skyrocketed since the upgrade went live, offsetting the thinning queue for withdrawals. Memecoin mania has been dominating headlines, with Litecoin launching its own LTC-20 tokens driving a 500% surge in on-chain activity. NFT-Fi sector took a hit when ParaSpace accused its CEO of embezzling $1.7M worth of ETH from users. Taylor Monahan discussed a new attack which has drained millions from veterans of the Ethereum space on the podcast. \n" +
  //     '\n' +
  //     "this week developers are aiming to bring new defi strategies to the $17b liquid staking market, curve's stablecoin trades within a 0.5% range for its first month, eth staking deposits have skyrocketed since the upgrade went live, memecoin mania has been dominating headlines with litecoin launching its own ltc-20 tokens driving a 500% surge in on-chain activity, nft-fi sector took a hit when paraspace accused its ceo of embezzling $1.7m worth of eth from users and taylor monahan discussed a new attack which has drained millions from veterans of the ethereum space on the podcast",
  //   url: 'https://thedefiant.io/eth-staking-deposits-skyrocket-defi-week-of-may-7',
  // },
  // {
  //   summary: '',
  //   url: 'https://thedefiant.io/nft-lending-resurgence-defi-week-of-may-21',
  // },
  // {
  //   summary:
  //     "devour and alterverse partner to bring the world's first web3 food ordering marketplace to the metaverse - devour, a pioneering restaurant engagement technology company, has announced its strategic partnership with alterverse, an innovative force in the gaming industry. the collaboration aims to revolutionize the restaurant and gaming experience by expanding devourgo, devour's web3 enabled guest engagement platform, to the upcoming release of alterverse's sky city gaming metaverse. devourgo will allow users to unlock experiences by utilizing their digital assets and the native token, devourpay ($dpay), for payments and exclusive rewards on the platform. with this new partnership, users will be able to order real world food delivery orders coming from storefronts within alterverse's photorealistic metaverse, sky city. the integration with alterverse will also allow avatars to gain valuable increases in their hunger and thirst meters.",
  //   url: 'https://thedefiant.io/devour-alterverse-partner-to-bring-the-worlds-first-web3-food-ordering-marketplace-to-the-metaverse',
  // },
  // {
  //   summary: `pink moon studios, a leading innovator in the web3 gaming industry, has announced the launch of their latest game, "kmon: world of kogaea". this immersive 3d open-world game is available initially to kryptomon nft holders and features exclusive pink moon shards, unique tokens crafted using erc-1125 blockchain technology. pink moon studios will also launch a vibrant community campaign and an exclusive live streaming event to commemorate the game's launch. the company has already demonstrated significant success, amassing a noteworthy $11.4 million in two funding rounds and fostering a dedicated community of almost 450,000 members across various social platforms. pink moon studios is committed to leveraging the power of blockchain technology and their groundbreaking web3 gaming technologies to redefine the gaming landscape and deliver unparalleled experiences to players around the globe.`,
  //   url: 'https://thedefiant.io/pink-moon-studios-reveals-kmon-world-of-kogaea-pioneering-a-new-era-in-web3-open-world-gaming',
  // },
  // {
  //   summary:
  //     'memecoin mania drove a record number of people to trade on decentralized exchanges in may, with 523,606 unique wallets transacting on uniswap. uniswap is the top decentralized exchange by 24-hour volume with $1.15b, beating out its closest rival pancakeswap by 4.5x. despite the recent uptick in activity, the protocol’s uni token has greatly underperformed eth since march. the speculative fervor driven by memecoins is making small fortunes for some and resulting in disastrous losses for others as fomo-fuelled traders race to catch the next small-cap token to explode from obscurity. uniswap has embarked upon a restrained multi-chain expansion in recent years by predominantly deploying on leading layer 2 networks and a governance proposal advocating for launching uniswap v3 on base, the upcoming layer 2 network from coinbase, passed with unanimous approval.',
  //   url: 'https://thedefiant.io/memecoin-fever-drove-record-number-of-traders-to-uniswap-in-may',
  // },
  // {
  //   summary:
  //     'missing multichain ceo is causing ripples across the industry as service for at least 11 chains was interrupted. security experts and founders say other chains could come next. multichain holds $1.45b in assets across dozens of networks and the situation is particularly problematic for chains where multichain acts as a custodian on one chain and a wrapped token issuer on another. issues at multichain began late last month when its ceo went missing, and yet unconfirmed rumors spread of his arrest in china. coreum is currently planning a workaround to empower users to burn their core tokens directly on the xrpl chain, which can then be retrieved on the coreum mainnet. brent xu, founder and ceo of defi lending protocol umee, points to bridges as one of the main risks and madar said the developing situation with multichain will come to stand as a future reference point to single points of compromise that will serve as a lesson for building a more resilient ecosystem. \n' +
  //     'the missing ceo of multichain, the largest blockchain bridge by assets, has caused service interruption for 11 chains and security experts fear other chains could be affected too. there are $1.45 billion in assets held in multichain smart contracts and the situation is particularly problematic for chains where multichain acts as a custodian or wrapped token issuer. coreum is planning a workaround to empower users to burn their core tokens directly on the xrpl chain while brent xu points to bridges as one of the main risks. madar said this situation will serve as a lesson for building a more resilient ecosystem in the future.',
  //   url: 'https://thedefiant.io/missing-multichain-ceo-is-causing-ripples-across-the-industry',
  // },
];

const testNews2: { summary: string; url: string }[] = [
  {
    summary: 'ripple escrow unlocked, adding 1 billion XRP to circulation. Whales moved 100 million XRP to exchanges for dumping. XRP price down 1% to $0.50.',
    url: 'https://coingape.com/ripple-escrow-unlocked-whales-dump-100-million-xrp/',
  },
  {
    summary:
      'ripple pledges to lock up $14 billion in xrp cryptocurrency to combat fears of flooding the market and provide certainty to xrp owners and aspiring owners.',
    url: 'https://www.coindesk.com/markets/2017/05/16/ripple-pledges-to-lock-up-14-billion-in-xrp-cryptocurrency/',
  },
  {
    summary:
      'ripple pledges to lock up $14 billion in xrp cryptocurrency to combat fears of flooding the market and provide certainty to xrp owners and aspiring owners.',
    url: 'https://www.coindesk.com/markets/2017/05/16/ripple-pledges-to-lock-up-14-billion-in-xrp-cryptocurrency/',
  },
  {
    summary:
      'us crypto bill may hold sec liable for regulatory overreach proposed amendment suggests sec should reimburse defendants legal fees if they win cases ripple ceo claims the company spent 200 million on defense in sec lawsuit',
    url: 'https://coingape.com/amendment-us-crypto-bill-sec-reimburse-xrp-news/',
  },
];

const testNews3: { summary: string; url: string }[] = [
  {
    summary: 'ripple escrow unlocked, adding 1 billion XRP to circulation. Whales moved 100 million XRP to exchanges for dumping. XRP price down 1% to $0.50.',
    url: 'https://coingape.com/ripple-escrow-unlocked-whales-dump-100-million-xrp/',
  },
  {
    summary:
      'ripple pledges to lock up $14 billion in xrp cryptocurrency to combat fears of flooding the market and provide certainty to xrp owners and aspiring owners.',
    url: 'https://www.coindesk.com/markets/2017/05/16/ripple-pledges-to-lock-up-14-billion-in-xrp-cryptocurrency/',
  },
  {
    summary:
      'ripple pledges to lock up $14 billion in xrp cryptocurrency to combat fears of flooding the market and provide certainty to xrp owners and aspiring owners.',
    url: 'https://www.coindesk.com/markets/2017/05/16/ripple-pledges-to-lock-up-14-billion-in-xrp-cryptocurrency/',
  },
  {
    summary:
      'us crypto bill may hold sec liable for regulatory overreach proposed amendment suggests sec should reimburse defendants legal fees if they win cases ripple ceo claims the company spent 200 million on defense in sec lawsuit',
    url: 'https://coingape.com/amendment-us-crypto-bill-sec-reimburse-xrp-news/',
  },
];

export async function getTestNewsDocs(): Promise<LGCDocument<PageMetadata>[]> {
  return testNews2
    .filter((news) => news.summary.trim().length > 5)
    .map((news) => {
      return new LGCDocument<PageMetadata>({
        pageContent: news.summary,
        metadata: { source: news.url, url: news.url, fullContent: news.summary, chunk: news.summary },
      });
    });
}

// export async function getAllExistingNewsVectors(pineconeIndex: VectorOperationsApi): Promise<Vector[]> {
//   const result = await pineconeIndex.fetch({
//     namespace: LATEST_NEWS_NAMESPACE,
//     ids: [
//       '9216b705-2055-414d-a644-3309ca7e6c00',
//       'c48c07e5-9f77-421c-96a0-795d7811a097',
//       '70371636-1e38-4cd5-8b61-b0abbee15c05',
//       '11856b30-9255-4d5d-8984-39551e5f8279',
//       'cbf5ca1c-7184-4f06-83b4-6b272e3f1dd0',
//       '82c00865-18ad-4805-97ef-f4d402371577',
//       'e19ed082-0186-45d5-96af-b2411577e220',
//       '3974a6a4-afb6-489a-b78a-0241ef8aab70',
//       '933de847-8266-4fab-ba1b-d15380f6c3af',
//       'e1786d9f-9616-4cfe-88a0-9d94134e6922',
//       '9d9bbb5d-1f86-48d3-9fd8-0e2896aea901',
//       'e5971401-5844-48f3-b2b2-6a37ddd9ceee',
//       '36a2ff90-0bec-42b5-b0b2-6b89b50f17a3',
//       '47dfb352-0063-427b-aea9-272fc02c586b',
//       '5be2d28d-f0f3-415b-bffd-2288d39f568a',
//       'd0421c5b-6c64-4e08-b8f9-1d6d1467823a',
//       '4f7eaa8b-b13f-45bd-bec3-d3c55af2e76a',
//       '5e74ae8b-bd3b-42be-ab35-d849756974eb',
//       'c09b5f3c-d69f-478e-8535-6835a5103573',
//       'eff760a3-7efc-473a-8758-a555cc6ee8c0',
//       '5f90d7f2-c1e0-49de-a52b-769bc493fa7a',
//       'd808ec4b-fdab-4db3-be51-8160fcb6e027',
//       '83e5f79b-9897-42f9-8682-57cbe8f63921',
//       '76dce00b-8c1f-4c9f-aefd-a61566d9d3be',
//       'b03be232-0448-45fb-85b3-ced1ff55648d',
//       '11e006d3-beb7-4953-ab81-427a37e8848c',
//       '46b99e21-8404-46d5-83ec-c1d62e4b475d',
//       'a815c332-0c50-4a93-b8be-d9340587761f',
//       '6650cb41-55c6-4fb9-8e8e-0ca6187266e1',
//       'bb8fcc58-a040-4244-a277-186d27ba8ea9',
//       'ae4e38ab-0d3d-467f-b7bf-a8c851870276',
//       '6076f0b5-c26b-4e6b-9cc5-b62848510374',
//       '58141540-69c2-428d-a8f5-5c7150268a53',
//       '3f29904b-5e58-4d28-84f5-8b80b15552d9',
//       '48cfe6f7-32a3-4b6e-8cc5-3773e5dd05f7',
//       '4ba2cabe-bf52-433d-9b70-f37373a8115e',
//       'd25ef360-1e65-4d6a-b567-f99c6e285793',
//       '23b43ebb-722d-4ee8-9d2d-f66c85eb6cf9',
//       '2704f9d9-9542-4e48-b6f9-bf81b2f797fd',
//       '8f8eb0fb-ccf4-4aa4-9e0b-cec808b39ee7',
//       'fbcf59b1-214c-4843-8f84-29dff505042a',
//       '871b0503-0a09-4269-9721-ad2c1a4688ed',
//       'a0cf7045-0967-418b-a53a-b15a16fb224c',
//       '309f91ff-6aa6-4bb6-bb04-ce48436883ee',
//       '5f42118d-0200-4d17-8e8b-1b9a599b41cf',
//       '9659ec7b-682f-407c-a8e2-99bf3c4152c8',
//       '7d568696-1abb-4ce2-a69d-96e170a1832c',
//       'd23a79de-fdae-4b33-befb-a25c8ac7f1a3',
//       '7f4f3299-c2d7-4e42-a2b7-ae6bb6d10b9c',
//       '4aeacb02-688f-434b-a88e-98a50377aea5',
//       'd7821e19-23f1-425e-9bf1-9cf60b2c9336',
//       'cace4e82-6be5-4a89-abd9-a37d51e87b3d',
//       '24a36d6f-fb1f-4b5f-acc6-8467fd662e61',
//       '65220fc0-3f5d-45ac-a067-ebfc30128baa',
//       'ed88a7e5-a280-4fba-860d-cbf7a49d0086',
//       '0ad31cd6-20f8-4e05-8eb9-a1f2c1bd2cc8',
//       '7d2c34ed-517f-493a-b8cd-0f4fb4f9c118',
//       '3c18fd76-2de5-4943-8a7b-5edb78c08c4b',
//       '9f7551e4-063b-42bf-9cbe-0a0d42bef2a1',
//       '6d66a7e1-f5dd-4e61-a21e-1819dc96ead2',
//       '210c0737-d5f3-487d-96ec-0dde4de1804c',
//       '16576833-a3a8-4752-8050-ec1ae05d96cd',
//       '7def97de-20e3-4b30-a669-96ccc3961764',
//       '4ed7f876-6f88-4823-8bcd-dac233ccc214',
//       'b0471488-7579-4f60-890a-81dec08ebf17',
//       'b8db9efc-5007-4c98-a0e1-dd4f4456e865',
//       'db842dfd-a151-408d-9e14-83f8e798d6d8',
//       '1f25fba0-22c5-47b0-8d4f-28d49447f32b',
//       '7b24ea34-6448-4e99-92dd-2869b5c84c84',
//       'b3ccd1bb-14c0-4c6a-9ea2-5d0e955ce260',
//       '775f4f21-fa27-4e1c-a87b-6859234b55a6',
//       '351f013f-236c-4fb8-90c4-12176d97a91a',
//       'a8b20e0a-90fa-4ae2-a590-68e29498872a',
//       'da028fc8-b6dd-42e2-8136-6e80f2feb877',
//       'c4494816-7aa6-4dd2-9dae-0fd6b4b30304',
//       '30160029-e088-4546-950f-c5ef4a44ce18',
//       '228753f1-b7fc-4254-ba2d-4a2ab5d90d18',
//       '1da783ef-29a4-47c9-b62c-e05355c58d56',
//       '227bf6cc-55ea-46d9-a5f4-431ec68c0b56',
//       '5ad78272-958e-4a1a-9e12-90ec12b83192',
//       '99e61c4b-99e1-472e-b27c-dd7a81a6a3e5',
//       'ff6fa28b-6b2b-4d03-b323-74a2cb7e7856',
//       '9b8497c9-b473-4fc4-8c92-cc79c2321c34',
//       '2e10a0cb-dfdc-430e-b917-53b59b39cc21',
//       '18cadd4f-b267-4341-a366-67da33526e7a',
//       '33bef382-f6cd-401b-8a8e-e36637e60d81',
//       'cc013275-8cbc-4f66-ba2b-d851d0a4c66d',
//       '5fb5d79e-8185-4b3f-a571-8b3d21dfc438',
//       '22daada3-814c-4234-9c1b-37184bfd4dd9',
//       '135df41d-2db3-471f-8b7c-03373c9f3553',
//       '94111524-3150-4e4b-9a19-ea6d8150b2e4',
//       '52fb41bc-3799-455b-993b-a368a6d15a82',
//       '1de12073-0d5c-45da-a4b0-1ada54a4babd',
//       'e9461cca-4437-430c-9146-e3928a6d1ca5',
//       '44bd2b9e-ba1c-4e9a-bae9-1b960c6e2aec',
//       'b8a1c1d9-34c3-4ba7-b4c4-4ceca5ed6f61',
//       'b5afacff-3ca5-42ca-97f8-8fe02548eb93',
//       '4100b3ee-db7e-4ec4-b8b9-10fa2e8696d9',
//       '51ebd16d-0392-4c2e-8044-bdf90cf78c8d',
//       '16f53045-9e84-4cbb-8ff1-17b2537287f4',
//       'c09ebf67-cd1d-419d-ac18-34f016290f0d',
//       '29baf699-f1ef-4ea8-8722-a4b50b69202a',
//       'f3e2279f-87ef-4bc4-a3e6-a97e8aae8343',
//       'b5a6196c-2090-42b1-af85-0365d860b83e',
//       'ef77b2e7-347c-4d2f-a22d-4d26ec90b84c',
//       '7b6fae0c-d033-4e46-8460-a2a176d66742',
//       'b2858b48-daff-4434-87b3-b3b2d3b738a2',
//       '195632ad-b568-473a-bf4f-cb1dfd126fdd',
//       'b57f8543-78d2-423a-b341-01e05061517d',
//       '9d1c2478-0519-4346-8bb3-cc301e55ed6e',
//       'a12bf7dd-cf54-4f99-8d8e-74745045fe9b',
//       '68d207ca-271c-46aa-89d3-0637ab7ff6ae',
//       '0dafcffc-f74a-4045-967d-2df7de04ce92',
//     ],
//   });

//   return Object.values(result.vectors || {});
// }

export async function getIndexedVectorsForTestNews(pineconeIndex: VectorOperationsApi) {
  const docsToInsert = await getTestNewsDocs();

  const nonEmptyDocs = docsToInsert.filter((doc) => doc.pageContent.length > 5);

  const vectors = await getEmbeddingVectors(nonEmptyDocs);

  await indexVectorsInPinecone(vectors, pineconeIndex);
  for (const vector of vectors) {
    console.log(vector.id);
  }
  return vectors;
}
