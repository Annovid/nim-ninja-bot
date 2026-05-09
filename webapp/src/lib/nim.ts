export type Position = number[];

export type Move = { row: number; count: number };

export const xorAll = (pos: Position): number => pos.reduce((acc, n) => acc ^ n, 0);

export const isTerminal = (pos: Position): boolean => pos.every((n) => n === 0);

export const validateMove = (pos: Position, move: Move): boolean => {
  if (!Number.isInteger(move.row) || !Number.isInteger(move.count)) return false;
  if (move.row < 0 || move.row >= pos.length) return false;
  if (move.count < 1 || move.count > pos[move.row]) return false;
  return true;
};

export const applyMove = (pos: Position, move: Move): Position => {
  const next = pos.slice();
  next[move.row] -= move.count;
  return next;
};

const randInt = (max: number) => Math.floor(Math.random() * max);

export const computeBotMove = (pos: Position): Move => {
  const xor = xorAll(pos);

  if (xor === 0) {
    const nonEmpty: number[] = [];
    pos.forEach((n, i) => { if (n > 0) nonEmpty.push(i); });
    const row = nonEmpty[randInt(nonEmpty.length)];
    const count = 1 + randInt(pos[row]);
    return { row, count };
  }

  for (let row = 0; row < pos.length; row++) {
    for (let count = 1; count <= pos[row]; count++) {
      const trial = pos.slice();
      trial[row] -= count;
      if (xorAll(trial) === 0) return { row, count };
    }
  }

  // Unreachable for non-terminal positions when xor !== 0.
  throw new Error("computeBotMove: no winning move found in non-terminal position");
};
