import {} from '@testing-library/react';
import getNotesBetween, {
  sortNote,
  compareTone,
  findNote,
  Note,
  NOTES,
} from './audio';

describe('Audio', () => {
  it('note to be correct', () => {
    expect(NOTES).toMatchInlineSnapshot(`
      Array [
        Array [
          "C",
          1,
          false,
        ],
        Array [
          "C#",
          1,
          true,
        ],
        Array [
          "D",
          1,
          false,
        ],
        Array [
          "D#",
          1,
          true,
        ],
        Array [
          "E",
          1,
          false,
        ],
        Array [
          "F",
          1,
          false,
        ],
        Array [
          "F#",
          1,
          true,
        ],
        Array [
          "G",
          1,
          false,
        ],
        Array [
          "G#",
          1,
          true,
        ],
        Array [
          "A",
          1,
          false,
        ],
        Array [
          "A#",
          1,
          true,
        ],
        Array [
          "B",
          1,
          false,
        ],
        Array [
          "C",
          2,
          false,
        ],
        Array [
          "C#",
          2,
          true,
        ],
        Array [
          "D",
          2,
          false,
        ],
        Array [
          "D#",
          2,
          true,
        ],
        Array [
          "E",
          2,
          false,
        ],
        Array [
          "F",
          2,
          false,
        ],
        Array [
          "F#",
          2,
          true,
        ],
        Array [
          "G",
          2,
          false,
        ],
        Array [
          "G#",
          2,
          true,
        ],
        Array [
          "A",
          2,
          false,
        ],
        Array [
          "A#",
          2,
          true,
        ],
        Array [
          "B",
          2,
          false,
        ],
        Array [
          "C",
          3,
          false,
        ],
        Array [
          "C#",
          3,
          true,
        ],
        Array [
          "D",
          3,
          false,
        ],
        Array [
          "D#",
          3,
          true,
        ],
        Array [
          "E",
          3,
          false,
        ],
        Array [
          "F",
          3,
          false,
        ],
        Array [
          "F#",
          3,
          true,
        ],
        Array [
          "G",
          3,
          false,
        ],
        Array [
          "G#",
          3,
          true,
        ],
        Array [
          "A",
          3,
          false,
        ],
        Array [
          "A#",
          3,
          true,
        ],
        Array [
          "B",
          3,
          false,
        ],
        Array [
          "C",
          4,
          false,
        ],
        Array [
          "C#",
          4,
          true,
        ],
        Array [
          "D",
          4,
          false,
        ],
        Array [
          "D#",
          4,
          true,
        ],
        Array [
          "E",
          4,
          false,
        ],
        Array [
          "F",
          4,
          false,
        ],
        Array [
          "F#",
          4,
          true,
        ],
        Array [
          "G",
          4,
          false,
        ],
        Array [
          "G#",
          4,
          true,
        ],
        Array [
          "A",
          4,
          false,
        ],
        Array [
          "A#",
          4,
          true,
        ],
        Array [
          "B",
          4,
          false,
        ],
        Array [
          "C",
          5,
          false,
        ],
        Array [
          "C#",
          5,
          true,
        ],
        Array [
          "D",
          5,
          false,
        ],
        Array [
          "D#",
          5,
          true,
        ],
        Array [
          "E",
          5,
          false,
        ],
        Array [
          "F",
          5,
          false,
        ],
        Array [
          "F#",
          5,
          true,
        ],
        Array [
          "G",
          5,
          false,
        ],
        Array [
          "G#",
          5,
          true,
        ],
        Array [
          "A",
          5,
          false,
        ],
        Array [
          "A#",
          5,
          true,
        ],
        Array [
          "B",
          5,
          false,
        ],
        Array [
          "C",
          6,
          false,
        ],
        Array [
          "C#",
          6,
          true,
        ],
        Array [
          "D",
          6,
          false,
        ],
        Array [
          "D#",
          6,
          true,
        ],
        Array [
          "E",
          6,
          false,
        ],
        Array [
          "F",
          6,
          false,
        ],
        Array [
          "F#",
          6,
          true,
        ],
        Array [
          "G",
          6,
          false,
        ],
        Array [
          "G#",
          6,
          true,
        ],
        Array [
          "A",
          6,
          false,
        ],
        Array [
          "A#",
          6,
          true,
        ],
        Array [
          "B",
          6,
          false,
        ],
        Array [
          "C",
          7,
          false,
        ],
        Array [
          "C#",
          7,
          true,
        ],
        Array [
          "D",
          7,
          false,
        ],
        Array [
          "D#",
          7,
          true,
        ],
        Array [
          "E",
          7,
          false,
        ],
        Array [
          "F",
          7,
          false,
        ],
        Array [
          "F#",
          7,
          true,
        ],
        Array [
          "G",
          7,
          false,
        ],
        Array [
          "G#",
          7,
          true,
        ],
        Array [
          "A",
          7,
          false,
        ],
        Array [
          "A#",
          7,
          true,
        ],
        Array [
          "B",
          7,
          false,
        ],
      ]
    `);
  });
  it('should compare tone correctly', () => {
    expect(compareTone('C', 'B')).toBe(12 - 1);
  });
  it('should sort notes correctly', () => {
    expect(sortNote(['C', 1], ['B', 1])).toBe(1 - 12);
  });

  it('should find index correctly', () => {
    expect(NOTES.findIndex(findNote(['B', 1]))).toBe(11);
  });
  it('should get note correctly', () => {
    const startNote: Note = ['C', 1];
    const endNote: Note = ['B', 1];
    expect(getNotesBetween(startNote, endNote)).toMatchInlineSnapshot(`
      Array [
        Array [
          "C",
          1,
          false,
        ],
        Array [
          "C#",
          1,
          true,
        ],
        Array [
          "D",
          1,
          false,
        ],
        Array [
          "D#",
          1,
          true,
        ],
        Array [
          "E",
          1,
          false,
        ],
        Array [
          "F",
          1,
          false,
        ],
        Array [
          "F#",
          1,
          true,
        ],
        Array [
          "G",
          1,
          false,
        ],
        Array [
          "G#",
          1,
          true,
        ],
        Array [
          "A",
          1,
          false,
        ],
        Array [
          "A#",
          1,
          true,
        ],
        Array [
          "B",
          1,
          false,
        ],
      ]
    `);
  });
});
