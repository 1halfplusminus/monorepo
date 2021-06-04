import React, { useMemo } from 'react';

import styled from 'styled-components';
import tw from 'twin.macro';
import MemoCaretDown from '../icon/caret-down';
import { isNone, none, Option } from 'fp-ts/Option';
import { Token } from '../types';
import Maybe from '../../core/maybe/maybe';
import TokenSymbol from '../token-symbol/token-symbol';
import { DarkModal } from '../popup/popup';
import SearchToken from '../search-token/search-token';
import { useModal } from '../popup/hooks';

/* eslint-disable-next-line */
export interface TokenSelectProps {
  selected: Option<Token>;
  commonBases: Option<Token[]>;
  tokens: Token[];
  isSelected: (token: Token) => boolean;
  onSelected: (token: Token) => void;
}

const StyledTokenSelectWrapper = styled.div<{ noSelection: boolean }>`
  ${tw`flex flex-row p-2 items-center rounded-lg`}
  ${({ noSelection }) => (noSelection ? tw`bg-blue-400 ` : tw`bg-gray-800`)}
`;

const Text = styled.div`
  ${tw`text-white`}
`;

const CaretDown = styled(MemoCaretDown)`
  fill: white;
  ${tw`h-5 w-5 cursor-pointer`}
`;

const TokenItem = styled.div`
  ${tw`flex gap-1 justify-center items-center`}
`;

export function TokenSelect({
  selected = none,
  commonBases,
  tokens,
  isSelected,
  onSelected,
}: TokenSelectProps) {
  const noSelection = useMemo(() => isNone(selected), [selected]);
  const { showModal, isModalVisible, handleCancel } = useModal();
  const handleCarretDown = () => {
    showModal();
  };
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
      <CaretDown onClick={handleCarretDown} />
      <DarkModal
        onCancel={handleCancel}
        title="Select a token"
        visible={isModalVisible}
        footer={null}
      >
        <SearchToken
          isSelected={isSelected}
          commonBases={commonBases}
          tokens={tokens}
          onSelected={onSelected}
        />
      </DarkModal>
    </StyledTokenSelectWrapper>
  );
}

export default TokenSelect;
