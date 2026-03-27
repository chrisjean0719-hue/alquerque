import test from 'node:test';
import assert from 'node:assert/strict';
import { occupiedCount } from '../src/board.js';
import { GameError } from '../src/error.js';
import { createGame, fromPosition, playPoint } from '../src/game.js';
import { jumpedPoint } from '../src/points.js';
import { chainJumpGame, jumpGame } from '../src/sample.js';

test('a jump over a neighbour takes that piece', () => {
  const taken = playPoint(playPoint(jumpGame(), 'c2'), 'c4');
  assert.equal(taken.points.c2, null);
  assert.equal(taken.points.c3, null);
  assert.equal(taken.points.c4, 'dark');
  assert.equal(taken.turn, 'light');
  assert.equal(occupiedCount(taken.points, 'dark'), 12);
  assert.equal(occupiedCount(taken.points, 'light'), 11);
});

test('a jump keeps the turn when another take is open', () => {
  const taken = playPoint(playPoint(chainJumpGame(), 'c1'), 'c3');
  assert.equal(taken.points.c3, 'dark');
  assert.equal(taken.points.c2, null);
  assert.equal(taken.points.c4, 'light');
  assert.equal(taken.turn, 'dark');
  assert.equal(taken.selected, 'c3');
  assert.equal(taken.phase, 'jump');
});

test('a jump must land on the empty point beyond an opponent', () => {
  const selected = playPoint(fromPosition({ points: { c3: 'light', c4: null, e5: null } }), 'c2');
  assert.throws(() => playPoint(selected, 'e5'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'point: that is not a jump');
    return true;
  });
});

test('a jump cannot take your own piece', () => {
  assert.equal(jumpedPoint('c1', 'c3'), 'c2');
  const selected = playPoint(createGame(), 'c1');
  assert.throws(() => playPoint(selected, 'c3'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'point: jump an opponent piece');
    return true;
  });
});
