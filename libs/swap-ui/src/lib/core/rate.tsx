import { BigNumberish, BigNumber, utils } from 'ethers';
import { Token } from '../types';

export const inverseRate = (
  rate: BigNumberish,
  tokenADecimal = 18,
  tokenBDecimal = 18
) =>
  BigNumber.from(utils.parseUnits('1', tokenADecimal))
    .div(utils.parseUnits(rate.toString(), tokenBDecimal))
    .toString();
export const countDecimals = (number: BigNumberish) => {
  if (Math.floor(Number(number).valueOf()) === Number(number).valueOf())
    return 0;
  return number.toString().split('.')[1].length || 0;
};
export const calculeAmount = (
  amount: BigNumberish,
  rate: BigNumberish,
  tokenADecimal = 18
): BigNumberish =>
  utils.formatUnits(
    utils
      .parseUnits(amount.toString(), tokenADecimal)
      .mul(utils.parseUnits(rate.toString(), countDecimals(rate))),
    tokenADecimal + countDecimals(rate)
  );
