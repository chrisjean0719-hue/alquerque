import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBoard, formatStatus } from '../src/format.js';
import { createGame, playPoint } from '../src/game.js';
import { midSlideGame } from '../src/sample.js';

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
