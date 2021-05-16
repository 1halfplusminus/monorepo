import { Statistics } from '@halfoneplusminus/covid';
import format from 'date-fns/format';

const statTypes = {
  success: '',
  warning: '',
  danger: '',
  info: '',
  secondary: '',
};

export type StatType = keyof typeof statTypes;

const isStatType = (x: string): x is StatType => {
  return x in statTypes;
};

export const getColor = (type: StatType) => {
  switch (type) {
    case 'warning':
      return '#fa9b4c';
    case 'success':
      return '#19be5e';
    case 'danger':
      return '#d1335b';
    default:
      return '#53657d';
  }
};

export const formatNumber = (number: number) =>
  new Intl.NumberFormat('fr-FR').format(number);

export const formatDate = (date: Date, pattern: string) => {
  return format(date, pattern);
};

export const getStatType = (stat: Statistics | StatType | string): StatType => {
  switch (stat) {
    case 'deaths':
      return 'danger';
    case 'recovered':
      return 'success';
    case 'active':
    case 'cases':
      return 'warning';
    default:
      if (typeof stat === 'string' && isStatType(stat)) {
        return stat;
      }
      return 'info';
  }
};
