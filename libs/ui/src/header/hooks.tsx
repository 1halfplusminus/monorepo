import { subDays } from 'date-fns';
import { addDays } from 'date-fns/esm';
import { useState } from 'react';

export type OnDateChange = (direction: 'left' | 'right') => void;

export const useHeaderDatePickerState = ({
  date: initialDate,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onDateChange = () => {},
}: {
  date: Date;
  onDateChange?: OnDateChange;
}): { date: Date; onClick: OnDateChange } => {
  const [date, setDate] = useState(initialDate);
  return {
    date,
    onClick: (direction) => {
      onDateChange(direction);
      switch (direction) {
        case 'left':
          setDate(addDays(date, 1));
          break;
        case 'right':
          setDate(subDays(date, 1));
          break;
      }
    },
  };
};
