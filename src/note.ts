import { parseNote } from "./parser";

export function accLiteralToOffset(accLiteral: string): number {
  const accMap: Record<string, number> = {
    "##": 2,
    "#": 1,
    "b": -1,
    "bb": -2,
  };
  return accMap[accLiteral] ?? 0;
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
      this.pitchClass = noteIdentifier % 12;
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

  public static alter(noteLiteral: string, semitones: number): string {
    return Note.get(noteLiteral).alter(semitones).as(noteLiteral[0]);
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
  public static getPitchClass(noteLiteral: string): number {
    const pitchClassMap: Record<string, number> = {
      "C": 0,
      "D": 2,
      "E": 4,
      "F": 5,
      "G": 7,
      "A": 9,
      "B": 11,
    };

    const [base, acc] = parseNote(noteLiteral);
    const accOffset = accLiteralToOffset(acc);
    const basePitchClass = pitchClassMap[base];
    const pitchClass = (basePitchClass + accOffset + 12) % 12;
    return pitchClass;
  }
}
