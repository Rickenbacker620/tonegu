import { describe, expect, test } from "vitest";
import { Mode } from "../src/mode";

const AsharpScaleTestCase: { index: string; name: string }[] = [
  { index: "1", name: "A#" },
  { index: "b2", name: "B" },
  { index: "2", name: "B#" },
  { index: "b3", name: "C#" },
  { index: "3", name: "C##" },
  { index: "4", name: "D#" },
  { index: "b5", name: "E" },
];

const CmajorScaleTestCase: { index: string; name: string }[] = [
  { index: "1", name: "C" },
  { index: "b2", name: "Db" },
  { index: "2", name: "D" },
  { index: "b3", name: "Eb" },
  { index: "3", name: "E" },
  { index: "4", name: "F" },
  { index: "b5", name: "Gb" },
  { index: "5", name: "G" },
];

describe.each(AsharpScaleTestCase)("A sharps cale", ({ index, name }) => {
  const ionianA = Mode.get("ionian").on("A#");
  test(`Note ${index} is ${name}`, () => {
    const note = ionianA.note(index);
    expect(note).toBe(name);
  });
});

describe.each(CmajorScaleTestCase)("C major scale", ({ index, name }) => {
  const ionianC = Mode.get("ionian").on("C");
  test(`Note ${index} is ${name}`, () => {
    const note = ionianC.note(index);
    expect(note).toBe(name);
  });
});