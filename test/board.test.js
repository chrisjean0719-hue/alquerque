import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyCount, occupiedCount, startingPoints } from '../src/board.js';

test('the starting array leaves the centre empty', () => {
  const points = startingPoints();
  assert.equal(points.c3, null);
  assert.equal(emptyCount(points), 1);
  assert.equal(occupiedCount(points, 'dark'), 12);
  assert.equal(occupiedCount(points, 'light'), 12);
});

test('dark holds the near ranks and a3 b3', () => {
  const points = startingPoints();
  assert.equal(points.a1, 'dark');
  assert.equal(points.e2, 'dark');
  assert.equal(points.a3, 'dark');
  assert.equal(points.b3, 'dark');
  assert.equal(points.d3, 'light');
  assert.equal(points.e5, 'light');
});
