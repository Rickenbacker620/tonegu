import { expect, describe, test } from "vitest";
import { Note } from "./note";

const noteTestCase: { noteLiteral: string; pitchClass: number }[] = [
  { noteLiteral: "C", pitchClass: 0 },
  { noteLiteral: "C#", pitchClass: 1 },
  { noteLiteral: "D", pitchClass: 2 },
  { noteLiteral: "D#", pitchClass: 3 },
  { noteLiteral: "E", pitchClass: 4 },
  { noteLiteral: "F", pitchClass: 5 },
  { noteLiteral: "F#", pitchClass: 6 },
  { noteLiteral: "G", pitchClass: 7 },
  { noteLiteral: "G#", pitchClass: 8 },
  { noteLiteral: "A", pitchClass: 9 },
  { noteLiteral: "A#", pitchClass: 10 },
  { noteLiteral: "B", pitchClass: 11 },
  { noteLiteral: "B#", pitchClass: 0 },
  { noteLiteral: "Bb", pitchClass: 10 },
  { noteLiteral: "Bbb", pitchClass: 9 },
  { noteLiteral: "E#", pitchClass: 5 },
  { noteLiteral: "E##", pitchClass: 6 },
];

describe.each(noteTestCase)("Note $note", ({ noteLiteral, pitchClass }) => {
  const note = Note.get(noteLiteral);

  test(`Pitch class: ${pitchClass}`, () => {
    expect(note.pitchClass).toBe(pitchClass);
  });
});
