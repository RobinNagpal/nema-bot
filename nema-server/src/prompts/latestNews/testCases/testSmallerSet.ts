import { PageMetadata } from '@/contents/projectsContents';
import { getEmbeddingVectors } from '@/indexer/getEmbeddingVectors';
import { indexVectorsInPinecone } from '@/prompts/latestNews/indexVectorsInPinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { Document as LGCDocument } from 'langchain/document';
import { LATEST_NEWS_NAMESPACE } from '@/prompts/latestNews/constants';
import { Vector } from '@pinecone-database/pinecone';

const testNews: { summary: string; url: string }[] = [
  {
    summary:
      "silvergate agrees with fed deadline for wind-down plan of crypto-friendly bank skale network introduces ethereum zk-rollup levitation protocol ton foundation proposes burning 50% of network fees formula 1's red bull racing forges crypto alliance with mysten labs avalanche hits 1 million monthly active users for the first time animoca brands was given an extension until the end of q1 this year for publishing audited 2020 accounts, but it is yet to do so animoca brands is yet to produce a long-delayed set of accounts for 2020, but it is now the events of 2021 and 2022 - the first a year of wild exuberance in crypto markets, the second one marked by catastrophe - that are holding them up yat siu, chairman of animoca, said the company is working closely with its auditor dfn international to sign them off and that the biggest part is essentially the subsequent events animoca has made around 450 investments in web3 projects and sits on a trove of highly volatile tokens, placing a value on that haul is no mean feat and the two years in question were times of extreme contrast in crypto markets",
    url: 'https://www.theblock.co/post/232851/animoca-accounts-delays',
  },
  {
    summary:
      'silvergate agrees with fed deadline for wind-down plan of crypto-friendly bank, skale network introduces ethereum zk-rollup levitation protocol, ton foundation proposes burning 50% of network fees, formula 1’s red bull racing forges crypto alliance with mysten labs, avalanche hits 1 million monthly active users for the first time, rocket pool has been deployed on the zksync era network, rocket pool users will be able to move its token rETH faster and cheaper, rocket pool is a more decentralized liquid staking protocol that’s run by node operators, uphold offers easy, secure, reserved and transparent crypto platform to trade over 260+ cryptoassets, minimum of 0 locked acs tokens are required to access pro’s crypto ecosystem content from the block.',
    url: 'https://www.theblock.co/post/232862/ethereum-liquid-staking-protocol-rocket-pool-deploys-on-zksync-era',
  },
  {
    summary:
      "silvergate agrees with fed deadline for wind-down plan of crypto-friendly bank, skale network introduces ethereum zk-rollup levitation protocol, ton foundation proposes burning 50% of network fees, formula 1's red bull racing forges crypto alliance with mysten labs, avalanche hits 1 million monthly active users for the first time, circle says it's launching usdc natively on arbitrum, cross-chain transfer protocol to be brought to layer 2 network after launch of native usdc, circle rolls out euro coin stablecoin on avalanche network, uphold offers easy, secure and transparent crypto platform, lock acs tokens with the block to access pro's crypto ecosystem content.",
    url: 'https://www.theblock.co/post/232867/circle-says-its-launching-usdc-natively-on-arbitrum',
  },
  {
    summary: `avalanche, a layer 1 blockchain network, has crossed 1 million monthly active users for the first time. the recent launch of avacloud is the main reason for the growth, according to ava labs, the creator of avalanche. avacloud is a no-code platform for launching "custom blockchains," also known as subnets, on top of the avalanche network. several projects have committed to building subnets via avacloud, including korean conglomerate sk group, gaming app blitz, and aaa game studio shrapnel. circle, the issuer of the second-largest stablecoin usdc, announced recently that its euro-backed stablecoin euroc is now natively available on avalanche. alibaba's cloud division also built a launchpad for businesses to deploy metaverse spaces on the avalanche blockchain. avalanche is currently the seventh largest blockchain network with a total value locked or tvl of around $700 million.`,
    url: 'https://www.theblock.co/post/232881/avalanche-avax-1-million-mau',
  },

  {
    summary:
      'the european parliament has commissioned a study to consider areas where the markets in crypto assets (mica) policy package may be lacking. the study found that mica does not adequately consider the nuances between different defi protocols and their respective levels of decentralization, and leaves out staking, lending and nfts altogether. the report also references us policy, noting that the eu should consider the us’s howey test when classifying tokens. industry members and lawmakers have admitted there are areas where mica falls flat for months ahead of the law’s enactment, but believe it is a great step forward for europe.',
    url: 'https://blockworks.co/news/european-parliament-mica-doesnt-touch',
  },
  {
    summary:
      'gamestop has partnered with the telos foundation to pilot a new web3 game launcher called gamestop playr. the intent of the platform is to deliver aaa studio games through the platform utilizing telos blockchain as the core infrastructure. some games that are compatible or “close to fully integrated” on the telos blockchain include gambling platforms such as w3poker and owldao, as well as a mobile game called monkey empire. head of business development at the telos foundation, aj dinger, said this partnership will drive new customers into the web3 gaming space and break down many of the barriers currently deterring web2 players from embracing web3',
    url: 'https://blockworks.co/news/gamestop-telos-game-launcher',
  },
  {
    summary:
      'uniswap community members voted on a proposal to switch fees, with 45% voting for no fee and 42% in favor of a fee equivalent to 1/5 of the pool fees across the v3 pools. over 23 million uni tokens voted in favor of turning on pool fees overall, but the proposal did not pass due to concerns around possible tax and legal implications. porter smith from a16z crypto team noted that if any action relating to the fee switch could result in a tax obligation, then there needs to be an ability to pay such obligation. a16z is actively looking at ways to create this programmatic flow of funds and will provide an update with solutions in the next month or so.',
    url: 'https://blockworks.co/news/uniswap-doesnt-pass-fee-switch',
  },
  {
    summary:
      "nike has partnered with ea sports to incorporate nft's into their games. nike has also launched its first nft collection, our force 1, and is working with top athletes such as cristiano ronaldo, lebron james, michael jordan and serena williams. the our force 1 collection is limited to those with .swoosh ids and the general access sale opened on may 24 and closed on june 1. more information about how nike's nfts will be included in ea's games will be released in the coming months.",
    url: 'https://blockworks.co/news/nike-nfts-ea-sports-games',
  },
  {
    summary:
      'european central bank president christine lagarde said in a speech thursday that it is not yet apparent that core inflation has peaked in the euro zone, signaling further hikes in interest rates in the continent. data showed inflation in the 20-nation euro zone slowed markedly last month, indicating that the toughest monetary-tightening campaign of the euro era can soon draw to a close. however, lagarde said that there is no clear evidence of that yet, signaling more rate hikes in the coming months. core price pressures indicate that there’s probably still at least one more hike to come to ensure the 2% inflation target is reached. in the united states of america, fomc will meet on 15th and 16th june to decide further interest rate hikes. analysts are expecting one more hike in the interest rates in the current cycle. jai pratap is a crypto and blockchain enthusiast with over three years of working experience with different major media houses.',
    url: 'https://coingape.com/european-central-bank-chief-signals-further-hikes-in-interest-rates/',
  },
  {
    summary:
      'avalanche (avax) has reached a milestone of one million monthly active users (mau) about a week after the launch of avacloud platform, its innovative cloud computing service. ava labs, the creator of avalanche, believes the launch of avacloud has played a crucial role in the rapid growth of avalanche’s user base. avacloud is a no-code outfit that enables the creation and launch of “custom blockchains” on top of the avalanche network. several projects have committed to building subnets via avacloud, highlighting the growing recognition and adoption of avalanche’s customizable blockchain solutions across diverse industries. with one million monthly active users, the protocol has demonstrated its ability to handle a significant load of transactions and interactions on its network. looking ahead, the blockchain network’s rapid growth and expanding user base suggests a promising future for the platform as more developers and consumers discover the benefits of avalanche’s technology.',
    url: 'https://coingape.com/avalanche-hits-1m-monthly-active-users-a-week-after-avacloud-went-live/',
  },
  {
    summary:
      "silvergate bank has agreed to file a self-liquidation plan with california financial regulators within 10 days in response to a consent order issued by the federal reserve board. the bank has been ordered to responsibly manage its cash reserves and other available resources in order to compensate depositors in full. the order links the bank's failure to its involvement with the now-defunct crypto exchange, ftx. silvergate bank managed to weather the storm caused by ftx's collapse and absorb losses from the write-down on diem, a facebook-linked digital asset, by securing an emergency loan from the federal home loan bank of san francisco. coingape comprises an experienced team of native content writers and editors working round the clock to cover news globally and present news as a fact rather than an opinion",
    url: 'https://coingape.com/breaking-silvergate-bank-prepares-to-self-liquidate-following-fed-approval/',
  },
  {
    summary:
      'european stock markets opened higher friday morning as the us passed a bill to raise the debt ceiling and cap government spending for two years, averting a global economic catastrophe. jai pratap is a crypto and blockchain enthusiast with over three years of working experience with different major media houses. his current role at coingape includes creating high-impact web stories, cover breaking news, and write editorials. the debt ceiling bill passed the senate vote late thursday, after passing the house of representatives on wednesday. the uncertainty around the debt ceiling bill has only slightly rattled markets in the past month. now all eyes turn to the outlook for the u.s. economy, recession risk, and whether the federal reserve will raise, pause or even look at beginning to cut interest rates. european central bank president christine lagarde said inflation was still “too high” and that the hiking cycle needed to continue until it was clear inflation would come down to its 2% target in a “timely manner”. jai pratap also reads russian literature or watches some swedish movie when not working.',
    url: 'https://coingape.com/europe-stocks-rise-after-hitting-two-month-lows-amid-us-debt-deal/',
  },
  {
    summary: '',
    url: 'https://www.coinbureau.com/services/crypto-tax-software/',
  },
  {
    summary:
      "Uniswap community members voted on a proposal to charge fees from liquidity providers (LPs) on the protocol, with 45% voting for 'no fee' and 42% voting for one-fifth of the fee generated by Uniswap version 3 (V3) pools to be charged to LPs. an early temperature check for such a feature in December concluded that users were positive about the change but remained cautious. results of the poll could likely mean a formal poll expected for later this year incorporates community sentiment and changes parameters to keep community members satisfied. a gfx labs' proposal floated earlier this year strived to change that, noting that uniswap is in a strong position to turn on protocol fees and prove that the protocol can generate significant revenues. lps making the most money off uniswap are not retail traders, they are professional market makers, just like the ones seen on traditional exchanges.",
    url: 'https://www.coindesk.com/tech/2023/06/02/uniswap-community-votes-down-protocol-fees-for-liquidity-providers/',
  },
  {
    summary:
      "adam b. levine hosted an episode discussing the european parliament's call to treat crypto as securities by default, usdc issuer circle ditching u.s. treasuries from $24b reserve fund, elizabeth warren calling for shutdown of crypto funding for fentanyl, jimbos protocol working with u.s. homeland security to help recover $7.5m from flash loan exploit, and other stories such as brent crude oil continuous contract overview, debt ceiling saga, desantis and the growing culture war around bitcoin, cathie wood's thoughts on the u.s. crypto exodus, will the u.s. pay its bills after june 1st?, bitcoin dropping back to 24k, lawsuit questions from crypto engineers and investors, consensus survey on tradfi investors' bullishness on crypto's long-term prospects, jamie dimon's warnings on qt, and elizabeth warren's bill not stopping money laundering but potentially banning crypto",
    url: 'https://www.coindesk.com/podcasts/markets-daily/crypto-update-markets-are-mixed-as-the-current-debt-ceiling-resolution-bill-could-be-a-double-whammy-for-liquidity/',
  },
  {
    summary:
      "gamestop is partnering with the telos foundation to expand its web3 gaming offerings. the collaboration will link web3 games utilizing telos' decentralized blockchain infrastructure to gamestop's upcoming web3 game launchpad playr, providing new opportunities for mainstream gaming distribution. telos' native token tlos jumped 10% on the news before receding. gamestop has been steadily moving away from its brick and mortar strategy to focus on a digital expansion that includes web3 gaming, such as a partnership with layer 1 blockchain immutable x to build a non-fungible token (nft) marketplace and the release of its self-custodial crypto and nft wallet.",
    url: 'https://www.coindesk.com/web3/2023/06/01/gamestop-teams-up-with-the-telos-foundation-to-grow-web3-gaming-strategy/',
  },
];

export async function getTestNewsDocs(): Promise<LGCDocument<PageMetadata>[]> {
  return testNews
    .filter((news) => news.summary.trim().length > 5)
    .map((news) => {
      return new LGCDocument<PageMetadata>({
        pageContent: news.summary,
        metadata: { source: news.url, url: news.url, fullContent: news.summary, chunk: news.summary },
      });
    });
}

export async function getAllExistingSmallerTestNewsVectors(pineconeIndex: VectorOperationsApi): Promise<Vector[]> {
  const result = await pineconeIndex.fetch({
    namespace: LATEST_NEWS_NAMESPACE,
    ids: [
      '40ece177-eee6-421c-9614-9fc27c8fd5bf',
      '66136fc5-5055-4ab5-8388-48ddd05f5eba',
      '1e9b4376-2446-488e-b472-e598e4b1de70',
      'bbd0bd66-4589-49c6-a9c4-3fd93c82398a',
      '10cc69ea-5bf9-4c6a-8ed8-6319b80debe4',
      '7240ff21-832a-41cc-9369-55804150f53a',
      'cfed3a3f-5041-4fbf-9bfa-f684a6a46b1a',
      '2ab4988b-e4cc-488b-9a46-d1d23c0a8ed8',
      '1b1345c4-c7fd-4476-a826-22bfe42ea41e',
      '4f00c467-e0b2-411e-80c0-2df7b232e795',
      '3bb9a56a-8655-4aa5-836f-26233a962a1c',
      '1956b317-1a15-4950-ad3b-8b0f4f0d9605',
      'f166fb8a-2c69-4b4b-abf0-f802aaaf265c',
      'f679321c-2f0b-4cf8-becf-963c9788e593',
      '6b8900c7-2e23-4ffa-b185-680bff2d9af8',
    ],
  });

  return Object.values(result.vectors || {});
}

export async function getIndexedVectorsForSmallerSetNews(pineconeIndex: VectorOperationsApi) {
  const docsToInsert = await getTestNewsDocs();

  const ids = [];
  const nonEmptyDocs = docsToInsert.filter((doc) => doc.pageContent.length > 5);

  const vectors = await getEmbeddingVectors(nonEmptyDocs);

  await indexVectorsInPinecone(vectors, pineconeIndex);
  for (const vector of vectors) {
    ids.push(vector.id);
  }
  console.log(ids);
  return vectors;
}
