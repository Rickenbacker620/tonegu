import { Accidental, Note } from "./note";
import { parseDegree } from "./parser";

export class Mode {
  private key: string = "C";
  public static modeMap: Record<string, number> = {
    "ionian": 2741,
  };
  constructor(protected modeNumber: number) {}

  public static get(modeLiteral: string) {
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

  public note(noteIndex: number): string;
  public note(noteIndex: string): string;
  public note(arg: number | string): string {
    let acc = null;
    let degree;
    if (typeof arg === "number") {
      degree = arg;
    } else if (typeof arg === "string") {
      const [accString, degreeString] = parseDegree(arg);
      acc = Accidental[accString as keyof typeof Accidental] ?? 0;
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
    if (acc) {
      note = Note.get(note).alter(acc).as(note[0]);
    }
    return note;
  }

  public notes(noteIndice: number[]): string[]
  public notes(noteIndice: string[]): string[]
  public notes(arg: number[] | string[]): string[] {
    let acc = null;
    let degree;
    if (typeof arg === "number") {
      degree = arg;
    } else if (typeof arg === "string") {
      const [accString, degreeString] = parseDegree(arg);
      acc = Accidental[accString as keyof typeof Accidental] ?? 0;
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
    if (acc) {
      note = Note.get(note).alter(acc).as(note[0]);
    }
    return note;
  }

}
