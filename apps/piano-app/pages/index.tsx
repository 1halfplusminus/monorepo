import React from 'react';
import styled from 'styled-components';
import Touch from '../piano/touch/touch';
import { Note, useInstrument, useNotes, usePlayNote } from '../libs/audio';
import PianoLayout from '../piano/piano-layout';
import Notes from '../components/notes';
import useLongPress from '../libs/utils';

const StyledPage = styled.div``;

export function Index() {
  const startNote: Note = ['C', 4];
  const endNote: Note = ['B', 5];
  const notes = useNotes({ startNote, endNote });
  const { play: playInstrument } = useInstrument({
    instrumentName: 'acoustic_grand_piano',
    notes,
  });
  const { play, stop } = usePlayNote({
    onPlay: (n, delay) => {
      playInstrument(n, delay);
    },
    notes: [
      ['B', 5],
      ['B', 5],
      ['A', 5],
      ['A', 5],
      ['B', 5],
      ['B', 5],
      ['A', 5],
      ['B', 5],
      ['B', 5],
      ['A', 5],
      ['A', 5],
      ['B', 5],
      ['B', 5],
      ['A', 5],
      ['G', 5],
      ['G', 5],
      ['A', 5],
      ['G', 5],
      ['A', 5],
      ['B', 5],
      ['G', 5],
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
                // eslint-disable-next-line react-hooks/rules-of-hooks
                onMouseUp={playNote(note)}
              />
            )}
          </Notes>
        </PianoLayout>
      }
    </StyledPage>
  );
}

export default Index;
