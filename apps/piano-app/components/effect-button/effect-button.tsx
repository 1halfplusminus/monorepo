import React, { PropsWithChildren, useEffect, useState } from 'react';

import styled, { css } from 'styled-components';

/* eslint-disable-next-line */
export interface EffectButtonProps {
  checked: boolean;
  onChecked?: () => void;
}

const StyledEffectButton = styled.div<Pick<EffectButtonProps, 'checked'>>`
  max-width: 3.2rem;
  max-width: 3.2rem;
  border-radius: 5%;
  padding: 0.15em;
  background-color: #262629;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  border: 0.3rem solid #2f2e2f;
  svg {
    width: 100%;
    height: 100%;
    fill: #6c7e90;
    ${({ checked }) =>
      checked &&
      css`
        fill: #6782ae;
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
      <input
        onChange={() => {}}
        type="radio"
        onClick={toggle}
        checked={checked}
      />
      {children}
    </StyledEffectButton>
  );
}

export default EffectButton;
