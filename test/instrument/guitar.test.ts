import { describe, assert, expect, test } from "vitest";
import {
  findGuitarPositionByNote,
  findNoteByGuitarPosition,
  getChordInfoByPosition,
  getFretBoardInfosFromChord,
  GuitarFretDetail,
  GuitarFretPosition,
} from "../../src/instrument/guitar";
import { Note } from "../../src/base/note";

const CGuitarPositions = [
  [undefined, 3, 2, 0, 1, 0],
  [undefined, 3, 5, 5, 5, 3],
  [8, 10, 10, 9, 8, 8],
  [undefined, undefined, 10, 12, 13, 12],
];

function produceResults() {
  return CGuitarPositions.map((ps) => {
    return {
      chord: "C",
      root: "C",
      positions: ps.flatMap((fret, string) => {
        if (fret === undefined) return [];
        else
          return [
            new GuitarFretDetail(
              6 - string,
              fret,
              findNoteByGuitarPosition(
                new GuitarFretPosition(6 - string, fret)
              ).name
            ),
          ];
      }),
    };
  });
}

const aa = [
  {
    noteLiteral: "C",
    positions: [
      [1, 8],
      [2, 1],
      [3, 5],
      [4, 10],
      [5, 3],
      [6, 8],
    ],
    wholeFretOnString3: [5, 17],
  },
  {
    noteLiteral: "G##",
    positions: [
      [1, 5],
      [2, 10],
      [3, 2],
      [4, 7],
      [5, 0],
      [6, 5],
    ],
    wholeFretOnString3: [2, 14],
  },
];

describe.each(aa)(
  "Note $noteLiteral on guitar",
  ({ noteLiteral, positions, wholeFretOnString3 }) => {
    const note = Note.get(noteLiteral);
    const actual = new Set(findGuitarPositionByNote(note));
    const expected = new Set(
      positions.map(([string, fret]) => new GuitarFretPosition(string, fret))
    );

    test(`Positions before fret 12`, () => {
      assert.deepEqual(actual, expected);
    });

    test(`Whole fret on string 3`, () => {
      expect(findGuitarPositionByNote(note, 3, 22).map((e) => e.fret)).toEqual(
        wholeFretOnString3
      );
    });
  }
);

function positionContains(
  actual: GuitarFretDetail[],
  expected: GuitarFretDetail[]
) {
  return expected.every((e) => {
    return actual.some((a) => a.equals(e));
  });
}

test("Guitar test", () => {
  const actual = getFretBoardInfosFromChord("C");
  const expected = produceResults();

  expected.forEach((e, i) => {
    const isActualContainsExpected = actual.some((a) => {
      return (
        a.chord === e.chord &&
        a.root === e.root &&
        positionContains(a.positions, e.positions)
      );
    });
    assert.isTrue(
      isActualContainsExpected,
      `Expected ${JSON.stringify(e)} not found`
    );
  });
});

test("Note to chord", () => {

  const fp = [undefined, undefined, 0, 2,3,2]

  const chords = getChordInfoByPosition(fp.flatMap((fret, string) => {
    if (fret === undefined) return [];
    else return [new GuitarFretPosition(6 - string, fret)];
  }))

  for (const chord of chords) {
    console.log(chord);
  }

})
