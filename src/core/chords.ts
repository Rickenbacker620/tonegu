import chordsList from "./chordsList.json";
import { parseChord } from "./parser";
import { Mode } from "./mode";

export class Chord {
  readonly name: string;
  readonly bassNote: string;
  readonly rootNote: string;
  readonly notes: string[];

  public static get(chordString: string): Chord {
    return new Chord(chordString);
  }

  private static ionian = Mode.get("ionian");

  constructor(name: string) {
    const [root, quality, bass] = parseChord(name);

    const scale = Chord.ionian.on(root);

    const result = chordsList.find((chord) => {
      return chord.notations.includes(quality);
    });

    if (!result) {
      throw new Error(`Invalid chord quality: ${quality}`);
    } else {
      this.name = name;
      this.bassNote = bass;
      this.rootNote = root;
      this.notes = scale.notes(result.notes);
    }

    if (bass) {
      if (this.notes.includes(bass)) {
        this.notes = this.inversion(this.notes, bass);
      } else {
        this.notes.unshift(bass);
      }
    }
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
}
