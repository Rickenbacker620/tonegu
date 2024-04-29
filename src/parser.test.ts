import * as MusicParser from "./parser";
import { describe, expect, test } from "vitest";

const chordTestCases = [
  { name: "Cmaj", tokens: ["C", "maj", undefined] },
  { name: "A#", tokens: ["A#", "", undefined] },
  { name: "A#sus4", tokens: ["A#", "sus4", undefined] },
  { name: "G7", tokens: ["G", "7", undefined] },
  { name: "Cm", tokens: ["C", "m", undefined] },
  { name: "Cdim", tokens: ["C", "dim", undefined] },
  { name: "C", tokens: ["C", "", undefined] },
  { name: "Caug", tokens: ["C", "aug", undefined] },
  { name: "C#maj7", tokens: ["C#", "maj7", undefined] },
  { name: "Gmaj7", tokens: ["G", "maj7", undefined] },
  { name: "F#m9", tokens: ["F#", "m9", undefined] },
  { name: "Bb7", tokens: ["Bb", "7", undefined] },
  { name: "Bb7/D", tokens: ["Bb", "7", "D"] },
  { name: "C/G", tokens: ["C", "", "G"] },
];

describe.each(chordTestCases)("$name", ({ name, tokens }) => {
  test(`Components: ${tokens}`, () => {
    expect(MusicParser.parseChord(name)).toEqual(tokens);
  });
});
