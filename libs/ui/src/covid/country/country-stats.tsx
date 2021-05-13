import React, { useEffect, useState } from 'react';
import { Country, CountryStatistics } from '@halfoneplusminus/covid';
import StatistiqueCard from '../statistique-card';
import Stats from '../stats';

/* eslint-disable-next-line */
export interface CountryStatsProps {
  country: Country;
  onStatClick: (stat: CountryStatistics) => void;
}
export const useCountryStats = ({
  country,
  displayStat: displayStatInitial = 'deaths',
}: {
  country: Country;
  displayStat?: CountryStatistics;
}) => {
  const [displayStat, setDisplayStat] = useState<CountryStatistics>(
    displayStatInitial
  );
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    country
  );
  const onStatClick = (stat: CountryStatistics) => {
    setDisplayStat(stat);
  };

  const handleClick = (country: Country) => {
    setSelectedCountry(country);
  };
  useEffect(() => {
    setSelectedCountry(country);
  }, [country]);
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
    <Stats>
      <StatistiqueCard
        {...{
          value: country['cases'],
          description: 'cas confirmés',
          type: 'cases',
          onClick: onStatClick,
        }}
      />
      <StatistiqueCard
        {...{
          value: country['recovered'],
          description: 'cas guéri',
          type: 'recovered',
          onClick: onStatClick,
        }}
      />
      <StatistiqueCard
        {...{
          value: country['deaths'],
          description: 'cumul des décès',
          type: 'deaths',
          onClick: onStatClick,
        }}
      />
    </Stats>
  ) : null;
}

export default CountryStats;
