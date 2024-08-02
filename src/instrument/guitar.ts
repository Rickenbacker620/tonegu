import { Chord } from "../base/chord";
import { Note } from "../base/note";

import "lodash.permutations";
import _ from "lodash";

export class GuitarFretPosition {
  constructor(public string: number, public fret: number) {}

  equals(other: GuitarFretPosition) {
    return this.string === other.string && this.fret === other.fret;
  }
}

export class GuitarFretDetail {
  constructor(
    public readonly string: number,
    public readonly fret: number,
    public readonly note: string
  ) {}

  equals(other: GuitarFretDetail) {
    return (
      this.string === other.string &&
      this.fret === other.fret &&
      this.note === other.note
    );
  }
}

function findGuitarPositionByNoteOnString(
  note: Note,
  string: number,
  fretBefore: number = 12
) {
  const emptyStringPitchClasses = [4, 11, 7, 2, 9, 4];
  const result = [];
  for (let fret = 0; fret < fretBefore; fret++) {
    const pitchClass = (emptyStringPitchClasses[string - 1] + fret) % 12;
    if (pitchClass === note.pitchClass) {
      result.push(new GuitarFretPosition(string, fret));
    }
  }
  return result;
}

export function findGuitarPositionByNote(
  note: Note,
  string: number | undefined = undefined,
  fretBefore: number = 12
): GuitarFretPosition[] {
  let result: any[] = [];

  if (string) {
    const resultOnString = findGuitarPositionByNoteOnString(
      note,
      string,
      fretBefore
    );
    result = result.concat(resultOnString);
  } else {
    for (let string = 1; string <= 6; string++) {
      const resultOnString = findGuitarPositionByNoteOnString(
        note,
        string,
        fretBefore
      );
      result = result.concat(resultOnString);
    }
  }

  return result;
}

export function findNoteByGuitarPosition(position: GuitarFretPosition): Note {
  const emptyStringPitchClasses = [4, 11, 7, 2, 9, 4];
  const pitchClass =
    (emptyStringPitchClasses[position.string - 1] + position.fret) % 12;
  return Note.get(pitchClass);
}

/**
 * Check if the position is in a range of current positions, which possible for five fingers to play
 * @param position
 * @param current
 * @returns
 */
function positionValid(
  position: GuitarFretPosition,
  current: GuitarFretPosition[]
) {
  const distanceValid = current
    .filter((p) => p.fret != 0)
    .every((p) => Math.abs(p.fret - position.fret) <= 4);
  return distanceValid;
}

function generateCombinations(
  arrays: GuitarFretPosition[][],
  rootString: number
) {
  const rootPos = arrays[0].filter((p) => p.string === rootString) ?? [];

  const positionsGroupByString = arrays.flat(1).reduce(
    (acc, pos) => {
      acc[pos.string - 1].push(pos);
      return acc;
    },
    Array.from({ length: 6 }, () => [])
  );

  let result: GuitarFretPosition[][] = [];

  function helper(current: GuitarFretPosition[], string: number) {
    if (string === 0) {
      result.push([...current]);
      return;
    }

    positionsGroupByString[string - 1].forEach((pos) => {
      if (positionValid(pos, current)) {
        current.push(pos);
        helper(current, string - 1);
        current.pop();
      }
    });
  }

  // since rootString is fixed, we need to find the combination from rootString + 1

  // find combinations from rootString - 1 to 0
  if (rootPos.length === 0) {
    throw new Error("Root note not found on the string");
  }

  rootPos.forEach((p) => helper([p], rootString - 1));
  helper(rootPos, rootString - 1);
  return result;
}

export function getFretBoardInfosFromChord(chordLiteral: string): {
  chord: string;
  root: string;
  positions: GuitarFretDetail[];
}[] {
  const chord = Chord.get(chordLiteral);
  const root = chord.rootNote;

  const notesWithPosition = chord.notes.map((note) => {
    return findGuitarPositionByNote(note, undefined, 22);
  });

  const combinationsAll = [];

  for (let i = 6; i >= 4; i--) {
    const combinations = generateCombinations(notesWithPosition, i);
    combinationsAll.push(...combinations);
  }

  return combinationsAll.map((position) => {
    return {
      chord: chordLiteral,
      root: root.name,
      positions: position.map(
        (p) =>
          new GuitarFretDetail(
            p.string,
            p.fret,
            findNoteByGuitarPosition(p).name
          )
      ),
    };
  });
}

export function getChordInfoByPosition(positions: GuitarFretPosition[]) {

  let chordInfos = []
  const fretDetails = positions.map((p) => {
    return new GuitarFretDetail(
      p.string,
      p.fret,
      findNoteByGuitarPosition(p).name
    );
  });

  const notesRaw = fretDetails.map((f) => findNoteByGuitarPosition(f));

  const rootNote = notesRaw[0];

  const notesUnique = _.uniqBy(notesRaw, "pitchClass");

  const notesWithoutRoot = notesUnique.filter(
    (n) => n.pitchClass !== rootNote.pitchClass
  );

  const possibleRestNotes = _.permutations(
    notesWithoutRoot,
    notesWithoutRoot.length
  );


  for (const restNotes of possibleRestNotes) {
    const notesALl = [rootNote, ...restNotes];
    const chord = Chord.fromNotes(notesALl);
    if (chord) {
      chordInfos.push({
        chord: chord.name,
        root: rootNote.name,
        positions: fretDetails,
      });
    }
  }

  return chordInfos
}
