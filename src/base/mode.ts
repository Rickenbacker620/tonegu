import { accLiteralToOffset, Note } from "./note.ts";
import { parseDegree } from "./parser.ts";

export class Mode {
  public static modeMap: Record<string, number> = {
    "ionian": 2741
  };

  constructor(protected key: string, protected modeNumber: number) {
  }

  public static get(key: string, modeLiteral: string) {
    if (!Mode.modeMap[modeLiteral]) {
      throw new Error(`Invalid mode: ${modeLiteral}`);
    }
    return new Mode(key, Mode.modeMap[modeLiteral]);
  }

  /**
   * Generate the scale of the mode
   * @param raw if true, return the raw pitch class, else return string representation of the note
   */
  public* scale(): Generator<Note> {
    const root = Note.get(this.key);
    const seq = Note.naturalSequenceFrom(this.key[0]);
    while (true) {
      for (let i = 0; i < 12; i++) {
        if (this.modeNumber & (1 << i)) {
          const curNote = seq.next().value;
          const curPitchClass = (root.pitchClass + i) % 12;
          const note = Note.get(curPitchClass).as(curNote);
          yield note;
        }
      }
    }
  }

  /**
   * Get the note at the given index
   *
   * @param noteIndex index of the note in the scale, can be a number or a string, when using string, the format is <accidental><degree>
   * @returns the note at the given index as its name
   */
  public note(noteIndex: number): Note;
  public note(noteIndex: string): Note;
  public note(arg: number | string): Note {
    let acc = 0;
    let degree;
    if (typeof arg === "number") {
      degree = arg;
    } else if (typeof arg === "string") {
      const [accString, degreeString] = parseDegree(arg);
      acc = accLiteralToOffset(accString);
      degree = parseInt(degreeString);
    } else {
      throw new Error(`Invalid note identifier ${arg}`);
    }

    const scale = this.scale();

    let note: Note | undefined;

    while (degree > 0) {
      note = scale.next().value;
      degree--;
    }

    if (note === undefined) {
      throw new Error("Invalid note index");
    }

    return note.alter(acc);
  }

  /**
   * Get the notes at the given indices
   *
   * @param noteIndice  indices of the notes in the scale, can be a number or a string, when using string, the format is <accidental><degree>
   * @returns the notes at the given indices as their names
   */
  public notes(noteIndice: number[]): Note[];
  public notes(noteIndice: string[]): Note[];
  public notes(args: number[] | string[]): Note[] {
    let degrees = [];
    let accs = [];
    if (args.length === 0) {
      throw new Error("No note indices provided");
    } else if (typeof args[0] === "number") {
      degrees = args as number[];
    } else if (typeof args[0] === "string") {
      for (const arg of args as string[]) {
        const [accLiteral, degreeLiteral] = parseDegree(arg);
        accs.push(accLiteralToOffset(accLiteral));
        degrees.push(parseInt(degreeLiteral));
      }
    }

    const scale = this.scale();

    let curIndex = 0;
    let resultNotes = [];

    while (degrees.length > 0) {
      const curNote = scale.next().value;
      curIndex++;
      if (degrees[0] === curIndex) {
        degrees.shift();
        const acc = accs.shift() ?? 0;
        const note = curNote.alter(acc);
        resultNotes.push(note);
      }
    }

    return resultNotes;
  }
}
