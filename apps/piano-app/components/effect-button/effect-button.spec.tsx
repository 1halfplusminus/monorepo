import { render } from '@testing-library/react';

import EffectButton from './effect-button';

describe('EffectButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EffectButton checked={true} />);
    expect(baseElement).toBeTruthy();
  });
});
