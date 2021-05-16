import { useHeaderDatePickerState } from '../../header/hooks';
import { useStatsByCountries } from '@halfoneplusminus/covid-disease.sh';
import { useOceaniaCountriesFilter } from '@halfoneplusminus/covid';
import { useCountryStats } from '../country/country-stats';

export const useDashboard = (date: Date) => {
  const datePicker = useHeaderDatePickerState({ date: date });
  const { countries } = useStatsByCountries(datePicker.date);
  const { countries: filteredCountries } = useOceaniaCountriesFilter({
    countries,
  });
  const { bindCountryStats, bindCountriesMarker } = useCountryStats({
    country: filteredCountries?.[0],
  });
  return {
    bindDatePicker: () => datePicker,
    bindCountriesMarker: () => ({
      ...bindCountriesMarker(),
      countries: filteredCountries,
    }),
    bindCountryStats: () => bindCountryStats(filteredCountries),
  };
};
