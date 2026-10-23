import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, playPoint } from '../src/game.js';
import { playOpponent } from '../src/opponent.js';
import { replayTo } from '../src/replay.js';
import { chainJumpGame, jumpGame } from '../src/sample.js';

test('replay from the start is the opening array', () => {
  const played = playOpponent(playPoint(playPoint(createGame(), 'b3'), 'c3'));
  const start = replayTo(played.origin, played.plies, 0);
  assert.equal(start.points.c3, null);
  assert.equal(start.points.b3, 'dark');
  assert.equal(start.turn, 'dark');
  assert.equal(start.plies.length, 0);
});

test('replay one ply restores that slide', () => {
  const played = playOpponent(playPoint(playPoint(createGame(), 'b3'), 'c3'));
  const first = replayTo(played.origin, played.plies, 1);
  assert.equal(first.points.c3, 'dark');
  assert.equal(first.points.b3, null);
  assert.equal(first.turn, 'light');
  assert.equal(first.plies.length, 1);
  const both = replayTo(played.origin, played.plies, 2);
  assert.equal(both.turn, 'dark');
  assert.equal(both.points.b3, 'light');
  assert.equal(both.plies.length, 2);
});

test('replay of a jump fixture starts at the jump', () => {
  const jumped = playPoint(playPoint(jumpGame(), 'c2'), 'c4');
  const start = replayTo(jumped.origin, jumped.plies, 0);
  assert.equal(start.points.c2, 'dark');
  assert.equal(start.points.c3, 'light');
  assert.equal(start.points.c4, null);
  const end = replayTo(jumped.origin, jumped.plies, jumped.plies.length);
  assert.equal(end.points.c4, 'dark');
  assert.equal(end.points.c3, null);
});

test('replay of a chain is one ply', () => {
  const done = playPoint(playPoint(playPoint(chainJumpGame(), 'c1'), 'c3'), 'c5');
  const start = replayTo(done.origin, done.plies, 0);
  assert.equal(start.points.c1, 'dark');
  assert.equal(start.phase, 'slide');
  const end = replayTo(done.origin, done.plies, 1);
  assert.equal(end.points.c5, 'dark');
  assert.equal(end.points.c3, null);
  assert.equal(end.turn, 'light');
  assert.equal(end.plies.length, 1);
});
