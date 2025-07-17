"use client";

import {
  polkadot,
  ahp,
  kusama,
  ahk,
} from "@polkadot-api/descriptors";
import type { TypedApi } from "polkadot-api";
// import { logos } from "@/icons/logos";
import { chainSpec as polkadotChainSpec } from "polkadot-api/chains/polkadot";
import { chainSpec as polkadotAssetHubChainSpec } from "polkadot-api/chains/polkadot_asset_hub";
import { chainSpec as kusamaChainSpec } from "polkadot-api/chains/ksmcc3";
import { chainSpec as kusamaAssetHubChainSpec } from "polkadot-api/chains/ksmcc3_asset_hub";

export interface ChainSpec {
  name: string;
  id: string;
  chainType: string;
  bootNodes: string[];
  telemetryEndpoints: string[];
  protocolId: string;
  properties: {
    tokenDecimals: number;
    tokenSymbol: string;
  };
  relay_chain: string;
  para_id: number;
  codeSubstitutes: Record<string, string>;
  genesis: {
    stateRootHash: string;
  };
}
export interface ChainConfig {
  key: string;
  name: string;
  descriptors:
    | typeof polkadot
    | typeof ahp
    | typeof kusama
    | typeof ahk;
  endpoints: string[];
  explorerUrl?: string;
  icon?: React.ReactNode;
  chainSpec: ChainSpec;
  relayChainSpec?: ChainSpec;
}

export type AvailableApis =
  | TypedApi<typeof polkadot>
  | TypedApi<typeof ahp>
  | TypedApi<typeof kusama>
  | TypedApi<typeof ahk>;

// TODO: add all chains your dapp supports here
export const chainConfig: ChainConfig[] = [
  {
    key: "polkadot",
    name: "Polkadot",
    descriptors: polkadot,
    endpoints: ["wss://rpc.polkadot.io"],
    icon: null,
    chainSpec: JSON.parse(polkadotChainSpec),
  },
  {
    key: "ahp",
    name: "Polkadot Asset Hub",
    descriptors: ahp,
    endpoints: [
      "wss://polkadot-asset-hub-rpc.polkadot.io",
      "wss://statemint.api.onfinality.io/public-ws",
    ],
    icon: null,
    chainSpec: JSON.parse(polkadotAssetHubChainSpec),
    relayChainSpec: JSON.parse(polkadotChainSpec),
  },
  {
    key: "kusama",
    name: "kusama",
    descriptors: kusama,
    endpoints: ["wss://rpc.ibp.network/kusama"],
    icon: null,
    chainSpec: JSON.parse(kusamaChainSpec),
  },
  {
    key: "ahk",
    name: "Kusama Asset Hub",
    descriptors: ahk,
    endpoints: ["wss://asset-hub-kusama-rpc.dwellir.com"],
    icon: null,
    chainSpec: JSON.parse(kusamaAssetHubChainSpec),
    relayChainSpec: JSON.parse(kusamaChainSpec),
  },
];
