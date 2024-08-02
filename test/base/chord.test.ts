import { expect, test, describe } from "vitest";
import { Chord } from "../../src/base/chord";
import { Note } from "../../src/base/note";

const chordTestCases = [
  { name: "Cmaj", notes: ["C", "E", "G"], bassNote: "C" },
  { name: "A#", notes: ["A#", "C##", "E#"], bassNote: "A#" },
  { name: "A#sus4", notes: ["A#", "D#", "E#"], bassNote: "A#" },
  { name: "G7", notes: ["G", "B", "D", "F"], bassNote: "G" },
  { name: "Cm", notes: ["C", "Eb", "G"], bassNote: "C" },
  { name: "Cdim", notes: ["C", "Eb", "Gb"], bassNote: "C" },
  { name: "C", notes: ["C", "E", "G"], bassNote: "C" },
  { name: "Caug", notes: ["C", "E", "G#"], bassNote: "C" },
  { name: "C#maj7", notes: ["C#", "E#", "G#", "B#"], bassNote: "C#" },
  { name: "Gmaj7", notes: ["G", "B", "D", "F#"], bassNote: "G" },
  { name: "F#m9", notes: ["F#", "A", "C#", "E", "G#"], bassNote: "F#" },
  { name: "Bb7", notes: ["Bb", "D", "F", "Ab"], bassNote: "Bb" },
  { name: "Bb7/D", notes: ["D", "F", "Ab", "Bb"], bassNote: "D" },
  { name: "C/G", notes: ["G", "C", "E"], bassNote: "G" },
  { name: "C/F", notes: ["F", "C", "E", "G"], bassNote: "F" },
];

const progressionTestCases = [
  {
    key: "C",
    progression: ["2", "b5", "1sus2"],
    expected: ["D", "Gb", "Csus2"],
  },

  {
    key: "C",
    progression: ["2", "b5", "1sus2", "b3"],
    expected: ["D", "Gb", "Csus2", "Eb"],
  },

  {
    key: "G",
    progression: ["2", "b5", "1sus2"],
    expected: ["A", "Db", "Gsus2"],
  },
];

describe.each(chordTestCases)("$name", ({ name, notes }) => {
  test(`Components: ${notes}`, () => {
    expect(Chord.get(name).notes.map((e) => e.name)).toEqual(notes);
  });
});

describe.each(progressionTestCases)(
  "Progression in $key",
  ({ key, progression, expected }) => {
    test(`Chords: ${progression}`, () => {
      const chords = Chord.progression(key, progression);
      expect(chords.map((chord) => chord.name)).toEqual(expected);
    });
  }
);

// TODO: Should finish this
test("From notes", () => {

  const chord = Chord.fromNotes(["C", "E", "G"].map((note) => Note.get(note)));

});
