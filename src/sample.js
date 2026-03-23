import { createGame, playPoint } from './game.js';

export function sampleGame() {
  return createGame();
}

export function midSlideGame() {
  return playPoint(playPoint(createGame(), 'b3'), 'c3');
}
