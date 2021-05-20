import React from 'react';
import styled from 'styled-components';
import Touch from '../piano/touch/touch';
import {
  Note,
  NoteHotkeys,
  useInstrument,
  useNotes,
  usePlayNote,
} from '../libs/audio';
import PianoLayout from '../piano/piano-layout';
import Notes from '../components/notes';

const StyledPage = styled.div``;

const hotKeys: NoteHotkeys = {
  C: {
    4: 'Q',
  },
  'C#': {
    4: '2',
  },
  D: {
    4: 'W',
  },
  'D#': {
    4: '3',
  },
  G: {
    4: 'T',
  },
  E: {
    4: 'E',
  },
  A: {
    4: 'I',
  },
  B: {
    4: 'U',
  },
};

export function Index() {
  const startNote: Note = ['C', 4];
  const endNote: Note = ['B', 5];
  const notes = useNotes({ startNote, endNote });
  const { play: playInstrument } = useInstrument({
    instrumentName: 'acoustic_grand_piano',
    notes,
  });
  const { play } = usePlayNote({
    onPlay: (n, delay) => {
      playInstrument(n, delay);
    },
    notes: [
      /*      ['B', 4],
      ['B', 4],
      ['A', 4],
      ['A', 4],
      ['B', 4],
      ['B', 4],
      ['A', 4],
      ['B', 4],
      ['B', 4],
      ['A', 4],
      ['A', 4],
      ['B', 4],
      ['B', 4],
      ['A', 4],
      ['G', 4],
      ['G', 4],
      ['A', 4],
      ['G', 4],
      ['A', 4],
      ['B', 4],
      ['G', 4], */
    ],
  });

  const playNote = (note: Note) => () => {
    play(note);
  };
  return (
    <StyledPage>
      {
        <PianoLayout startNote={startNote} endNote={endNote}>
          <Notes notes={notes}>
            {(note) => (
              <Touch
                key={note[0] + note[1]}
                note={note}
                onMouseUp={playNote(note)}
                hotkeys={hotKeys[note[0]]?.[note[1]]}
              />
            )}
          </Notes>
        </PianoLayout>
      }
    </StyledPage>
  );
}

export default Index;
