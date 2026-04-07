import test from 'node:test';
import assert from 'node:assert/strict';
import { GameError } from '../src/error.js';
import { playPoint } from '../src/game.js';
import { blockedGame, winGame } from '../src/sample.js';

test('taking a colour down to no pieces wins', () => {
  const over = playPoint(playPoint(winGame(), 'c2'), 'c4');
  assert.equal(over.winner, 'dark');
  assert.equal(over.phase, 'over');
  assert.equal(over.points.c4, 'dark');
  assert.equal(over.points.c3, null);
});

test('a colour with no legal move loses', () => {
  const over = blockedGame();
  assert.equal(over.winner, 'light');
  assert.equal(over.phase, 'over');
  assert.equal(over.turn, 'dark');
});

test('a finished game rejects a further place', () => {
  const over = playPoint(playPoint(winGame(), 'c2'), 'c4');
  assert.throws(() => playPoint(over, 'c2'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'phase: the game is over');
    return true;
  });
});
