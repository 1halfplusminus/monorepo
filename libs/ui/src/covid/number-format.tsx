import React from 'react';
import RNumberFormat from 'react-number-format';

/* eslint-disable-next-line */
export interface NumberFormatProps {
  value: number;
}

export function NumberFormat({ value }: NumberFormatProps) {
  return (
    <RNumberFormat displayType="text" thousandSeparator={' '} value={value} />
  );
}

export default NumberFormat;
