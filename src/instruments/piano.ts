import { ASDREnvelope, Instrument } from "./instrument";

export class Piano extends Instrument {
  protected envelope: ASDREnvelope = {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.3,
    release: 0.1,
  };

  protected createOscillator(frequency: number): OscillatorNode {
    return new OscillatorNode(Instrument.audioContext, {
      type: "sine",
      frequency: frequency,
    })
  }
}
