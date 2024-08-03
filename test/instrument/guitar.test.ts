import { describe, expect, test } from "vitest";
import {
  noteToPosition,
  getInfosFromPosition,
  getInfosFromChord,
  GuitarPositionWithNote,
  GuitarPosition
} from "../../src/instrument/guitar";
import { Note } from "../../src/base/note";
import { Chord } from "../../src";

const CGuitarPositions = [
  [undefined, 3, 2, 0, 1, 0],
  [undefined, 3, 5, 5, 5, 3],
  [8, 10, 10, 9, 8, 8],
  [undefined, undefined, 10, 12, 13, 12]
];

function arrToPosition(arr: (number | undefined)[]) {
  return arr.flatMap((fret, string) => {
    if (fret === undefined) return [];
    else return [new GuitarPosition(6 - string, fret)];
  });
}


const notePositionsTestCase = [
  {
    noteLiteral: "C",
    positions: [
      [1, 8],
      [2, 1],
      [3, 5],
      [4, 10],
      [5, 3],
      [6, 8]
    ],
    allFretsOnString3: [5, 17]
  },
  {
    noteLiteral: "G##",
    positions: [
      [1, 5],
      [2, 10],
      [3, 2],
      [4, 7],
      [5, 0],
      [6, 5]
    ],
    allFretsOnString3: [2, 14]
  }
];

describe.each(notePositionsTestCase)(
  "Note $noteLiteral on guitar",
  ({ noteLiteral, positions, allFretsOnString3 }) => {
    const note = Note.get(noteLiteral);


    test(`Positions before fret 12`, () => {
      const actual = new Set(noteToPosition(note));

      const expected = new Set(positions.map(([string, fret]) => new GuitarPosition(string, fret)));

      expect(actual).toEqual(expected);
    });

    test(`All fret on string 3`, () => {
      const actual = noteToPosition(note, 3, 22).map((e) => e.fret);

      expect(actual).to.have.members(allFretsOnString3);
    });
  }
);

test("Get info from chord", () => {

  const chordC = Chord.get("C");

  const actual = getInfosFromChord(chordC).map((c) => {
    return c.positions;
  });

  const expected = CGuitarPositions.map((ps) => {
    return ps.flatMap((fret, string) => {
      if (fret === undefined) return [];
      else return [new GuitarPositionWithNote(6 - string, fret)];
    });
  });

  expect(actual).to.deep.contains.members(expected);
});

test("Get info from positions", () => {
  const Darr = [undefined, undefined, 0, 2, 3, 2];
  const positions = arrToPosition(Darr);

  const actual = getInfosFromPosition(positions);

  const expected = Chord.get("Dmaj");

  expect(actual[0].chord).to.deep.equal(expected);
});
