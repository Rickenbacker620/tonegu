import { Chord } from "..";
import {
  MidiNote,
  SingleNote,
  MultiNote,
  appendOctave,
  toFrequency,
} from "../core/note";

export type ASDREnvelope = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

export abstract class Instrument {
  static audioContext = new AudioContext();
  protected abstract envelope: ASDREnvelope;
  protected gainNode = Instrument.audioContext.createGain();

  /**
   * Create an oscillator for a given note
   * @param note The note to create the oscillator for
   */
  protected abstract createOscillator(frequency: number): OscillatorNode;

  constructor() {
    this.gainNode.connect(Instrument.audioContext.destination);
  }

  public playNote(
    note: SingleNote,
    velocity: number = 1,
    time: number = 1
  ): void {
    this.attack(note, velocity, time);
  }

  public playChord(
    chord: MultiNote,
    velocity: number = 1,
    time: number = 1
  ): void {
    if (typeof chord === "string") {
      chord = appendOctave(Chord.fromString(chord).notes);
    }
    chord.forEach((note) => this.attack(note, velocity / chord.length, time));
  }

  public playScale(
    scale: MultiNote,
    velocity: number = 1,
    time: number = 1
  ): void {
    if (typeof scale === "string") {
      scale = appendOctave(Chord.fromString(scale).notes);
    }
    for (let i = 0; i < scale.length; i++) {
      setTimeout(
        () => this.attack(scale[i], velocity, time),
        (time + 0.2) * 1000 * i
      );
    }
  }

  private setUpGainNode(gainValue: number, time: number): void {
    // set the gain to the value passed in
    this.gainNode.gain.value = gainValue;

    // ramp down the gain to prevent clicks
    this.gainNode.gain.linearRampToValueAtTime(
      0.001,
      Instrument.audioContext.currentTime + time - 0.1
    );

    // connect the gain node to the audio context
    this.gainNode.connect(Instrument.audioContext.destination);
  }

  private attack(
    note: SingleNote | MidiNote,
    velocity: number,
    time: number
  ): void {
    this.setUpGainNode(velocity, time);

    const oscillator = this.createOscillator(toFrequency(note));

    oscillator.connect(this.gainNode);

    oscillator.start();

    oscillator.stop(Instrument.audioContext.currentTime + time + 0.1);
  }
}
