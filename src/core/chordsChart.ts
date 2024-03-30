export const chordChart: {
  name: string;
  pitchClasses: number[];
  intervals: number[];
  notations: string[];
}[] = [
  {
    "name": "fifth",
    "pitchClasses": [0, 7],
    "intervals": [1, 7],
    "notations": ["5"],
  },

  // Triads
  {
    "name": "major triad",
    "pitchClasses": [0, 4, 7],
    "intervals": [1, 3, 5],
    "notations": ["maj", "M", ""],
  },
  {
    "name": "minor triad",
    "pitchClasses": [0, 3, 7],
    "intervals": [1, 3, 5],
    "notations": ["min", "m", "-"],
  },
  {
    "name": "diminished traid",
    "pitchClasses": [0, 3, 6],
    "intervals": [1, 3, 5],
    "notations": ["dim"],
  },
  {
    "name": "augmented traid",
    "pitchClasses": [0, 4, 8],
    "intervals": [1, 3, 5],
    "notations": ["aug"],
  },
  {
    "name": "suspended second",
    "pitchClasses": [0, 2, 7],
    "intervals": [1, 2, 5],
    "notations": ["sus2"],
  },
  {
    "name": "suspended fourth",
    "pitchClasses": [0, 5, 7],
    "intervals": [1, 4, 5],
    "notations": ["sus4", "sus"],
  },

  // Sevenths
  {
    "name": "dominant seventh",
    "pitchClasses": [0, 4, 7, 10],
    "intervals": [1, 3, 5, 7],
    "notations": ["7", "dom7"],
  },
  {
    "name": "major seventh",
    "pitchClasses": [0, 4, 7, 11],
    "intervals": [1, 3, 5, 7],
    "notations": ["maj7", "M7"],
  },
  {
    "name": "minor-major seventh",
    "pitchClasses": [0, 3, 7, 11],
    "intervals": [1, 3, 5, 7],
    "notations": ["minmaj7", "mM7", "mmaj7"],
  },
  {
    "name": "augmented-major seventh",
    "pitchClasses": [0, 4, 8, 11],
    "intervals": [1, 3, 5, 7],
    "notations": ["maj7#5", "maj7+5", "maj7aug", "M7+5"],
  },
  {
    "name": "augmented seventh",
    "pitchClasses": [0, 4, 8, 10],
    "intervals": [1, 3, 5, 7],
    "notations": ["7#5", "7+5", "7aug"],
  },
  {
    "name": "half-diminished seventh",
    "pitchClasses": [0, 3, 6, 10],
    "intervals": [1, 3, 5, 7],
    "notations": ["m7b5", "min7b5", "m7(b5)"],
  },
  {
    "name": "diminished seventh",
    "pitchClasses": [0, 3, 6, 9],
    "intervals": [1, 3, 5, 7],
    "notations": ["dim7"],
  },
  {
    "name": "dominant seventh flat five",
    "pitchClasses": [0, 4, 6, 10],
    "intervals": [1, 3, 5, 7],
    "notations": ["7b5", "7-5"],
  },

  // Ninths
  {
    "name": "dominant ninth",
    "pitchClasses": [0, 4, 7, 10, 14],
    "intervals": [1, 3, 5, 7, 9],
    "notations": ["9", "dom9"],
  },
  {
    "name": "dominant minor ninth",
    "pitchClasses": [0, 3, 7, 10, 14],
    "intervals": [1, 3, 5, 7, 9],
    "notations": ["m9", "min9"],
  },
];
