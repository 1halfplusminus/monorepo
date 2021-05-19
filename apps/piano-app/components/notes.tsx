import React from 'react';
import { Note } from '../libs/audio';
import * as option from 'fp-ts/Option';
import * as array from 'fp-ts/Array';
import type { Option } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';

/* eslint-disable-next-line */
export interface NotesProps {
  children: (note: Note) => React.ReactNode;
  notes: Option<Note[]>;
}

export function Notes({ children, notes }: NotesProps) {
  return (
    <>
      {pipe(
        notes,
        option.map((notes) =>
          pipe(
            notes,
            array.map((note) => children(note))
          )
        ),
        option.fold(
          () => null,
          (e) => e
        )
      )}
    </>
  );
}

export default Notes;
