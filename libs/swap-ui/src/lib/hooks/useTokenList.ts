import { TokenList } from './tokenList';
import { useEffect, useState } from 'react';
import { option as O, task as T } from 'fp-ts';
import { pipe } from 'fp-ts/function';
export interface UseTokenList {
  fetchTokenList: () => Promise<TokenList>;
}
export const useTokenList = ({ fetchTokenList = T.never }: UseTokenList) => {
  const [tokenList, setTokenList] = useState<TokenList>(O.some([]));
  useEffect(() => {
    pipe(
      fetchTokenList,
      T.map((r) => setTokenList(r))
    )();
  }, [fetchTokenList]);
  return { tokenList };
};
