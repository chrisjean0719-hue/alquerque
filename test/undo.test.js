import test from 'node:test';
import assert from 'node:assert/strict';
import { GameError } from '../src/error.js';
import { canUndo, createGame, playPoint, undo } from '../src/game.js';
import { chainJumpGame, jumpGame, winGame } from '../src/sample.js';

test('undo takes back a slide', () => {
  const moved = playPoint(playPoint(createGame(), 'b3'), 'c3');
  assert.equal(moved.points.c3, 'dark');
  const unmoved = undo(moved);
  assert.equal(unmoved.points.b3, 'dark');
  assert.equal(unmoved.points.c3, null);
  assert.equal(unmoved.selected, 'b3');
  const unselected = undo(unmoved);
  assert.equal(unselected.selected, null);
  assert.equal(unselected.turn, 'dark');
  assert.equal(canUndo(unselected), false);
});

test('undo takes back a jump', () => {
  const taken = playPoint(playPoint(jumpGame(), 'c2'), 'c4');
  assert.equal(taken.points.c3, null);
  const back = undo(taken);
  assert.equal(back.points.c2, 'dark');
  assert.equal(back.points.c3, 'light');
  assert.equal(back.points.c4, null);
  assert.equal(back.selected, 'c2');
  assert.equal(back.turn, 'dark');
});

test('undo takes back one jump of a chain', () => {
  const mid = playPoint(playPoint(chainJumpGame(), 'c1'), 'c3');
  assert.equal(mid.phase, 'jump');
  const back = undo(mid);
  assert.equal(back.points.c1, 'dark');
  assert.equal(back.points.c2, 'light');
  assert.equal(back.selected, 'c1');
  assert.equal(back.turn, 'dark');
});

test('undo takes back a winning take', () => {
  const over = playPoint(playPoint(winGame(), 'c2'), 'c4');
  assert.equal(over.winner, 'dark');
  const back = undo(over);
  assert.equal(back.winner, null);
  assert.equal(back.points.c3, 'light');
  assert.equal(back.turn, 'dark');
});

test('an opening has no ply to undo', () => {
  assert.equal(canUndo(createGame()), false);
  assert.throws(() => undo(createGame()), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'past: no ply to undo');
    return true;
  });
});
