import React from 'react';
import styled from 'styled-components';
import { Note, NoteHotkeys, useNotes } from '../../libs/audio';
import Notes from '../notes';
import PianoKeyboardLayout from './piano-layout';
import Touch from './touch/touch';

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

/* eslint-disable-next-line */
export interface PianoProps {
  startNote: Note;
  endNote: Note;
  play: (note: Note) => void;
}

const StyledPiano = styled.div`
  color: pink;
`;

export function Piano({ startNote, endNote, play }: PianoProps) {
  const notes = useNotes({ startNote, endNote });
  const handleMouseUp = (note: Note) => () => play(note);
  return (
    <PianoKeyboardLayout startNote={startNote} endNote={endNote}>
      <Notes notes={notes}>
        {(note) => (
          <Touch
            key={note[0] + note[1]}
            note={note}
            onMouseUp={handleMouseUp(note)}
            hotkeys={hotKeys[note[0]]?.[note[1]]}
          />
        )}
      </Notes>
    </PianoKeyboardLayout>
  );
}

export default Piano;
