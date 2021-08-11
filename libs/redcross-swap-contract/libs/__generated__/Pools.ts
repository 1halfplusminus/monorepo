/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Pools
// ====================================================

export interface Pools_pools_token0 {
  __typename?: 'Token';
  id: string;
  symbol: string;
  decimals: any;
}

export interface Pools_pools_token1 {
  __typename?: 'Token';
  id: string;
  symbol: string;
  decimals: any;
}

export interface Pools_pools {
  __typename?: 'Pool';
  id: string;
  token0: Pools_pools_token0;
  token1: Pools_pools_token1;
  feeTier: any;
  token0Price: any;
  token1Price: any;
}

export interface Pools {
  pools: Pools_pools[];
}
