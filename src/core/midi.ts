import { Accidental, Octave, Pitch } from "./note";

let A4 = 440;

/**
 * Set the frequency of A4
 * @param frequency set the frequency of A4
 */
export function setA4(frequency: number): void {
  A4 = frequency;
}

/**
 * Return the frequency of A4
 * @returns A4 frequency
 */
export function getA4(): number {
  return A4;
}

/**
 * Convert a note string or midi number to frequency
 * @param arg note string or midi number to be converted to frequency
 * @returns frequency of the note
 */
export function toFrequency(arg: number | string): number {
  if (typeof arg === "string") {
    arg = toMidi(arg);
  }

  return A4 * Math.pow(2, (arg - 69) / 12);
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
    if (Pitch[cur as keyof typeof Pitch] > Pitch[next as keyof typeof Pitch]) {
      octave++;
    }
  }
  newNotes.push(notes[notes.length - 1] + octave);
  return newNotes;
}

/**
 * Convert a note string to midi number
 * @param str note string
 * @returns midi number
 */
export function toMidi(str: string): number {
  const matches = str.match(/^([A-G])(b|bb|#|##)?(\d)$/);

  if (!matches) {
    throw new Error("Invalid note");
  }

  const pitch = Pitch[matches[1] as keyof typeof Pitch];
  const accidental = Accidental[matches[2] as keyof typeof Accidental] ?? 0;
  const octave = Number.parseInt(matches[3]) as Octave;

  return (octave + 1) * 12 + pitch + accidental;
}