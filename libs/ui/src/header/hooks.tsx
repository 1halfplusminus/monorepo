import { subDays, addDays, isPast } from 'date-fns';
import { pipe } from 'fp-ts/lib/function';
import { useState } from 'react';
import * as either from 'fp-ts/Either';

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
      pipe(
        direction === 'left' ? either.right(date) : either.left(date),
        either.mapLeft((d) => subDays(d, 1)),
        either.map((d) => addDays(d, 1)),
        either.filterOrElse<Date, Date>(isPast, () => {
          return date;
        }),
        either.fold(setDate, setDate)
      );
    },
  };
};
