import { z } from "zod";
import { getNativeBalance, getBlockNumber } from "../services/pharos.js";

export const getWalletPortfolioSchema = z.object({
  address: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid Ethereum-style address (0x...)")
    .describe("Pharos wallet address to query (e.g., '0x1234...abcd')"),
});

export async function handleGetWalletPortfolio(
  args: z.infer<typeof getWalletPortfolioSchema>
) {
  const [balanceData, blockNumber] = await Promise.all([
    getNativeBalance(args.address),
    getBlockNumber(),
  ]);

  return {
    success: true,
    network: "Pharos Atlantic Testnet",
    chain_id: 688689,
    block_number: blockNumber,
    wallet: {
      address: balanceData.address,
      native_token: {
        symbol: "PHAR",
        balance: balanceData.balance_phar,
        balance_wei: balanceData.balance_wei,
      },
    },
    explorer_url: `https://atlantic.pharosscan.xyz/address/${args.address}`,
    note: "This queries the Pharos Atlantic Testnet. Native PHAR balance is shown. For ERC-20 tokens, check the explorer link.",
  };
}
