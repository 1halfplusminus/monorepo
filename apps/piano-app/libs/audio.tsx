import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import { instrument, Player, InstrumentName } from 'soundfont-player';
import * as option from 'fp-ts/Option';
import * as taskOption from 'fp-ts/TaskOption';
import type { Option } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
import { from, Subject, of, Subscription } from 'rxjs';
import { delay, concatMap, throttleTime } from 'rxjs/operators';

const ReactAudioContext = createContext<Option<AudioContext>>(option.none);

export interface UseInstrumentProps {
  instrumentName: InstrumentName;
  notes: Option<Note[]>;
}

export interface UseNotes {
  startNote: Note;
  endNote: Note;
}

const TONES_KEY = {
  C: 12,
  'C#': 11,
  D: 10,
  'D#': 9,
  E: 8,
  F: 7,
  'F#': 6,
  G: 5,
  'G#': 4,
  A: 3,
  'A#': 2,
  B: 1,
};
const OCTAVE_NUMBERS = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '' };

export type NoteHotkeys = Partial<
  {
    [Partkeys in Tone]: Partial<{ [keys in Octave]: string }>;
  }
>;

type Tone = keyof typeof TONES_KEY;
type Octave = keyof typeof OCTAVE_NUMBERS;
export type Note = [Tone, Octave, boolean?];

const OCTAVES = Object.keys(OCTAVE_NUMBERS).map((a) =>
  parseInt(a, 10)
) as Octave[];

const TONES = Object.keys(TONES_KEY) as Tone[];

const TONE_NAME: Partial<{ [key in Tone]: string }> = {
  C: 'Do',
  D: 'Ré',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
};

const isAccidental = (tone: Tone) => tone.endsWith('#');
export const getToneName = (tone: Tone) => TONE_NAME[tone];
export const compareTone = (a: Tone, b) => TONES_KEY[a] - TONES_KEY[b];
export const sortNote = (a: Note, b: Note) =>
  a[1] === b[1] ? compareTone(b[0], a[0]) : a[1] - b[1];

export const NOTES = OCTAVES.reduce((notes, octaveNumber) => {
  const notesInOctave = TONES.map((tone) => [
    tone,
    octaveNumber,
    isAccidental(tone),
  ]) as Note[];
  return [...notes, ...notesInOctave];
}, [] as Note[]).sort(sortNote);

const compareNote = (a: Note, b: Note) => sortNote(a, b) === 0;

export const findNote = (b: Note) => (a: Note, index: number) =>
  compareNote(a, b);

export default function getNotesBetween(startNote: Note, endNote: Note) {
  const startingIndex = NOTES.findIndex(findNote(startNote));
  const endingIndex = NOTES.findIndex(findNote(endNote));
  return NOTES.slice(startingIndex, endingIndex + 1);
}

export const useNotes = ({ startNote, endNote }: UseNotes) => {
  return useMemo(() => option.of(getNotesBetween(startNote, endNote)), [
    startNote,
    endNote,
  ]);
};
const subject = new Subject<Option<[Note, number]>>();
const observer = subject.pipe(
  concatMap((item) => of(item).pipe(throttleTime(50)))
);

export const usePlayNote = ({
  onPlay,
  notes = [],
}: {
  onPlay: (note: Note, delay?: number) => void;
  notes?: Note[];
}) => {
  const audioContext = useContext(ReactAudioContext);
  const [notesToPlay] = useState(notes);
  const subRef = useRef<Option<Subscription>>(option.none);
  const play = useCallback(
    (note: Note, delay?: number) =>
      pipe(
        audioContext,
        option.map((ao) => {
          subject.next(option.of([note, ao.currentTime + delay]));
        })
      ),
    [audioContext]
  );
  const stop = () => {
    subject.next(option.none);
  };
  useEffect(() => {
    if (onPlay) {
      subRef.current = pipe(
        subject
          .pipe(concatMap((item) => of(item).pipe(throttleTime(50))))
          .subscribe((note) => {
            pipe(
              note,
              option.fold(
                () => {
                  console.log('stop playing');
                },
                (note) => {
                  console.log(Date.now() + ` playing : ${note[0]} ${note[1]}`);
                  onPlay(note[0]);
                }
              )
            );
          }),
        option.of
      );
    }

    return () => {
      pipe(
        subRef.current,
        option.map((s) => s.unsubscribe())
      );
    };
  }, [onPlay]);
  useEffect(() => {
    if (play) {
      const concatMapDelay = from(notesToPlay).pipe(
        concatMap((item) => of(item).pipe(delay(1000)))
      );

      concatMapDelay.subscribe((x) => {
        play(x);
      });
    }
  }, [notesToPlay, play]);

  return { play, stop };
};

export const useInstrument = ({
  instrumentName,
  notes = option.none,
}: UseInstrumentProps) => {
  const audioContext = useContext(ReactAudioContext);
  const [player, setPlayer] = useState<Option<Player>>(option.none);
  const play = ([tone, octave]: Note, time: number = null) =>
    pipe(
      player,
      option.map((p) =>
        pipe(
          audioContext,
          option.map((ao) => p.play(`${tone}${octave}`, ao.currentTime))
        )
      )
    );
  useEffect(() => {
    pipe(
      taskOption.fromOption(audioContext),
      taskOption.chain((c) =>
        taskOption.tryCatch(() => instrument(c, instrumentName))
      )
    )().then((p) => {
      setPlayer(p);
    });
  }, [audioContext, instrumentName]);

  return {
    play,
  };
};

export const AudioContextProvider: FC = ({ children }) => {
  const [audioContext, setAudioContext] = useState<Option<AudioContext>>(
    option.none
  );
  useLayoutEffect(() => {
    const audioContext = new AudioContext();
    setAudioContext(option.of(audioContext));
    /* navigator.getUserMedia(
      // contraintes - cette app nécessite seulement l'audio
      {
        audio: true,
      },
      // fonction de rappel en cas de succès
      function (flux) {
        const gainNode = audioContext.createGain();

        const source = audioContext.createMediaStreamSource(flux);
        source.connect(gainNode);
        source.connect(audioContext.destination);
      },
      // fonction de rappel en cas d'erreur
      function (erreur) {
        console.log(
          "L'erreur à la noix suivante vient de se produire : " + erreur
        );
      }
    ); */
  }, []);
  return (
    <ReactAudioContext.Provider value={audioContext}>
      {children}
    </ReactAudioContext.Provider>
  );
};
