import React, { useMemo } from 'react';

import styled from 'styled-components';
import tw from 'twin.macro';
import MemoCaretDown from '../icon/caret-down';
import { isNone, none, Option, fromPredicate } from 'fp-ts/Option';
import { Token } from '../types';
import Maybe from '../../core/maybe/maybe';
import TokenSymbol from '../token-symbol/token-symbol';
import { DarkModal } from '../popup/popup';
import SearchToken from '../search-token/search-token';
import { useModal } from '../popup/hooks';
import { TokenList } from '../hooks/tokenList';
import { pipe } from 'fp-ts/function';

/* eslint-disable-next-line */
export interface TokenSelectProps {
  selected: Option<Token>;
  commonBases: TokenList;
  tokens: TokenList;
  isSelected: (token: Token) => boolean;
  onSelected: (token: Token) => void;
  onSearch?: (query: string) => void;
  disabled?: boolean;
  disabledText?: string;
}

const StyledTokenSelectWrapper = styled.div<{
  noSelection: boolean;
  disabled: boolean;
}>`
  ${tw`flex flex-row p-2 items-center rounded-lg`}
  ${({ noSelection, disabled }) =>
    noSelection
      ? tw`bg-blue-400 `
      : disabled
      ? tw`bg-transparent`
      : tw`bg-gray-800`}
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
const TokenWrapper = styled.div`
  ${tw`flex flex-col gap-2 justify-items-start`}
`;
export function TokenSelect({
  selected = none,
  commonBases,
  tokens,
  isSelected,
  onSelected,
  onSearch,
  disabled = false,
  disabledText = '',
}: TokenSelectProps) {
  const noSelection = useMemo(() => isNone(selected), [selected]);
  const { showModal, isModalVisible, handleCancel } = useModal();
  const handleCarretDown = () => {
    showModal();
  };
  return (
    <StyledTokenSelectWrapper disabled={disabled} noSelection={noSelection}>
      <Maybe option={selected} onNone={() => <Text>Select a token </Text>}>
        {(t) => (
          <TokenWrapper>
            {disabled && <Text>{disabledText + ' '}</Text>}
            <TokenItem>
              <TokenSymbol src={t.symbol} />
              <Text>{t.name}</Text>
            </TokenItem>
          </TokenWrapper>
        )}
      </Maybe>
      <Maybe
        option={pipe(
          disabled,
          fromPredicate((disabled) => !disabled)
        )}
      >
        {() => (
          <>
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
                onSearch={onSearch}
              />
            </DarkModal>
          </>
        )}
      </Maybe>
    </StyledTokenSelectWrapper>
  );
}

export default TokenSelect;
