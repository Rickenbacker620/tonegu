import { expect, describe, test } from "vitest";
import {
  appendOctave,
  toMidi,
  toPitchClass,
  toFrequency,
  toNoteIndex,
} from "./note";

const noteWithOctaveTestCase = [
  { note: "A0", midi: 21, frequency: 27.5 },
  { note: "C4", midi: 60, frequency: 261.63 },
  { note: "G9", midi: 127, frequency: 12543.85 },
  { note: "Gb6", midi: 90, frequency: 1479.98 },
  { note: "G6", midi: 91, frequency: 1567.98 },
  { note: "G#6", midi: 92, frequency: 1661.22 },
  { note: "Gbb7", midi: 101, frequency: 2793.83 },
  { note: "G7", midi: 103, frequency: 3135.96 },
  { note: "G##7", midi: 105, frequency: 3520 },
];

const noteTestCase = [
  { note: "C", pitchClass: 0, noteIndex: 0 },
  { note: "C#", pitchClass: 1, noteIndex: 0 },
  { note: "D", pitchClass: 2, noteIndex: 1 },
  { note: "D#", pitchClass: 3, noteIndex: 1 },
  { note: "E", pitchClass: 4, noteIndex: 2 },
  { note: "F", pitchClass: 5, noteIndex: 3 },
  { note: "F#", pitchClass: 6, noteIndex: 3 },
  { note: "G", pitchClass: 7, noteIndex: 4 },
  { note: "G#", pitchClass: 8, noteIndex: 4 },
  { note: "A", pitchClass: 9, noteIndex: 5 },
  { note: "A#", pitchClass: 10, noteIndex: 5 },
  { note: "B", pitchClass: 11, noteIndex: 6 },
  { note: "B#", pitchClass: 0, noteIndex: 6 },
  { note: "Bb", pitchClass: 10, noteIndex: 6 },
  { note: "Bbb", pitchClass: 9, noteIndex: 6 },
  { note: "E#", pitchClass: 5, noteIndex: 2 },
];

const appendOctaveTestCases: [string[], string[]][] = [
  [
    ["C", "E", "G"],
    ["C4", "E4", "G4"],
  ],
  [
    ["C", "E", "G", "B"],
    ["C4", "E4", "G4", "B4"],
  ],
  [
    ["C#", "E", "G", "B", "D"],
    ["C#4", "E4", "G4", "B4", "D5"],
  ],
  [
    ["C", "Eb", "G", "B", "D", "F"],
    ["C4", "Eb4", "G4", "B4", "D5", "F5"],
  ],
  [
    ["B", "D", "F", "A", "C", "E"],
    ["B4", "D5", "F5", "A5", "C6", "E6"],
  ],
];

describe.each(noteWithOctaveTestCase)(
  "Midi number $midi",
  ({ midi, frequency }) => {
    test(`${frequency}hz `, () => {
      expect(toFrequency(midi)).toBeCloseTo(frequency);
    });
  }
);

describe.each(noteWithOctaveTestCase)(
  "Note $note",
  ({ note, midi, frequency }) => {
    test(`MIDI: ${midi}`, () => {
      expect(toMidi(note)).toBe(midi);
    });

    test(`${frequency}hz `, () => {
      expect(toFrequency(note)).toBeCloseTo(frequency);
    });
  }
);

describe.each(noteTestCase)("Note $note", ({ note, pitchClass, noteIndex }) => {
  test(`Pitch class: ${pitchClass}`, () => {
    expect(toPitchClass(note)).toBe(pitchClass);
  });

  test(`Note index: ${noteIndex}`, () => {
    expect(toNoteIndex(note)).toBe(noteIndex);
  });
});

describe.each(appendOctaveTestCases)("Append Octave: %j", (notes, expected) => {
  test(`${expected.join(" ")}`, () => {
    expect(appendOctave(notes)).toEqual(expected);
  });
});
