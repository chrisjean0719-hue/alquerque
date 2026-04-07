import { emptyPoints } from './board.js';
import { createGame, fromPosition, playPoint } from './game.js';

function sparse(filled) {
  return { ...emptyPoints(), ...filled };
}

export function sampleGame() {
  return createGame();
}

export function midSlideGame() {
  return playPoint(playPoint(createGame(), 'b3'), 'c3');
}

export function jumpGame() {
  return fromPosition({
    points: { c3: 'light', c4: null },
  });
}

export function chainJumpGame() {
  return fromPosition({
    turn: 'dark',
    points: {
      c1: 'dark',
      c2: 'light',
      c3: null,
      c4: 'light',
      c5: null,
    },
  });
}

export function forceGame() {
  return fromPosition({
    points: { c3: 'light', c4: null, b3: null },
  });
}

export function winGame() {
  return fromPosition({
    points: sparse({ c2: 'dark', c3: 'light' }),
  });
}

export function blockedGame() {
  return fromPosition({
    turn: 'dark',
    points: sparse({
      a1: 'dark',
      a2: 'light',
      b1: 'light',
      b2: 'light',
      a3: 'light',
      c1: 'light',
      c3: 'light',
    }),
  });
}
