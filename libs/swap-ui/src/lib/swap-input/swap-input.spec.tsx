import { render } from '@testing-library/react';
import { constFalse, constVoid } from 'fp-ts/function';

import SwapInput, { SwapInputProps } from './swap-input';
import { none } from 'fp-ts/lib/Option';

describe('SwapInput', () => {
  const props: SwapInputProps = {
    commonBases: none,
    isSelected: constFalse,
    onValueChange: constVoid,
    onSelected: constVoid,
    selected: none,
    sold: none,
    tokens: none,
    value: '',
    onSearch: constVoid,
  };
  it('should render successfully', () => {
    const { baseElement } = render(<SwapInput {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
