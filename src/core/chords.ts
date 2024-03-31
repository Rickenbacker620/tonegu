import { Accidental, noteSequence, toNoteIndex, toPitchClass } from "./note";
import chordsList from "./chordsList.json";

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
    this.name = name;
    this.rootNote = "";

    const chordInfo = this.parseChordString(name);

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

  private generateNotes(
    rootNote: string,
    intervals: number[],
    pitchClasses: number[]
  ) {
    const rootIdx = toNoteIndex(rootNote);
    const rootPitchClass = toPitchClass(this.rootNote);

    const noteNamesOrg = intervals.map((scaleNumber) => {
      return noteSequence[(scaleNumber - 1 + rootIdx) % 7];
    });

    const notes = pitchClasses.map((pitchClass, index) => {
      const accOffset =
        ((pitchClass + rootPitchClass) % 12) -
        toPitchClass(noteNamesOrg[index]);
      const acc = Accidental[accOffset] || "";
      return noteNamesOrg[index] + acc;
    });

    return notes;
  }
}
