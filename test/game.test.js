import test from 'node:test';
import assert from 'node:assert/strict';
import { GameError } from '../src/error.js';
import { createGame, fromPosition, playPoint } from '../src/game.js';
import { midSlideGame, sampleGame } from '../src/sample.js';

test('dark slides first from the starting array', () => {
  const game = sampleGame();
  assert.equal(game.turn, 'dark');
  assert.equal(game.phase, 'slide');
  assert.equal(game.points.c3, null);
  assert.equal(game.selected, null);
});

test('a slide moves a piece to an empty neighbour', () => {
  const selected = playPoint(createGame(), 'b3');
  assert.equal(selected.selected, 'b3');
  const moved = playPoint(selected, 'c3');
  assert.equal(moved.points.b3, null);
  assert.equal(moved.points.c3, 'dark');
  assert.equal(moved.turn, 'light');
  assert.equal(moved.selected, null);
});

test('the sample mid-slide leaves light to move', () => {
  const game = midSlideGame();
  assert.equal(game.points.c3, 'dark');
  assert.equal(game.points.b3, null);
  assert.equal(game.turn, 'light');
});

test('an occupied point rejects a slide', () => {
  const selected = playPoint(createGame(), 'b3');
  assert.throws(() => playPoint(selected, 'b4'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'point: that point is taken');
    return true;
  });
});

test('a slide must follow a board line', () => {
  const selected = playPoint(fromPosition({ points: { e5: null } }), 'a1');
  assert.throws(() => playPoint(selected, 'e5'), (err) => {
    assert.ok(err instanceof GameError);
    assert.equal(err.errors[0], 'point: that is not a jump');
    return true;
  });
});

test('clicking the selected piece again clears the choice', () => {
  const selected = playPoint(createGame(), 'b3');
  const cleared = playPoint(selected, 'b3');
  assert.equal(cleared.selected, null);
  assert.equal(cleared.points.b3, 'dark');
  assert.equal(cleared.turn, 'dark');
});
