import { Note } from "./note";

export class MidiNote extends Note {
  public static A4 = 440;
  public readonly midiNumber: number;
  public readonly octave: number;

  constructor(noteIdentifier: string | number) {
    if (typeof noteIdentifier === "string") {
      const noteLiteral = noteIdentifier.slice(0, -1);
      super(noteLiteral);

      this.octave = parseInt(noteIdentifier.slice(-1));
      this.midiNumber = (this.octave + 1) * 12 + this.pitchClass;
    } else if (typeof noteIdentifier === "number") {
      super(noteIdentifier);

      this.octave = Math.floor(noteIdentifier / 12) - 1;
      this.midiNumber = noteIdentifier;
    } else {
      throw new Error(`Invalid note identifier ${noteIdentifier}`);
    }
  }

  public get frequency(): number {
    return MidiNote.A4 * Math.pow(2, (this.midiNumber - 69) / 12);
  }

  public static getMidi(noteliteral: string | number): MidiNote {
    return new MidiNote(noteliteral);
  }
}

/**
 * Append octave to notes, starting from octave 4
 * @param notes
 * @returns notes with octave
 */
export function appendOctave(notes: string[]): string[] {
  const newNotes = [];
  let octave = 4;
  for (let i = 0; i < notes.length - 1; i++) {
    const cur = notes[i][0];
    newNotes.push(notes[i] + octave);
    const next = notes[i + 1][0];
    if (Note.getPitchClass(cur) > Note.getPitchClass(next)) {
      octave++;
    }
  }
  newNotes.push(notes[notes.length - 1] + octave);
  return newNotes;
}
