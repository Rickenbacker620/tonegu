import { expect, describe, test } from "vitest";
import { Note } from "../src/note";

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

describe.each(noteTestCase)("Note $noteLiteral", ({ noteLiteral, pitchClass }) => {
  const note = Note.get(noteLiteral);

  test(`Pitch class: ${pitchClass}`, () => {
    expect(note.pitchClass).toBe(pitchClass);
  });
});

describe("Alter note test", () => {
  const note = new Note("C");

  test("Sharp", () => {
    expect(note.sharp(3).as("C").name).toBe("C###");
  });

  test("Sharp as D", () => {
    expect(note.sharp(3).as("D").name).toBe("D#");
  });

  test("Flat", () => {
    expect(note.flat(3).as("C").name).toBe("Cbbb");
  });

  test("Flat as B", () => {
    expect(note.flat(3).as("B").name).toBe("Bbb");
  });

  test("Alter", () => {
    expect(Note.alter("C", 3)).toBe("C###");
  });

  test("Note equals", () => {
    expect(note.equals("C")).toBe(true);
  });

  test("Note not equals", () => {
    expect(note.equals("D")).toBe(false);
  });
});
