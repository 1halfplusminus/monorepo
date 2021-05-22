import React, { ReactElement, ReactNode, useState } from 'react';
import styled from 'styled-components';
import * as option from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';

/* eslint-disable-next-line */
export interface EffectButtonGroupsProps {
  children?: (
    selected: number | null,
    select: (index: number) => () => void
  ) => ReactElement;
  selected?: number;
}

const StyledEffectButtonGroups = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 5.5rem);
  column-gap: 1rem;
`;

export function EffectButtonGroups({
  children,
  selected: initialSelected,
}: EffectButtonGroupsProps) {
  const [selected, setSelected] = useState<option.Option<number>>(
    initialSelected !== null ? option.of(initialSelected) : option.none
  );
  const select = (index: number) => () => {
    setSelected(option.of(index));
  };

  return children ? children(pipe(selected, option.toNullable), select) : null;
}

export default EffectButtonGroups;
