import { render } from '@testing-library/react';
import EffectButtonGroups from './effect-button-groups';

describe('EffectButtonGroups', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EffectButtonGroups />);
    expect(baseElement).toBeTruthy();
  });
});
