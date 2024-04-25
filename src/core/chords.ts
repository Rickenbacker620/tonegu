import { Accidental } from "./note";
import chordsList from "./chordsList.json";
import { zip } from "lodash";
import { parseChord } from "./parser";
import { parse } from "path";

export class Chord {
  readonly name: string;
  readonly fullName: string;
  readonly bassNote: string;
  readonly rootNote: string;
  readonly intervals: number[];
  readonly pitchClasses: number[];
  readonly notes: string[];

  public static fromString(chordString: string): Chord {
    return new Chord(chordString);
  }

  private parseChordString(chordString: string) {
    const matches = chordString.match(/^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/);
    if (!matches) {
      throw new Error(`Invalid chord string: ${chordString}`);
    }

    const [_, root, quality, inversion] = matches;

    const result = chordsList.find((chord) => {
      return chord.notations.includes(quality);
    });
    if (!result) {
      throw new Error(`Invalid chord quality: ${quality}`);
    } else {
      return { root, inversion, ...result };
    }
  }

  constructor(name: string) {
    const chordInfo = this.parseChordString(name);

    this.name = name;
    this.rootNote = chordInfo.root;
    this.fullName = chordInfo.name;
    this.pitchClasses = chordInfo.pitchClasses;
    this.intervals = chordInfo.intervals;

    const notes = this.generateNotes(
      this.rootNote,
      this.intervals,
      this.pitchClasses
    );
    this.notes = this.inversion(notes, chordInfo.inversion);
    this.bassNote = this.notes[0];
  }

  /**
   * Invert the chord
   * @param notes original notes
   * @param arg inversion argument, could be a note or a number
   * @returns inverted notes
   */
  private inversion(notes: string[], arg: string | number | null) {
    let inv = 0;
    if (arg === undefined) {
      return notes;
    } else if (typeof arg === "string") {
      inv = notes.indexOf(arg);
    } else if (typeof arg === "number") {
      inv = arg;
    }
    for (let i = 0; i < inv; i++) {
      notes.push(notes.shift() as string);
    }
    return notes;
  }

  /**
   * Generate notes of the chord
   * @param rootNote root note of the chord
   * @param intervals pitch intervals of the chord
   * @param pitchClasses pitch classes of the chord
   * @returns generated notes
   */
  private generateNotes(
    rootNote: string,
    intervals: number[],
    pitchClasses: number[]
  ) {
    const rootIdx = toNoteIndex(rootNote);
    const rootPitchClass = toPitchClass(this.rootNote);

    const notes = zip(intervals, pitchClasses).map(([interval, pitchClass]) => {
      if (interval === undefined || pitchClass === undefined) {
        throw new Error("Invalid chord");
      }

      const noteNamesOrg = noteSequence[(interval - 1 + rootIdx) % 7];

      let accOffset =
        (rootPitchClass + pitchClass - toPitchClass(noteNamesOrg)) % 12;

      if (Math.abs(accOffset) > 2) {
        accOffset = accOffset - 12;
      }

      const acc = Accidental[accOffset] || "";
      return noteNamesOrg + acc;
    });

    return notes;
  }
}

function* mode() {
  if (arguments.length === 1) {
    const modeNum = arguments[0];
    while (true) {
      for (let i = 0; i < 12; i++) {
        if (modeNum & (1 << i)) {
          yield i;
        }
      }
    }
  }
}

const ionian = 2741;

class ChordNeo {
  private static ionian = mode(ionian);

  public readonly name: string;
  public readonly fullName: string;
  public readonly bassNote: string;
  public readonly rootNote: string;
  public readonly intervals: number[];
  public readonly pitchClasses: number[];
  public readonly notes: string[];

  public fromString(chordLiteral: string) {
    return new ChordNeo(chordLiteral);
  }

  constructor(chordLiteral: string) {
    const [key, quality, bass] = parseChord(chordLiteral);

    const scale = ChordNeo.ionian.on(key);

    const result = chordsList.find((chord) => {
      return chord.notations.includes(quality);
    });

    if (!result) {
      throw new Error(`Invalid chord quality: ${quality}`);
    } else {
      return { root, inversion, ...result };
    }
  }

  add(note) {
    this.chord.push(note);
  }

  play() {
    console.log(this.chord);
  }
}

// function getChord(chordLiteral: string) {
//   const notes = scale.notes(["1", "3", "5"]);
//   return mode;
// }
