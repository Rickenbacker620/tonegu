import { parseNote } from "./parser";

export enum PitchClass {
  C = 0,
  D = 2,
  E = 4,
  F = 5,
  G = 7,
  A = 9,
  B = 11,
}

export enum Accidental {
  "##" = 2,
  "#" = 1,
  "b" = -1,
  "bb" = -2,
}

const noteSequence = ["C", "D", "E", "F", "G", "A", "B"];

export class Note {
  public readonly pitchClass: number;

  public static *sequenceFrom(from: string): Generator<string> {
    let startIndex = noteSequence.indexOf(from);
    while (true) {
      yield noteSequence[startIndex];
      startIndex = (startIndex + 1) % 7;
    }
  }

  constructor(noteIdentifier: string | number) {
    if (typeof noteIdentifier === "string") {
      this.pitchClass = Note.getPitchClass(noteIdentifier);
    } else if (typeof noteIdentifier === "number") {
      this.pitchClass = noteIdentifier;
    } else {
      throw new Error("Invalid note identifier");
    }
  }

  public static get(noteLiteral: string): Note;
  public static get(pitchClass: number): Note;
  public static get(arg: string | number): Note {
    return new Note(arg);
  }

  /**
   * Convert a note to another note in the same octave
   * @param basePitch base note C, D, E, F, G, A, B
   * @returns note based on the basePitch
   */
  public as(basePitch: string): string {
    const base = Note.get(basePitch);
    let offset = (this.pitchClass - base.pitchClass) % 12;

    if (offset > 6) {
      offset -= 12;
    }
    if (offset < -6) {
      offset += 12;
    }

    const acc = offset > 0 ? "#".repeat(offset) : "b".repeat(-offset);

    return basePitch + acc;
  }

  public alter(semitones: number): Note {
    return Note.get(this.pitchClass + semitones);
  }

  public sharp(semitones: number = 1): Note {
    return this.alter(semitones);
  }

  public flat(semitones: number = 1): Note {
    return this.alter(-semitones);
  }

  /**
   * Convert a note string to pitch class
   *
   * @param str string representation of a note
   * @returns pitch class of the note
   */
  private static getPitchClass(noteLiteral: string): number {
    const [base, acc] = parseNote(noteLiteral);
    const accOffset = Accidental[acc as keyof typeof Accidental] ?? 0;
    const basePitchClass = PitchClass[base as keyof typeof PitchClass];
    const pitchClass = (basePitchClass + accOffset) % 12;
    return pitchClass;
  }
}
