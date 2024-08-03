import chordsList from "../chordsList.json";
import { parseChord } from "./parser";
import { Note } from "./note";
import { Mode } from "./mode";

import _ from "lodash";

export class Chord {
  private static chordsList = this.loadChordList();
  readonly name: string;
  readonly bassNote: Note;
  readonly rootNote: Note;
  readonly notes: Note[];

  constructor(name: string);
  constructor(root: Note, quality: string);
  constructor(nameOrRoot: string | Note, qualityLiteral?: string) {
    if (typeof nameOrRoot === "string") {
      const [root, quality, bass] = parseChord(nameOrRoot);

      const scale = Mode.get(root, "ionian");

      const chordInfo = Chord.chordsList.find((chord) =>
        chord.notations.includes(quality)
      );

      if (!chordInfo) {
        throw new Error(`Invalid chord quality: ${quality}`);
      }

      this.name = nameOrRoot;
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
    } else {
      const root = nameOrRoot;
      const scale = Mode.get(root.name, "ionian");

      const chordInfo = Chord.chordsList.find((chord) =>
        chord.notations.includes(qualityLiteral as string)
      );

      if (!chordInfo) {
        throw new Error(`Invalid chord quality: ${qualityLiteral}`);
      }

      this.name = `${root.name}${qualityLiteral}`;
      this.bassNote = root;
      this.rootNote = root;
      this.notes = scale.notes(chordInfo.notes);
    }
  }

  public static get(chordString: string): Chord {
    return new Chord(chordString);
  }

  private static noteToPitchClass: { [key: string]: number } = {
    "1": 0,
    "b2": 1,
    "#1": 1,
    "2": 2,
    "b3": 3,
    "#2": 3,
    "3": 4,
    "4": 5,
    "#3": 5,
    "b5": 6,
    "#4": 6,
    "5": 7,
    "b6": 8,
    "#5": 8,
    "6": 9,
    "b7": 10,
    "#6": 10,
    "7": 11,
    "b9": 1,
    "9": 2,
    "#9": 3,
    "11": 5,
    "#11": 6,
    "b13": 8,
    "13": 9,
  };

  // Function to convert note intervals to pitch classes
  private static convertRelativeNotesToPitchClass(notes: string[]): number[] {
    return notes.map((note) => this.noteToPitchClass[note]);
  }

  public static fromNotes(notes: Note[]): Chord | undefined {
    let notePitchClasses = [0];
    const rootNote = notes[0];

    for (let i = 1; i < notes.length; i++) {
      const prev = notes[i - 1];
      if (prev.pitchClass > notes[i].pitchClass) {
        notePitchClasses.push(
          notes[i].pitchClass + 12 - prev.pitchClass + (notePitchClasses.at(-1) ?? 0)
        );
      } else {
        notePitchClasses.push(
          notes[i].pitchClass - prev.pitchClass + (notePitchClasses.at(-1) ?? 0)
        );
      }
    }


    for (const chord of this.chordsList) {
      const intervals = this.convertRelativeNotesToPitchClass(chord.notes);
      if (notePitchClasses.length !== intervals.length) {
        continue;
      }

      if (_.isEqual(notePitchClasses, intervals)) {
        return new Chord(rootNote, chord.notations[0]);
      }
    }
    return undefined
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
