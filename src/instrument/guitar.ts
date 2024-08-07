// @ts-nocheck
import { Chord } from "../base/chord";
import { Note } from "../base/note";

import "lodash.permutations";
import _ from "lodash";

export class GuitarInfo {
  constructor(
    public chord: Chord,
    public positions: GuitarPositionWithNote[]
  ) {
  }

  equals(other: GuitarInfo) {
    return (
      this.chord.equals(other.chord) &&
      // FIXME: might need to fix
      _.isEqual(this.positions, other.positions)
    );
  }
}

export class GuitarPosition {
  constructor(public string: number, public fret: number) {
  }

  equals(other: GuitarPosition) {
    return this.string === other.string && this.fret === other.fret;
  }
}

export class GuitarPositionWithNote {
  constructor(
    public readonly string: number,
    public readonly fret: number,
    public readonly note: string = positionToNote(new GuitarPosition(string, fret)).name
  ) {
  }

  equals(other: GuitarPositionWithNote) {
    return (
      this.string === other.string &&
      this.fret === other.fret &&
      this.note === other.note
    );
  }

  static fromGuitarPosition(position: GuitarPosition) {
    return new GuitarPositionWithNote(
      position.string,
      position.fret,
      positionToNote(position).name
    );
  }
}

function noteToPositionOnString(
  note: Note,
  string: number,
  fretBefore: number = 12
) {
  const emptyStringPitchClasses = [4, 11, 7, 2, 9, 4];
  const result = [];
  for (let fret = 0; fret < fretBefore; fret++) {
    const pitchClass = (emptyStringPitchClasses[string - 1] + fret) % 12;
    if (pitchClass === note.pitchClass) {
      result.push(new GuitarPosition(string, fret));
    }
  }
  return result;
}

export function noteToPosition(
  note: Note,
  string: number | undefined = undefined,
  fretBefore: number = 12
): GuitarPosition[] {
  let result: any[] = [];

  if (string) {
    const resultOnString = noteToPositionOnString(
      note,
      string,
      fretBefore
    );
    result = result.concat(resultOnString);
  } else {
    for (let string = 1; string <= 6; string++) {
      const resultOnString = noteToPositionOnString(
        note,
        string,
        fretBefore
      );
      result = result.concat(resultOnString);
    }
  }

  return result;
}

export function positionToNote(position: GuitarPosition): Note {
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
  position: GuitarPosition,
  current: GuitarPosition[]
) {
  const distanceValid = current
  .filter((p) => p.fret != 0)
  .every((p) => Math.abs(p.fret - position.fret) <= 4);
  return distanceValid;
}

function generateCombinations(
  arrays: GuitarPosition[][],
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

  let result: GuitarPosition[][] = [];

  function helper(current: GuitarPosition[], string: number) {
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

export function getInfosFromChord(chord: Chord) {
  const root = chord.rootNote;

  const notesWithPosition = chord.notes.map((note) => {
    return noteToPosition(note, undefined, 22);
  });

  const combinationsAll = [];

  for (let i = 6; i >= 4; i--) {
    const combinations = generateCombinations(notesWithPosition, i);
    combinationsAll.push(...combinations);
  }

  return combinationsAll.map((position) => {
    return {
      chord: chord,
      positions: position.map(
        (p) =>
          new GuitarPositionWithNote(
            p.string,
            p.fret,
            positionToNote(p).name
          )
      )
    };
  });
}

export function getInfosFromPosition(positions: GuitarPosition[]) {
  let chordInfos = [];

  const fretDetails = positions.map(GuitarPositionWithNote.fromGuitarPosition);

  const rootNoteRaw = _.maxBy(fretDetails, (n) => n.string)
  const notesRaw = fretDetails.map((f) => positionToNote(f));

  const rootNote = positionToNote(rootNoteRaw)

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
        chord: chord,
        positions: fretDetails
      });
    }
  }

  return chordInfos;
}
