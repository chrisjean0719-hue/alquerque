import test from 'node:test';
import assert from 'node:assert/strict';
import { occupiedCount } from '../src/board.js';
import { GameError } from '../src/error.js';
import { playPoint } from '../src/game.js';
import { chainJumpGame } from '../src/sample.js';

test('a second jump finishes the chain', () => {
  const mid = playPoint(playPoint(chainJumpGame(), 'c1'), 'c3');
  const done = playPoint(mid, 'c5');
  assert.equal(done.points.c5, 'dark');
  assert.equal(done.points.c3, null);
  assert.equal(done.points.c4, null);
  assert.equal(done.turn, 'light');
  assert.equal(done.selected, null);
  assert.equal(done.phase, 'slide');
  assert.equal(occupiedCount(done.points, 'light'), 10);
});

test('clicking the chaining piece ends the take', () => {
  const mid = playPoint(playPoint(chainJumpGame(), 'c1'), 'c3');
  const stopped = playPoint(mid, 'c3');
  assert.equal(stopped.turn, 'light');
  assert.equal(stopped.phase, 'slide');
  assert.equal(stopped.selected, null);
  assert.equal(stopped.points.c4, 'light');
});

test('another piece cannot move during a chain', () => {
  const mid = playPoint(playPoint(chainJumpGame(), 'c1'), 'c3');
  assert.throws(() => playPoint(mid, 'a1'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'phase: finish the jump');
    return true;
  });
});
