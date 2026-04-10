import test from 'node:test';
import assert from 'node:assert/strict';
import { legalPoints } from '../src/hints.js';
import { createGame, playPoint } from '../src/game.js';
import { blockedGame, chainJumpGame, jumpGame, winGame } from '../src/sample.js';

test('the opening hints dark pieces that can slide to the centre', () => {
  const hints = legalPoints(createGame());
  assert.deepEqual(hints.toSorted(), ['b2', 'b3', 'c2', 'd2']);
});

test('a selected slide hints the empty neighbour only', () => {
  const hints = legalPoints(playPoint(createGame(), 'b3'));
  assert.deepEqual(hints, ['c3']);
});

test('an open jump hints only the jumping piece', () => {
  const hints = legalPoints(jumpGame());
  assert.deepEqual(hints, ['c2']);
});

test('a selected jump hints the landing', () => {
  const hints = legalPoints(playPoint(jumpGame(), 'c2'));
  assert.deepEqual(hints, ['c4']);
});

test('a chain hints the next landing', () => {
  const hints = legalPoints(playPoint(playPoint(chainJumpGame(), 'c1'), 'c3'));
  assert.deepEqual(hints, ['c5']);
});

test('a finished board has no hints', () => {
  assert.deepEqual(legalPoints(playPoint(playPoint(winGame(), 'c2'), 'c4')), []);
  assert.deepEqual(legalPoints(blockedGame()), []);
});
