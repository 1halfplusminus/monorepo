import React, { PropsWithChildren, ReactNode, useState } from 'react';

import styled from 'styled-components';

import * as option from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';

/* eslint-disable-next-line */
export interface EffectButtonGroupsProps {
  children: (
    selected: number | null,
    select: (index: number) => () => void
  ) => ReactNode;
}

const StyledEffectButtonGroups = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 5.5rem);
  column-gap: 1rem;
`;

export function EffectButtonGroups({ children }: EffectButtonGroupsProps) {
  const [selected, setSelected] = useState<option.Option<number>>(option.none);
  const select = (index: number) => () => {
    setSelected(option.of(index));
  };

  return (
    <StyledEffectButtonGroups>
      {children(pipe(selected, option.toNullable), select)}
    </StyledEffectButtonGroups>
  );
}

export default EffectButtonGroups;
