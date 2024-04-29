import { Note, accLiteralToOffset } from "./note";
import { parseDegree } from "./parser";

export class Mode {
  private key: string = "C";
  public static modeMap: Record<string, number> = {
    "ionian": 2741,
  };
  constructor(protected modeNumber: number) {}

  public static get(modeLiteral: string) {
    if (!Mode.modeMap[modeLiteral]) {
      throw new Error(`Invalid mode: ${modeLiteral}`);
    }
    return new Mode(Mode.modeMap[modeLiteral]);
  }

  public on(key: string) {
    this.key = key;
    return this;
  }

  /**
   * Generate the scale of the mode
   * @param raw if true, return the raw pitch class, else return string representation of the note
   */
  public *scale(): Generator<string> {
    const root = Note.get(this.key);
    const seq = Note.sequenceFrom(this.key[0]);
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
  public note(noteIndex: number): string;
  public note(noteIndex: string): string;
  public note(arg: number | string): string {
    console.log(1)
    let acc = 0;
    let degree;
    if (typeof arg === "number") {
      degree = arg;
    } else if (typeof arg === "string") {
      const [accString, degreeString] = parseDegree(arg);
      acc = accLiteralToOffset(accString);
      degree = parseInt(degreeString);
    } else {
      throw new Error("Invalid note identifier");
    }

    const scale = this.scale();

    let note;

    while (degree > 0) {
      note = scale.next().value;
      degree--;
    }

    if (note === undefined) {
      throw new Error("Invalid note index");
    }
    note = Note.alter(note, acc);

    return note;
  }

  /**
   * Get the notes at the given indices
   *
   * @param noteIndice  indices of the notes in the scale, can be a number or a string, when using string, the format is <accidental><degree>
   * @returns the notes at the given indices as their names
   */
  public notes(noteIndice: number[]): string[];
  public notes(noteIndice: string[]): string[];
  public notes(args: number[] | string[]): string[] {
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
        const note = Note.alter(curNote, acc);
        resultNotes.push(note);
      }
    }

    return resultNotes;
  }
}
