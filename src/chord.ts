import chordsList from "./chordsList.json";
import { parseChord } from "./parser";
import { Note } from "./note";
import { Mode } from "./mode";

export class Chord {
  private static chordsList = this.loadChordList();
  readonly name: string;
  readonly bassNote: Note;
  readonly rootNote: Note;
  readonly notes: Note[];

  constructor(name: string) {
    const [root, quality, bass] = parseChord(name);

    const scale = Mode.get(root, "ionian");

    const chordInfo = Chord.chordsList.find((chord) =>
      chord.notations.includes(quality)
    );

    if (!chordInfo) {
      throw new Error(`Invalid chord quality: ${quality}`);
    }

    this.name = name;
    this.bassNote = Note.get(bass ?? root);
    this.rootNote = Note.get(root);
    this.notes = scale.notes(chordInfo.notes);

    if (bass) {
      if (this.notes.find((note) => note.equals(this.bassNote))) {
        this.notes = this.inversion(this.notes, this.bassNote);
      } else {
        this.notes.unshift(this.bassNote);
      }
    }
  }

  public static get(chordString: string): Chord {
    return new Chord(chordString);
  }

  public static progression(key: string, chords: string[]): Chord[] {
    const absoluteChords = chords.map((chord) => {
      const scale = Mode.get(key, "ionian");
      const [rootRaw, quality, bassRaw] = parseChord(chord, true);
      const root = scale.note(rootRaw).name;
      const bass = bassRaw ? scale.note(bassRaw).name : null;
      const absoluteChordLiteral = `${root}${quality}${bass ? `/${bass}` : ""}`;
      return this.get(absoluteChordLiteral);
    });

    return absoluteChords;
  }

  private static loadChordList() {
    return chordsList;
  }

  /**
   * Invert the chord
   * @param notes original notes
   * @param arg inversion argument, could be a note or a number
   * @returns inverted notes
   */
  private inversion(notes: Note[], arg: Note | number | null) {
    let inv = 0;
    if (arg === undefined) {
      return notes;
    } else if (arg instanceof Note) {
      inv = notes.findIndex((note) => note.equals(arg));
    } else if (typeof arg === "number") {
      inv = arg;
    }
    for (let i = 0; i < inv; i++) {
      notes.push(notes.shift() as Note);
    }
    return notes;
  }
}
