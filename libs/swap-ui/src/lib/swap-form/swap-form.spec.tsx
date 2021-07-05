import { render } from '@testing-library/react';
import { constVoid, constFalse } from 'fp-ts/function';

import SwapForm, { SwapFormProps } from './swap-form';
import { none } from 'fp-ts/Option';
import '@testing-library/jest-dom';

describe('SwapForm', () => {
  const propsInputA: SwapFormProps['inputA'] = {
    isSelected: constFalse,
    onValueChange: constVoid,
    onSelected: constVoid,
    selected: none,
    sold: none,
    value: '',
  };
  const propsInputB: SwapFormProps['inputB'] = {
    isSelected: constFalse,
    onValueChange: constVoid,
    onSelected: constVoid,
    selected: none,
    sold: none,
    value: '',
  };
  const props: SwapFormProps = {
    inputA: propsInputA,
    inputB: propsInputB,
    commonBases: none,
    onInverse: constVoid,
    onSearch: constVoid,
    tokens: none,
  };
  it('should render successfully', () => {
    const { baseElement } = render(<SwapForm {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
