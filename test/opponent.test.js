import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, playPoint } from '../src/game.js';
import { choosePoint, playOpponent, undoHuman } from '../src/opponent.js';
import { midSlideGame } from '../src/sample.js';

test('the opponent takes a jump when it must', () => {
  assert.equal(choosePoint(midSlideGame()), 'd3');
  const answered = playOpponent(midSlideGame());
  assert.equal(answered.points.d3, null);
  assert.equal(answered.points.b3, 'light');
  assert.equal(answered.points.c3, null);
  assert.equal(answered.turn, 'dark');
});

test('after dark slides, light answers', () => {
  const game = playOpponent(playPoint(playPoint(createGame(), 'b3'), 'c3'));
  assert.equal(game.turn, 'dark');
  assert.equal(game.points.b3, 'light');
  assert.ok(Object.values(game.points).includes('dark'));
});

test('undo takes back dark and the opponent reply', () => {
  const played = playOpponent(playPoint(playPoint(createGame(), 'b3'), 'c3'));
  const back = undoHuman(played);
  assert.equal(back.points.c3, null);
  assert.equal(back.points.b3, 'dark');
  assert.equal(back.turn, 'dark');
  assert.equal(back.selected, null);
});
