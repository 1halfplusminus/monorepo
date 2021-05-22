import { useState } from 'react';
import { InstrumentName } from 'soundfont-player';

export const useSelectInstrument = (instrumentName: InstrumentName) => {
  const [selectedInstrument, setSelectedInstrument] = useState(instrumentName);
  return {
    selectedInstrument,
    selectInstrument: (instrumentName: InstrumentName) =>
      setSelectedInstrument(instrumentName),
  };
};

export default useSelectInstrument;
