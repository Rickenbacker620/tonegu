const BASE_NOTE_REGEX = "[A-G]";

const DEGREE_REGEX = "[1-9]|1[0-5]";

const ACCIDENTAL_REGEX = "(?:##|bb|#|b)";

const NOTE_REGEX = `${BASE_NOTE_REGEX}${ACCIDENTAL_REGEX}?`;

export function parseChord(chordLiteral: string) {
  const REGEX = `^(${NOTE_REGEX})(.*?)(?:/(${NOTE_REGEX}))?$`;

  const matches = chordLiteral.match(new RegExp(REGEX));
  if (!matches) {
    throw new Error(`Invalid chord literal: ${chordLiteral}`);
  }

  const result = [matches[1], matches[2], matches[3]];

  return result;
}

export function parseNote(noteLiteral: string) {
  const REGEX = `^(${BASE_NOTE_REGEX})(${ACCIDENTAL_REGEX})?$`;

  const matches = noteLiteral.match(new RegExp(REGEX));
  if (!matches) {
    throw new Error(`Invalid note literal: ${noteLiteral}`);
  }

  const result = [matches[1], matches[2]];

  return result;
}

export function parseDegree(degreeLiteral: string) {
  const REGEX = `^(${ACCIDENTAL_REGEX})?(${DEGREE_REGEX})$`;

  const matches = degreeLiteral.match(new RegExp(REGEX));
  if (!matches) {
    throw new Error(`Invalid degree literal: ${degreeLiteral}`);
  }

  const result = [matches[1], matches[2]];

  return result;
}