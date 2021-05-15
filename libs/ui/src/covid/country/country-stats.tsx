import React, { useEffect, useState } from 'react';
import { Country, StatisticsKeys } from '@halfoneplusminus/covid';
import StatistiqueCard from '../statistique-card';
import Stats from '../stats';
import CountryTitleIcon from './country-title-icon';

/* eslint-disable-next-line */
export interface CountryStatsProps {
  country: Country;
  onStatClick: (stat: StatisticsKeys) => void;
}
export const useCountryStats = ({
  country,
  displayStat: displayStatInitial = 'deaths',
}: {
  country: Country;
  displayStat?: StatisticsKeys;
}) => {
  const [displayStat, setDisplayStat] = useState<StatisticsKeys>(
    displayStatInitial
  );
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    country
  );
  const onStatClick = (stat: StatisticsKeys) => {
    setDisplayStat(stat);
  };

  const handleClick = (country: Country) => {
    setSelectedCountry(country);
  };
  useEffect(() => {
    setSelectedCountry(country);
  }, [country?.name]);
  return {
    bindCountriesMarker: () => ({
      displayStat,
      onClick: handleClick,
    }),
    bindCountryStats: () => ({
      country: selectedCountry,
      onStatClick: onStatClick,
    }),
  };
};

export function CountryStats({ country, onStatClick }: CountryStatsProps) {
  return country ? (
    <>
      <CountryTitleIcon name={country.name} />
      <Stats>
        <StatistiqueCard
          {...{
            value: country['cases'],
            description: 'cas confirmés',
            type: 'cases',
            onClick: onStatClick,
            variation: country.today?.cases,
          }}
        />
        <StatistiqueCard
          {...{
            value: country['recovered'],
            description: 'cas guéri',
            type: 'recovered',
            onClick: onStatClick,
            variation: country.today?.recovered,
          }}
        />
        <StatistiqueCard
          {...{
            value: country['deaths'],
            description: 'cumul des décès',
            type: 'deaths',
            onClick: onStatClick,
            variation: country.today?.deaths,
          }}
        />
      </Stats>
    </>
  ) : null;
}

export default CountryStats;
