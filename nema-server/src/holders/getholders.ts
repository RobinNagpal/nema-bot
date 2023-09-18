import { ethers } from 'ethers';

const ETHERSCAN_API_KEY = 'C94T5CFZ2QI59MJPEI38S9SSH6WS3XUWIV';
const INFURA_ID_KEY = '186d5309014940108be371528b7595d2';

interface Holder {
  address: string;
  tokenCount: number;
}
const TOKENS = ['COMP', 'UNI', 'AAVE'];
const n = 2;

const provider = new ethers.InfuraProvider('homestead', INFURA_ID_KEY);

async function getHolders(contractAddress: string): Promise<string[]> {
  const ABI = ['event Transfer(address indexed from, address indexed to, uint256 value)'];

  try {
    const contract = new ethers.Contract(contractAddress, ABI, provider);

    const holders = new Set<string>();
    const fromBlock = 0x3cd7b3;
    const toBlock = 0x41e062;
    const step = 1000;

    for (let i = fromBlock; i <= toBlock; i += step) {
      const filter = contract.filters.Transfer(null, null);
      const logs = await contract.queryFilter(filter, i, i + step - 1);

      for (const log of logs) {
        const logDescription = contract.interface.parseLog(log as any);
        if (logDescription) {
          const arg = logDescription.args;
          holders.add(arg.from);
          holders.add(arg.to);
        } else {
          console.error('Failed to parse log');
        }
      }
    }
    return Array.from(holders);
  } catch (error) {
    console.error(`Failed to fetch holders: `);
    throw error;
  }
}

const getContractAddress = (tokenSymbol: string) => {
  if (tokenSymbol.toLowerCase() === 'aave') {
    return '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9';
  } else if (tokenSymbol.toLowerCase() === 'uni') {
    return '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
  } else {
    return '0xc00e94Cb662C3520282E6f5717214004A7f26888';
  }
};

function findEligibleHolders(holdersLists: string[][], n: number): string[] {
  const allHolders: Set<string> = new Set();

  for (const holders of holdersLists) {
    for (const holder of holders) {
      allHolders.add(holder);
    }
  }

  const eligibleHolders: string[] = [];
  for (const holder of allHolders) {
    let count = 0;
    for (const holders of holdersLists) {
      if (holders.includes(holder)) {
        count++;
      }
    }
    if (count >= n) {
      eligibleHolders.push(holder);
    }
  }

  return eligibleHolders;
}

async function main() {
  const holdersLists: string[][] = [];

  for (const token of TOKENS) {
    const contractAddress = getContractAddress(token);
    const holders = await getHolders(contractAddress);
    holdersLists.push(holders);
  }

  const eligibleHolders = findEligibleHolders(holdersLists, n);
  console.log(eligibleHolders);
}

main();
