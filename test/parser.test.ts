import { describe, expect, test } from "vitest";
import * as MusicParser from "../src/parser";

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

const relativeChordTestCases = [
  { name: "2m", tokens: ["2", "m", undefined] },
  { name: "2min", tokens: ["2", "min", undefined] },
  { name: "5m", tokens: ["5", "m", undefined] },
  { name: "1dom", tokens: ["1", "dom", undefined] },
  { name: "1", tokens: ["1", "", undefined] },
  { name: "5", tokens: ["5", "", undefined] },
  { name: "1m", tokens: ["1", "m", undefined] },
  { name: "b3dim", tokens: ["b3", "dim", undefined] },
  { name: "b3/5", tokens: ["b3", "", "5"] },
  { name: "#3", tokens: ["#3", "", undefined] },
  { name: "67", tokens: ["6", "7", undefined] },
];

describe.each(chordTestCases)("$name", ({ name, tokens }) => {
  test(`Components: ${tokens}`, () => {
    expect(MusicParser.parseChord(name)).toEqual(tokens);
  });
});

describe.each(relativeChordTestCases)("$name", ({ name, tokens }) => {
  test(`Components: ${tokens}`, () => {
    expect(MusicParser.parseChord(name, true)).toEqual(tokens);
  });
})