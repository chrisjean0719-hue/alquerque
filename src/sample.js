import { createGame, fromPosition, playPoint } from './game.js';

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
