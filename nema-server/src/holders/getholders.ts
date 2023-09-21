import { ethers } from "ethers";

console.log("Script started");
const INFURA_ID_KEY = "186d5309014940108be371528b7595d2";
const TOKENS = ["AAVE", "COMP", "UNI"];
const n = 2;
const ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];
const provider = new ethers.InfuraProvider("homestead", INFURA_ID_KEY);

async function getHolders(contractAddress: string): Promise<string[]> {
  try {
    const contract = new ethers.Contract(contractAddress, ABI, provider);

    
    let currentBlock = await provider.getBlockNumber();
    let logs: (ethers.Log | ethers.EventLog)[]= []; 

    const MAX_LOGS = 1000; 
    console.log(logs) ; 
    while (logs.length < MAX_LOGS) {
      const previousBlock = currentBlock - 1000;
      const newLogs = await contract.queryFilter(
        contract.filters.Transfer(null, null),
        previousBlock,
        currentBlock
      );
      logs = [...logs, ...newLogs];
      console.log(logs);
      if (newLogs.length === 0) break; 
      currentBlock = previousBlock - 1;
    }

    const holderMap: Map<string, bigint> = new Map();

    for (const log of logs) {
      const logDescription = contract.interface.parseLog(log as any);
      if (logDescription !== null) {
        const args = logDescription.args;
        const sender = args.from;
        const recipient = args.to;
        const value = BigInt(args.value.toString());
        const senderBalance: bigint = holderMap.get(sender) || 0n;
        holderMap.set(sender, senderBalance - value);

        const recipientBalance: bigint = holderMap.get(recipient) || 0n;
        holderMap.set(recipient, recipientBalance + value);
      } else {
        console.error("Failed to parse log");
      }
    }

    const topHolders = [...holderMap.entries()]
      .sort((a, b) => Number(b[1] - a[1]))
      .slice(0, 1000)
      .map((entry) => entry[0]);

    return topHolders;
  } catch (error) {
    console.error(`Failed to fetch holders: `);
    throw error;
  }
}


const getContractAddress = (tokenSymbol: string) => {
  const tokenAddresses: { [key: string]: string } = {
    aave: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    uni: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    comp: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
  };
  return tokenAddresses[tokenSymbol.toLowerCase()];
};

function findEligibleHolders(
  holderMaps: Map<string, number>[],
  n: number
): string[] {
  const totalCount: Map<string, number> = new Map();

  for (const holderMap of holderMaps) {
    for (const [holder, count] of holderMap.entries()) {
      totalCount.set(holder, (totalCount.get(holder) || 0) + count);
    }
  }

  const eligibleHolders: string[] = [];

  for (const [holder, count] of totalCount.entries()) {
    if (count >= n) {
      eligibleHolders.push(holder);
    }
  }

  return eligibleHolders;
}

async function main() {
  const holderMaps: Map<string, number>[] = [];
  let i = 0;
  for (const token of TOKENS) {
    const contractAddress = getContractAddress(token);
    console.log(contractAddress);
    const holders = await getHolders(contractAddress);
    console.log(i);
    i++;
    const holderMap: Map<string, number> = new Map();
    holders.forEach((holder) =>
      holderMap.set(holder, (holderMap.get(holder) || 0) + 1)
    );
    holderMaps.push(holderMap);
  }

  const eligibleHolders = findEligibleHolders(holderMaps, n);
  console.log(eligibleHolders);
}

main();
