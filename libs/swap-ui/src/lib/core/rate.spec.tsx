import { calculeAmount, countDecimals, inverseRate } from './rate';
import { utils } from 'ethers';
describe('Calcule linked to rate of token', () => {
  it('should inverse rate correctly', () => {
    expect(inverseRate(0.001899)).toEqual('526');
  });

  it('should calculate amount of tokenB from token A with rate correctly', () => {
    // 1 DAI = 0.001899 ETH
    expect(calculeAmount(100, 0.001899)).toEqual('0.1899');
    expect(calculeAmount(0.1, 0.001899)).toEqual('0.0001899');
    expect(calculeAmount(100, inverseRate(0.001899))).toEqual('52600.0');
  });
});
