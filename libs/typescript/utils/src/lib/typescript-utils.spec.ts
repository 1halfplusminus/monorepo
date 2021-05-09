import { tuple } from './typescript-utils';

describe('typescriptUtils', () => {
  it('should work', () => {
    expect(tuple([10, 10])).toEqual([10, 10]);
  });
});
