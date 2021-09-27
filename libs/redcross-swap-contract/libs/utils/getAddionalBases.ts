import { Token } from '@uniswap/sdk-core';
import { flow, pipe } from 'fp-ts/function';
import { ADDITIONAL_BASES } from '../constants/routing';
import { record as R, option as O } from 'fp-ts';

export const getAdditionalBases = flow((chaindId: number) =>
  flow((token: Token) =>
    pipe(
      ADDITIONAL_BASES,
      R.lookup(chaindId.toString()),
      O.chain((r) => pipe(r, R.lookup(token.address))),
      O.fold(
        () => [] as Array<Token>,
        (r) => r
      )
    )
  )
);
