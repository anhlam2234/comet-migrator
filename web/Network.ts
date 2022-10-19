import cometMigratorAbi from '../abis/CometMigrator';
import { ContractInterface } from '@ethersproject/contracts';

import mainnetV3Roots from '../node_modules/comet/deployments/mainnet/usdc/roots.json';
import { Contracts as mainnetV2Roots } from '../node_modules/compound-config/networks/mainnet.json';
import mainnetV2Abi from '../node_modules/compound-config/networks/mainnet-abi.json';

import goerliV3Roots from '../node_modules/comet/deployments/goerli/usdc/roots.json';
import { Contracts as goerliV2Roots } from '../node_modules/compound-config/networks/goerli.json';
import goerliV2Abi from '../node_modules/compound-config/networks/goerli-abi.json';

type ConstTupleItems<Tuple extends readonly [...any]> = (
    Tuple[Exclude<keyof Tuple, keyof Array<any>>]
  );

export const networks = ['goerli', 'mainnet'] as const;
export type Network = ConstTupleItems<typeof networks>;
export const goerli: Network = networks[0];
export const mainnet: Network = networks[1];

const mainnetTokens = [
  "cZRX",
  "cWBTC",
  "cUSDT",
  "cUSDC",
  "cETH",
  // "cSAI",
  "cREP",
  "cBAT",
  "cCOMP",
  "cLINK",
  "cUNI"
] as const;

const goerliTokens = [
  "cETH",
  "cCOMP",
  "cDAI",
  "cUNI",
  "cUSDC",
  "cUSDT",
  "cWBTC"
] as const;

export type CTokenSym<Network> =
  Network extends 'mainnet' ? ConstTupleItems<typeof mainnetTokens> :
  Network extends 'goerli' ? ConstTupleItems<typeof goerliTokens> :
  never;

export type RootsV2<Network> =
  Network extends 'mainnet' ? typeof mainnetV2Roots :
  Network extends 'goerli' ? typeof goerliV2Roots :
  never;

export type RootsV3<Network> =
  Network extends 'mainnet' ? typeof mainnetV3Roots :
  Network extends 'goerli' ? typeof goerliV3Roots :
  never;

export interface NetworkConfig<Network> {
  network: Network,
  comptrollerAddress: string;
  migratorAddress: string;
  migratorAbi: typeof cometMigratorAbi;
  cTokenNames: readonly CTokenSym<Network>[];
  cTokenAbi: [CTokenSym<Network>, string, ContractInterface][];
  rootsV2: RootsV2<Network>;
  rootsV3: RootsV3<Network>;
};

export function isNetwork(network: string): network is Network {
  return networks.includes(network as any);
}

export function isMainnet(network: Network): network is 'mainnet' {
  return network === 'mainnet';
}

export function isGoerli(network: Network): network is 'goerli' {
  return network === 'goerli';
}

export function getNetwork(network: string): Network {
  if (isNetwork(network)) {
    return network; // this is now narrowed to `'goerli'|'mainnet'`
  } else {
    throw new Error(`not a network: ${network}`)
  }
}

export function showNetwork(network: Network): string {
  if (network === 'mainnet') {
    return 'mainnet';
  } else if (network === 'goerli') {
    return 'goerli';
  }
  throw 'invalid';
}

export function getNetworkById(chainId: number): Network | null {
  if (chainId === 1) {
    return 'mainnet';
  } else if (chainId === 5) {
    return 'goerli';
  } else {
    return null;
  }
}

function getMigratorAddress(network: Network): string {
  if (network === 'mainnet') {
    return import.meta.env.VITE_MAINNET_EXT_ADDRESS;
  } else if (network === 'goerli') {
    return import.meta.env.VITE_GOERLI_EXT_ADDRESS;
  }

  return null as never;
}

function getComptrollerAddress(network: Network): string {
  if (network === 'mainnet') {
    return '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B';
  } else if (network === 'goerli') {
    return '0x3cBe63aAcF6A064D32072a630A3eab7545C54d78';
  }

  return null as never;
}

export function mainnetConfig<N extends 'mainnet'>(network: N): NetworkConfig<'mainnet'> {
  const migratorAddress: string = getMigratorAddress(network);
  const comptrollerAddress: string = getComptrollerAddress(network);

  let cTokenNames: readonly CTokenSym<'mainnet'>[] = mainnetTokens;

  function getCTokenSym(x: string): CTokenSym<'mainnet'> | undefined {
    for (let sym of cTokenNames) {
      if (sym !== null && sym.toString() === x) {
        return sym;
      }
    }
  }

  const cTokenAbi: [CTokenSym<'mainnet'>, string, ContractInterface][] = [];
  const rootsV2: RootsV2<'mainnet'> = mainnetV2Roots;
  const migratorAbi = cometMigratorAbi;
  const rootsV3: RootsV3<'mainnet'> = mainnetV3Roots;
  let v2ABI = mainnetV2Abi;

  for (let [key, abi] of Object.entries(v2ABI)) {
    let sym = getCTokenSym(key);
    if (sym && key in rootsV2) {
      cTokenAbi.push([sym, (rootsV2 as Record<string, string>)[key], abi]);
    }
  }

  return {
    network,
    comptrollerAddress,
    migratorAddress,
    migratorAbi,
    cTokenAbi,
    cTokenNames,
    rootsV2,
    rootsV3
  };
}

export function goerliConfig<N extends 'goerli'>(network: N): NetworkConfig<'goerli'> {
  const migratorAddress: string = getMigratorAddress(network);
  const comptrollerAddress: string = getComptrollerAddress(network);

  let cTokenNames: readonly CTokenSym<'goerli'>[] = goerliTokens;

  function getCTokenSym(x: string): CTokenSym<'goerli'> | undefined {
    for (let sym of cTokenNames) {
      if (sym !== null && sym.toString() === x) {
        return sym;
      }
    }
  }

  const cTokenAbi: [CTokenSym<'goerli'>, string, ContractInterface][] = [];
  const rootsV2: RootsV2<'goerli'> = goerliV2Roots;
  const migratorAbi = cometMigratorAbi;
  const rootsV3: RootsV3<'goerli'> = goerliV3Roots;

  let v2ABI = goerliV2Abi;

  for (let [key, abi] of Object.entries(v2ABI)) {
    let sym = getCTokenSym(key);
    if (sym && key in rootsV2) {
      cTokenAbi.push([sym, (rootsV2 as Record<string, string>)[key], abi]);
    }
  }

  return {
    network,
    comptrollerAddress,
    migratorAddress,
    migratorAbi,
    cTokenAbi,
    cTokenNames,
    rootsV2,
    rootsV3
  };
}

export function getNetworkConfig<N extends Network>(network: N): NetworkConfig<N> {
  if (isMainnet(network)) {
    return mainnetConfig(network) as NetworkConfig<N>;
  } else if (isGoerli(network)) {
    return goerliConfig(network) as NetworkConfig<N>;
  }
  return null as never;
}
