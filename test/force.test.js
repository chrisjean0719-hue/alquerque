import test from 'node:test';
import assert from 'node:assert/strict';
import { GameError } from '../src/error.js';
import { playPoint } from '../src/game.js';
import { forceGame, jumpGame } from '../src/sample.js';

test('a slide is refused when a jump is open', () => {
  assert.throws(() => playPoint(forceGame(), 'b2'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'point: choose a piece that can jump');
    return true;
  });
  const taken = playPoint(playPoint(forceGame(), 'c2'), 'c4');
  assert.equal(taken.points.c4, 'dark');
  assert.equal(taken.points.c3, null);
});

test('only a jumping piece can be chosen', () => {
  assert.throws(() => playPoint(jumpGame(), 'a1'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'point: choose a piece that can jump');
    return true;
  });
});
