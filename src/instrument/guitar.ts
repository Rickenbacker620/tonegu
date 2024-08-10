// @ts-nocheck
import { Chord } from "../base/chord";
import { Note } from "../base/note";

import "lodash.permutations";
import _ from "lodash";

export class GuitarInfo {
  constructor(
    public chord: Chord,
    public positions: GuitarPositionWithNote[]
  ) {}

  equals(other: GuitarInfo) {
    return (
      this.chord.equals(other.chord) &&
      // FIXME: might need to fix
      _.isEqual(this.positions, other.positions)
    );
  }
}

export class GuitarPosition {
  constructor(public string: number, public fret: number) {}

  equals(other: GuitarPosition) {
    return this.string === other.string && this.fret === other.fret;
  }
}

export class GuitarPositionWithPichClass {
  constructor(
    public readonly string: number,
    public readonly fret: number,
    public readonly pitchClass: number = positionToNote(
      new GuitarPosition(string, fret)
    ).pitchClass
  ) {}

  equals(other: GuitarPositionWithPichClass) {
    return (
      this.string === other.string &&
      this.fret === other.fret &&
      this.pitchClass === other.pitchClass
    );
  }

  static fromGuitarPosition(position: GuitarPosition) {
    return new GuitarPositionWithPichClass(
      position.string,
      position.fret,
      positionToNote(position).pitchClass
    );
  }
}

export class GuitarPositionWithNote {
  constructor(
    public readonly string: number,
    public readonly fret: number,
    public readonly note: string = positionToNote(
      new GuitarPosition(string, fret)
    ).name
  ) {}

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

export function noteToPositionOnString(
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
  fretBefore: number = 12
): GuitarPosition[] {
  let result: any[] = [];

  for (let string = 1; string <= 6; string++) {
    const resultOnString = noteToPositionOnString(note, string, fretBefore);
    result = result.concat(resultOnString);
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
function positionValid(position: GuitarPosition, current: GuitarPosition[]) {
  const distanceValid = current
    .filter((p) => p.fret != 0)
    .every((p) => Math.abs(p.fret - position.fret) <= 4);
  return distanceValid;
}

function positionsContainsAllNotesInChord(
  positions: GuitarPosition[],
  chord: Chord
) {
  const notes = positions.map((p) => positionToNote(p));
  return chord.notes.every((n) => notes.some((p) => p.equals(n)));
}

function generateCombinations(noteToPositionMap, chord, bassString: number) {
  // console.log(noteToPositionMap[0], bass, bassString)

  // const rootPos = arrays[0].filter((p) => p.string === rootString) ?? [];
  const positionsWithNote = noteToPositionMap.flatMap((n) =>
    n.positions.map((p) => {
      return {
        note: n.note,
        ...p,
      };
    })
  );
  const positionsWithNoteGroupByString = _.groupBy(positionsWithNote, "string");

  const positionsBass = positionsWithNote.filter(
    (p) =>
      p.string === bassString && p.note.pitchClass === chord.bassNote.pitchClass
  );

  const positionsRest = _.chain(positionsWithNote)
    .filter((p) => p.string < bassString)
    .groupBy("string")
    .value();

  let result: GuitarPosition[][] = [];

  function helper(current: GuitarPosition[], string: number) {
    if (string === 0) {
      if (positionsContainsAllNotesInChord(current, chord)) {
        result.push([...current]);
      }
      return;
    }

    positionsRest[string].forEach((pos) => {
      if (positionValid(pos, current)) {
        current.push(pos);
        helper(current, string - 1);
        current.pop();
      }
    });
  }

  // since rootString is fixed, we need to find the combination from rootString + 1

  // find combinations from rootString - 1 to 0
  if (positionsBass.length === 0) {
    throw new Error("Bass note not found on the string");
  }

  // Start from the root position
  positionsBass.forEach((p) => helper([p], bassString - 1));
  // helper(rootPos, rootString - 1);
  return result;
}

export function getLayoutsFromChord(chord: Chord) {
  const root = chord.rootNote;

  const notesWithPosition = chord.notes.map((note) => {
    return {
      note: note,
      positions: noteToPosition(note, 22),
    };
  });

  const combinationsAll = [];

  for (let i = 6; i >= 4; i--) {
    const combinations = generateCombinations(notesWithPosition, chord, i);
    combinationsAll.push(...combinations);
  }
  return combinationsAll;
}

export function getInfosFromPosition(positions: GuitarPosition[]) {
  let chordInfos = [];

  const positionsWithPitchClass = _.chain(positions)
    .map(GuitarPositionWithPichClass.fromGuitarPosition)
    .uniqBy("pitchClass")
    .value();

  const perms = _.permutations(positionsWithPitchClass, positionsWithPitchClass.length).map((p) => p.map((e) => Note.get(e.pitchClass)));

  for (const perm of perms) {
    const chord = Chord.fromNotes(perm)
    console.log(chord)
  }

  for (const restNotes of possibleRestNotes) {
    const notesALl = [rootNote, ...restNotes];
    const chord = Chord.fromNotes(notesALl);
    if (chord) {
      chordInfos.push({
        chord: chord,
        positions: positionsWithNote,
      });
    }
  }
  console.log(chordInfos);

  return chordInfos;
}
