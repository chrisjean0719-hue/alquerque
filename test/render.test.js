import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, playPoint } from '../src/game.js';
import { renderBoard } from '../src/render.js';
import { jumpGame, midSlideGame } from '../src/sample.js';

test('the starting board draws 25 points', () => {
  const svg = renderBoard(createGame());
  assert.equal([...svg.matchAll(/data-point="/g)].length, 25);
  assert.match(svg, /Slide from b3/);
  assert.match(svg, /Empty c3/);
});

test('a selected slide names the empty neighbour', () => {
  const svg = renderBoard(playPoint(createGame(), 'b3'));
  assert.match(svg, /Slide to c3/);
});

test('the mid-slide draws dark on c3', () => {
  const svg = renderBoard(midSlideGame());
  assert.match(svg, /Dark on c3/);
  assert.match(svg, /Slide from d3/);
});

test('a selected jump names the landing', () => {
  const svg = renderBoard(playPoint(jumpGame(), 'c2'));
  assert.match(svg, /Jump to c4/);
});
