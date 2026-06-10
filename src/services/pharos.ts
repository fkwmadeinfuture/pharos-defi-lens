import { createPublicClient, http, formatEther, type Address } from "viem";
import { pharosTestnet } from "../config.js";

const client = createPublicClient({
  chain: pharosTestnet,
  transport: http(),
});

export async function getNativeBalance(address: string): Promise<{
  address: string;
  balance_wei: string;
  balance_phar: string;
}> {
  const balance = await client.getBalance({
    address: address as Address,
  });

  return {
    address,
    balance_wei: balance.toString(),
    balance_phar: formatEther(balance),
  };
}

export async function getBlockNumber(): Promise<number> {
  const blockNumber = await client.getBlockNumber();
  return Number(blockNumber);
}

const ERC20_BALANCE_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export async function getERC20Balance(
  walletAddress: string,
  tokenAddress: string
): Promise<{
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
} | null> {
  try {
    const [balance, symbol, decimals, name] = await Promise.all([
      client.readContract({
        address: tokenAddress as Address,
        abi: ERC20_BALANCE_ABI,
        functionName: "balanceOf",
        args: [walletAddress as Address],
      }),
      client.readContract({
        address: tokenAddress as Address,
        abi: ERC20_BALANCE_ABI,
        functionName: "symbol",
      }),
      client.readContract({
        address: tokenAddress as Address,
        abi: ERC20_BALANCE_ABI,
        functionName: "decimals",
      }),
      client.readContract({
        address: tokenAddress as Address,
        abi: ERC20_BALANCE_ABI,
        functionName: "name",
      }),
    ]);

    const formatted = (Number(balance) / 10 ** decimals).toString();

    return {
      symbol,
      name,
      balance: formatted,
      decimals,
    };
  } catch {
    return null;
  }
}
