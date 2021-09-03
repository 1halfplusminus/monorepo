/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Pools
// ====================================================

export interface Pools_pools_token0 {
  id: string;
  symbol: string;
  decimals: any;
}

export interface Pools_pools_token1 {
  id: string;
  symbol: string;
  decimals: any;
}

export interface Pools_pools_ticks {
  liquidityNet: any;
  liquidityGross: any;
  id: string;
}

export interface Pools_pools {
  id: string;
  token0: Pools_pools_token0;
  token1: Pools_pools_token1;
  liquidity: any;
  tick: any | null;
  sqrtPrice: any;
  feeTier: any;
  token0Price: any;
  token1Price: any;
  ticks: Pools_pools_ticks[];
}

export interface Pools {
  pools: Pools_pools[];
}

export interface PoolsVariables {
  skip?: number | null;
  fist?: number | null;
}
