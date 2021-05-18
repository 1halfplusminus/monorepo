import {
  createContext,
  createRef,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { instrument, Player, InstrumentName } from 'soundfont-player';
import * as option from 'fp-ts/Option';
import * as taskOption from 'fp-ts/TaskOption';
import type { Option } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
import * as array from 'fp-ts/lib/Array';

const ReactAudioContext = createContext<Option<AudioContext>>(option.none);

export interface UseInstrumentProps {
  instrumentName: InstrumentName;
  notes: Option<string[]>;
}

export interface UseNotes {
  startNote: Note;
  endNote: Note;
}

const TONES_KEY = {
  C: '',
  'C#': '',
  D: '',
  'D#': '',
  E: '',
  F: '',
  'F#': '',
  G: '',
  'G#': '',
  A: '',
  'A#': '',
  B: '',
};
const OCTAVE_NUMBERS = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' };

type Tones = keyof typeof TONES_KEY;
type Octave = keyof typeof OCTAVE_NUMBERS;
type Note = [Tones, Octave];

const OCTAVES = Object.keys(OCTAVE_NUMBERS).map((a) =>
  parseInt(a, 10)
) as Octave[];

const TONES = Object.keys(TONES_KEY) as Tones[];

const NOTES = OCTAVES.reduce((notes, octaveNumber) => {
  const notesInOctave = TONES.map((tone) => [tone, octaveNumber]);
  return [...notes, ...notesInOctave];
}, [] as Note[]);

export default function getNotesBetween(startNote: Note, endNote: Note) {
  const startingIndex = NOTES.indexOf(startNote);
  const endingIndex = NOTES.indexOf(endNote);
  return NOTES.slice(startingIndex, endingIndex + 1);
}

export const useNotes = ({ startNote, endNote }: UseNotes) => {
  return useMemo(() => getNotesBetween(startNote, endNote), [
    startNote,
    endNote,
  ]);
};

export const useInstrument = ({
  instrumentName,
  notes = option.none,
}: UseInstrumentProps) => {
  const audioContext = useContext(ReactAudioContext);
  const [player, setPlayer] = useState<Option<Player>>(option.none);
  const play = (note: string) =>
    pipe(
      player,
      option.map((p) => p.play(note))
    );
  useEffect(() => {
    pipe(
      taskOption.fromOption(audioContext),
      taskOption.chain((c) =>
        taskOption.tryCatch(() => instrument(c, instrumentName))
      )
    )().then((r) => {
      setPlayer(r);
    });
  }, [audioContext, instrumentName]);
  useEffect(() => {
    pipe(
      notes,
      option.filter((n) => n.length > 0),
      option.map(pipe(array.map(play)))
    );
  }, [notes]);
  return {
    play: (note: string) =>
      pipe(
        player,
        option.map((p) => p.play(note))
      ),
  };
};

export const AudioContextProvider: FC = ({ children }) => {
  const [audioContext, setAudioContext] = useState<Option<AudioContext>>(
    option.none
  );
  useEffect(() => {
    setAudioContext(option.of(new AudioContext()));
  }, []);
  return (
    <ReactAudioContext.Provider value={audioContext}>
      {children}
    </ReactAudioContext.Provider>
  );
};
