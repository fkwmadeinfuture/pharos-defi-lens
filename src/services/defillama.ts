import { DEFILLAMA_BASE_URL } from "../config.js";
import type { ProtocolTvl } from "../types.js";

async function fetchDeFiLlama(path: string): Promise<any> {
  const url = `${DEFILLAMA_BASE_URL}${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`DeFiLlama API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getProtocolTvl(protocolName: string): Promise<ProtocolTvl | null> {
  const protocols: any[] = await fetchDeFiLlama("/protocols");

  const nameLower = protocolName.toLowerCase();
  const match = protocols.find(
    (p: any) =>
      p.name?.toLowerCase() === nameLower ||
      p.slug?.toLowerCase() === nameLower ||
      p.symbol?.toLowerCase() === nameLower
  );

  if (!match) {
    const fuzzy = protocols.find(
      (p: any) =>
        p.name?.toLowerCase().includes(nameLower) ||
        p.slug?.toLowerCase().includes(nameLower)
    );
    if (!fuzzy) return null;

    return {
      name: fuzzy.name,
      tvl: fuzzy.tvl ?? 0,
      change_1h: fuzzy.change_1h ?? 0,
      change_1d: fuzzy.change_1d ?? 0,
      change_7d: fuzzy.change_7d ?? 0,
      category: fuzzy.category ?? "Unknown",
      chains: fuzzy.chains ?? [],
    };
  }

  return {
    name: match.name,
    tvl: match.tvl ?? 0,
    change_1h: match.change_1h ?? 0,
    change_1d: match.change_1d ?? 0,
    change_7d: match.change_7d ?? 0,
    category: match.category ?? "Unknown",
    chains: match.chains ?? [],
  };
}

export async function getTopProtocols(limit: number = 10): Promise<ProtocolTvl[]> {
  const protocols: any[] = await fetchDeFiLlama("/protocols");

  return protocols
    .sort((a: any, b: any) => (b.tvl ?? 0) - (a.tvl ?? 0))
    .slice(0, limit)
    .map((p: any) => ({
      name: p.name,
      tvl: p.tvl ?? 0,
      change_1h: p.change_1h ?? 0,
      change_1d: p.change_1d ?? 0,
      change_7d: p.change_7d ?? 0,
      category: p.category ?? "Unknown",
      chains: p.chains ?? [],
    }));
}
