import React from 'react';
import StatsCoronaIcon from '../title-icon/stats-corona-icon';
import TitleIcon, { TitleIconIcon } from '../title-icon/title-icon';
import { Country } from '@halfoneplusminus/covid';
/* eslint-disable-next-line */
export type CountryTitleIconProps = Pick<Country, 'name'>;

export function CountryTitleIcon({ name }: CountryTitleIconProps) {
  return (
    <TitleIcon>
      <TitleIconIcon>
        <StatsCoronaIcon />
      </TitleIconIcon>
      {name}
    </TitleIcon>
  );
}

export default CountryTitleIcon;
