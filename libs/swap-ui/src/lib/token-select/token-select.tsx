import React, { useMemo } from 'react';

import styled from 'styled-components';
import tw from 'twin.macro';
import MemoCaretDown from '../icon/caret-down';
import { isNone, none, Option } from 'fp-ts/Option';
import { Token } from '../types';
import Maybe from '../../core/maybe/maybe';
import TokenSymbol from '../token-symbol/token-symbol';
import Popup from '../popup/popup';
import SearchToken from '../search-token/search-token';
/* eslint-disable-next-line */
export interface TokenSelectProps {
  selected: Option<Token>;
}

const StyledTokenSelectWrapper = styled.div<{ noSelection: boolean }>`
  ${tw`flex flex-row p-2 items-center rounded-lg`}
  ${({ noSelection }) => (noSelection ? tw`bg-blue-400 ` : tw`bg-gray-800`)}
`;

const Text = styled.span`
  ${tw`text-white`}
`;

const CaretDown = styled(MemoCaretDown)`
  fill: white;
  ${tw`h-5 w-5 cursor-pointer`}
`;

const TokenItem = styled.div`
  ${tw`flex gap-1 justify-center items-center`}
`;

export function TokenSelect({ selected = none }: TokenSelectProps) {
  const noSelection = useMemo(() => isNone(selected), [selected]);
  return (
    <StyledTokenSelectWrapper noSelection={noSelection}>
      <Maybe option={selected} onNone={() => <Text>Select a token </Text>}>
        {(t) => (
          <TokenItem>
            <TokenSymbol src={t.symbol} />
            <Text>{t.name}</Text>
          </TokenItem>
        )}
      </Maybe>

      <Popup
        title="Select a token"
        renderButton={(showModal) => <CaretDown onClick={showModal} />}
      >
        <SearchToken />
      </Popup>
    </StyledTokenSelectWrapper>
  );
}

export default TokenSelect;
