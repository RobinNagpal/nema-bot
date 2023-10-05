import { ethers } from 'ethers';

const INFURA_ID_KEY = '186d5309014940108be371528b7595d2';
const TOKENS = ['AAVE', 'COMP', 'UNI'];
const n = 2;
const ABI = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
const provider = new ethers.InfuraProvider('homestead', INFURA_ID_KEY);
interface token {
  tokenName: string;
  amount: bigint;
}
interface holderInfo {
  holderAddress: string;
  tokens: token[];
}
const holderMaps: Map<string, { tokenName: string; amount: bigint }[]> = new Map();
async function getHolders(contractAddress: string, tokenName: string): Promise<void> {
  try {
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    let currentBlock = await provider.getBlockNumber();
    let logs: any[] = [];
    const MAX_LOGS = 1000;

    while (logs.length < MAX_LOGS) {
      const previousBlock = currentBlock - 1000;
      const newLogs = await contract.queryFilter(contract.filters.Transfer(null, null), previousBlock, currentBlock);
      logs = [...logs, ...newLogs];

      if (newLogs.length === 0) break;
      currentBlock = previousBlock - 1;
    }

    for (const log of logs) {
      const logDescription = contract.interface.parseLog(log);
      if (logDescription) {
        const args = logDescription.args;
        const recipient = args.to;
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        const value: bigint = BigInt(args.value.toString());

        const holderData = holderMaps.get(recipient) || [];
        const tokenData = holderData.find((data) => data.tokenName === tokenName);
        if (tokenData) {
          tokenData.amount += value;
        } else {
          holderData.push({ tokenName, amount: value });
        }

        holderMaps.set(recipient, holderData);
      } else {
        console.error('Failed to parse log');
      }
    }
  } catch (error) {
    console.error(`Failed to fetch holders: `, error);
  }
}

const getContractAddress = (tokenSymbol: string) => {
  const tokenAddresses: { [key: string]: string } = {
    aave: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    uni: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    comp: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  };

  return tokenAddresses[tokenSymbol.toLowerCase()];
};
function findEligibleHolders(): holderInfo[] {
  const eligibleHolders: holderInfo[] = [];

  for (const [holder, tokens] of holderMaps.entries()) {
    if (tokens.length >= n) {
      const dataOfHolder: holderInfo = {
        holderAddress: holder,
        tokens: tokens,
      };
      eligibleHolders.push(dataOfHolder);
    }
  }
  return eligibleHolders;
}
async function main() {
  for (const token of TOKENS) {
    const contractAddress = getContractAddress(token);
    await getHolders(contractAddress, token);
  }
  const eligibleHolders = findEligibleHolders();
  console.log(eligibleHolders.length);
}

main();
