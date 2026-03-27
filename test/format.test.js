import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBoard, formatStatus } from '../src/format.js';
import { createGame, playPoint } from '../src/game.js';
import { chainJumpGame, jumpGame, midSlideGame } from '../src/sample.js';

test('an opening asks dark to slide', () => {
  assert.equal(formatStatus(createGame()), 'Dark to slide');
  assert.match(formatBoard(createGame()), /dark: 12 on the board/);
});

test('a selected piece names the from point', () => {
  assert.equal(formatStatus(playPoint(createGame(), 'b3')), 'Dark to slide from b3');
});

test('the sample mid-slide asks light to slide', () => {
  assert.equal(formatStatus(midSlideGame()), 'Light to slide');
});

test('a take leaves eleven light pieces', () => {
  const taken = playPoint(playPoint(jumpGame(), 'c2'), 'c4');
  assert.equal(formatStatus(taken), 'Light to slide');
  assert.match(formatBoard(taken), /light: 11 on the board/);
});

test('a chain asks dark to jump from the landing', () => {
  const mid = playPoint(playPoint(chainJumpGame(), 'c1'), 'c3');
  assert.equal(formatStatus(mid), 'Dark to jump from c3');
});
