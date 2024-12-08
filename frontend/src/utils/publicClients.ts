import { http, createPublicClient } from "viem";
import { base, polygonAmoy, polygon } from "viem/chains";

export const polygonPublicClient = createPublicClient({
  chain: polygon,
  transport: http(),
});

export const polygonAmoyPublicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(),
});

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(),
});
