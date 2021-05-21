import React, { PropsWithChildren, useEffect, useState } from 'react';

import styled, { css } from 'styled-components';

/* eslint-disable-next-line */
export interface EffectButtonProps {
  checked: boolean;
  onChecked?: () => void;
}

const StyledEffectButton = styled.div<Pick<EffectButtonProps, 'checked'>>`
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 5%;
  padding: 0.35em;
  background-color: #bcbcc0d6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    ${({ checked }) =>
      checked &&
      css`
        fill: #0075ff;
      `}
  }
`;

export function EffectButton({
  children,
  checked: checkedProp,
  onChecked,
}: PropsWithChildren<EffectButtonProps>) {
  const [checked, setChecked] = useState(checkedProp);
  const toggle = () => {
    if (onChecked) {
      onChecked();
    } else {
      setChecked(!checked);
    }
  };
  useEffect(() => {
    setChecked(checkedProp);
  }, [checkedProp]);
  return (
    <StyledEffectButton checked={checked}>
      <input type="radio" onClick={toggle} checked={checked} />
      {children}
    </StyledEffectButton>
  );
}

export default EffectButton;
