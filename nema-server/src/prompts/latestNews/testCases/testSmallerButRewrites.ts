import { PageMetadata } from '@/contents/projectsContents';
import { Document as LGCDocument } from 'langchain/document';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { getEmbeddingVectors } from '@/indexer/getEmbeddingVectors';
import { indexVectorsInPinecone } from '@/prompts/latestNews/indexVectorsInPinecone';
import { Vector } from '@pinecone-database/pinecone';

import { LATEST_NEWS_NAMESPACE } from '@/prompts/latestNews/constants';

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
      'silvergate agrees fed deadline for bank wind-down, skale network introduces zk-rollup levitation protocol, ton foundation proposes burning 50% network fees, red bull racing partners with mysten labs, avalanche reaches 1 million monthly users.',
    url: 'https://www.theblock.co/post/232867/circle-says-its-launching-usdc-natively-on-arbitrum',
  },
  {
    summary: `Avalanche, a layer 1 blockchain network, has achieved a significant milestone by surpassing 1 million monthly active users for the first time. This remarkable growth can be attributed to the recent introduction of AvaCloud, which has been highlighted as the primary catalyst by Ava Labs, the creator of Avalanche. AvaCloud is a user-friendly platform that allows for the creation of "custom blockchains," also known as subnets, on the Avalanche network. Numerous projects, including the Korean conglomerate SK Group, gaming app Blitz, and AAA game studio Shrapnel, have already committed to developing subnets using AvaCloud. Additionally, Circle, the issuer of the second-largest stablecoin USDC, recently announced the native availability of their Euro-backed stablecoin, EuroC, on the Avalanche network. Alibaba's cloud division has also developed a launchpad enabling businesses to deploy metaverse spaces on the Avalanche blockchain. As of now, Avalanche stands as the seventh largest blockchain network, with a total value locked (TVL) of approximately $700 million.`,
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
      'Silvergate complies with Fed deadline for bank wind-down, Skale Network introduces Ethereum zk-rollup levitation protocol, TON Foundation suggests burning 50% of network fees, Red Bull Racing forms crypto alliance with Mysten Labs, Avalanche surpasses 1 million monthly active users.',
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
export async function getAllExistingSmallerButRewrites(pineconeIndex: VectorOperationsApi): Promise<Vector[]> {
  const result = await pineconeIndex.fetch({
    namespace: LATEST_NEWS_NAMESPACE,
    ids: [
      '776ab4b2-b79a-4950-85e5-d5c8c3b0ed60',
      '93bd8134-f968-4b5d-9139-3c598e068f22',
      '0c141e72-6633-4178-825b-ff10815be2a0',
      '45ec71ab-eeba-4799-b824-6209aa3f3b9f',
      '3b28c5cb-de7f-4870-9d61-b085aa0ad81a',
      '9b9639da-608c-44f1-831e-fa573b137229',
      '23129d06-7993-4a2d-aa77-0741de0777a2',
      'd34764fe-b570-43c8-be48-d3deec8e458f',
      '7986137a-9fa7-40d5-9317-98615805983b',
      '12798b9d-5d2f-4222-91f0-66bcff9029a7',
      'e4214896-77a7-498e-85b2-31f8afb0b449',
      '35aba320-efe4-432a-a44e-242e5769cbb6',
      '60751f21-cd0f-49fa-af74-635134895b73',
      'fa672339-70b7-4cfa-aa5d-f8801874b23b',
      'd5c80429-c7ac-4adb-aa0f-2b0170c480d8',
    ],
  });

  return Object.values(result.vectors || {});
}

export async function getIndexedVectorsForSmallerButRewriteSet(pineconeIndex: VectorOperationsApi) {
  const docsToInsert = await getTestNewsDocs();

  const ids = [];
  const nonEmptyDocs = docsToInsert.filter((doc) => doc.pageContent.length > 5);

  const vectors = await getEmbeddingVectors(nonEmptyDocs);
  for (const vector of vectors) {
    ids.push(vector.id);
  }
  console.log(ids);

  await indexVectorsInPinecone(vectors, pineconeIndex);
  return vectors;
}
