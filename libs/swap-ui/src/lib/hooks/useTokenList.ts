import { TokenList } from './tokenList';
import { useEffect, useState } from 'react';
import { option as O, task as T, taskOption as TO } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import type { Option } from 'fp-ts/Option';

export interface UseTokenList {
  fetchTokenList: (chainId: number) => Promise<TokenList>;
  chainId: Option<number>;
}
export const useTokenList = ({
  fetchTokenList = T.never,
  chainId = O.none,
}: UseTokenList) => {
  const [tokenList, setTokenList] = useState<TokenList>(O.some([]));
  useEffect(() => {
    pipe(
      chainId,
      O.map((chainId: number) =>
        pipe(
          chainId,
          () => () => fetchTokenList(chainId),
          T.map((r) => setTokenList(r)),
          TO.fromTask
        )
      ),
      TO.fromOption,
      TO.flatten
    )();
  }, [fetchTokenList, chainId]);

  return { tokenList };
};
