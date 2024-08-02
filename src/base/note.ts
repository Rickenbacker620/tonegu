import { parseNote } from "./parser.ts";

export function accLiteralToOffset(accLiteral: string): number {
  if (accLiteral === undefined) {
    return 0;
  }
  return accLiteral.length * (accLiteral[0] === "#" ? 1 : -1);
}

export function degreeToArrangeNumber(degrees: string[]): number[] {
  const noteMap: Record<string, number> = {
    "1": 0,
    "2": 2,
    "3": 4,
    "4": 5,
    "5": 7,
    "6": 9,
    "7": 11,
    "9": 14,
    "11": 17,
    "13": 21
  };

  return degrees.map((note) => {
    const pitchClass = noteMap[note.slice(-1)];
    const accidental = accLiteralToOffset(note.slice(0, -1));
    return pitchClass + accidental;
  });
}

// Note should be immutable
export class Note {
  private static naturalNoteSequence = ["C", "D", "E", "F", "G", "A", "B"];
  private static noteSequence = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
  ];
  public readonly pitchClass: number;
  public readonly name: string;
  public readonly nameWithoutAccidental: string;

  constructor(noteIdentifier: string | number) {
    if (typeof noteIdentifier === "string") {
      this.pitchClass = Note.getPitchClass(noteIdentifier);
      this.name = noteIdentifier;
      this.nameWithoutAccidental = this.name[0];
    } else if (typeof noteIdentifier === "number") {
      this.pitchClass = noteIdentifier % 12;
      this.name = Note.noteSequence[this.pitchClass];
      this.nameWithoutAccidental = this.name[0];
    } else {
      throw new Error(`Invalid note identifier ${noteIdentifier}`);
    }
  }

  /**
   * Generate a sequence of notes starting from the given note, without accidentals
   *
   * @param from starting note
   * @returns a generator that generates notes in the sequence
   */
  public static* naturalSequenceFrom(from: string): Generator<string> {
    let startIndex = Note.naturalNoteSequence.indexOf(from);
    while (true) {
      yield Note.naturalNoteSequence[startIndex];
      startIndex = (startIndex + 1) % 7;
    }
  }

  public static get(noteLiteral: string): Note;
  public static get(pitchClass: number): Note;
  public static get(arg: string | number): Note {
    return new Note(arg);
  }

  public static alter(noteLiteral: string, semitones: number): string {
    return Note.get(noteLiteral).alter(semitones).as(noteLiteral).name;
  }

  public static equals(note1: string, note2: string): boolean {
    return Note.getPitchClass(note1) === Note.getPitchClass(note2);
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
      "B": 11
    };

    const [base, acc] = parseNote(noteLiteral);
    const accOffset = accLiteralToOffset(acc);
    const basePitchClass = pitchClassMap[base];
    const pitchClass = (basePitchClass + accOffset + 12) % 12;
    return pitchClass;
  }

  /**
   * Return a new note based on the natural note
   * @param naturalNote natural note C, D, E, F, G, A, B
   * @returns note based on the basePitch
   */
  public as(naturalNote: string): Note {
    const base = Note.get(naturalNote);

    let offset = (this.pitchClass - base.pitchClass) % 12;

    if (offset > 6) {
      offset -= 12;
    }
    if (offset < -6) {
      offset += 12;
    }

    const acc = offset > 0 ? "#".repeat(offset) : "b".repeat(-offset);

    return Note.get(naturalNote + acc);
  }

  public alter(semitones: number): Note {
    return Note.get((this.pitchClass + semitones + 12) % 12).as(
      this.nameWithoutAccidental
    );
  }

  public sharp(semitones: number = 1): Note {
    return this.alter(semitones);
  }

  public flat(semitones: number = 1): Note {
    return this.alter(-semitones);
  }

  public equals(note: Note | string): boolean {
    if (typeof note === "string") {
      return this.pitchClass === Note.getPitchClass(note);
    } else {
      return this.pitchClass === note.pitchClass;
    }
  }
}
