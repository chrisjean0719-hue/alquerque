import test from 'node:test';
import assert from 'node:assert/strict';
import { POINTS, beyond, hasDiagonal, neighbours } from '../src/points.js';

test('the board has 25 points', () => {
  assert.equal(POINTS.length, 25);
  assert.equal(new Set(POINTS).size, 25);
});

test('the centre has eight neighbours', () => {
  assert.deepEqual(neighbours('c3').toSorted(), ['b2', 'b3', 'b4', 'c2', 'c4', 'd2', 'd3', 'd4']);
});

test('a corner with diagonals has three neighbours', () => {
  assert.equal(hasDiagonal('a1'), true);
  assert.deepEqual(neighbours('a1').toSorted(), ['a2', 'b1', 'b2']);
});

test('every point has at least two neighbours', () => {
  for (const id of POINTS) {
    assert.ok(neighbours(id).length >= 2, id);
  }
});

test('the point beyond a neighbour continues the line', () => {
  assert.equal(beyond('c2', 'c3'), 'c4');
  assert.equal(beyond('a1', 'b2'), 'c3');
  assert.equal(beyond('c2', 'c1'), null);
});
