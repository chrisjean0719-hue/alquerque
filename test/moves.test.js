import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, playPoint, undo } from '../src/game.js';
import { formatMoveList, renderMoveList } from '../src/moves.js';
import { playOpponent, undoHuman } from '../src/opponent.js';
import { chainJumpGame, jumpGame } from '../src/sample.js';

test('a slide is listed from-to', () => {
  const game = playPoint(playPoint(createGame(), 'b3'), 'c3');
  assert.equal(game.plies.length, 1);
  assert.equal(game.plies[0].notation, 'b3-c3');
  assert.equal(game.plies[0].colour, 'dark');
  assert.equal(game.plies[0].kind, 'slide');
  assert.equal(formatMoveList(game.plies), '1. b3-c3');
});

test('a jump is listed from-landing', () => {
  const taken = playPoint(playPoint(jumpGame(), 'c2'), 'c4');
  const last = taken.plies[taken.plies.length - 1];
  assert.equal(last.notation, 'c2xc4');
  assert.equal(last.kind, 'jump');
  assert.equal(last.colour, 'dark');
});

test('a chain is one ply', () => {
  const mid = playPoint(playPoint(chainJumpGame(), 'c1'), 'c3');
  assert.equal(mid.plies[mid.plies.length - 1].notation, 'c1xc3');
  const done = playPoint(mid, 'c5');
  const last = done.plies[done.plies.length - 1];
  assert.equal(last.notation, 'c1xc3xc5');
  assert.equal(last.kind, 'jump');
  assert.equal(done.plies.filter((ply) => ply.colour === 'dark').length, 1);
});

test('after dark slides, light is listed too', () => {
  const game = playOpponent(playPoint(playPoint(createGame(), 'b3'), 'c3'));
  assert.equal(game.plies.length, 2);
  assert.equal(game.plies[0].notation, 'b3-c3');
  assert.equal(game.plies[1].colour, 'light');
  assert.equal(game.plies[1].notation, 'd3xb3');
  assert.equal(formatMoveList(game.plies), '1. b3-c3 d3xb3');
});

test('undo drops the listed ply', () => {
  const moved = playPoint(playPoint(createGame(), 'b3'), 'c3');
  const back = undo(undo(moved));
  assert.equal(back.plies.length, 0);
  const played = playOpponent(moved);
  const restored = undoHuman(played);
  assert.equal(restored.plies.length, 0);
});

test('selecting a piece is not a ply', () => {
  const selected = playPoint(createGame(), 'b3');
  assert.equal(selected.plies.length, 0);
  assert.equal(renderMoveList(selected.plies), '<ol class="moves"></ol>');
});

test('the page lists paired plies', () => {
  const html = renderMoveList([
    { colour: 'dark', kind: 'slide', notation: 'b3-c3', clicks: ['b3', 'c3'] },
    { colour: 'light', kind: 'jump', notation: 'd3xb3', clicks: ['d3', 'b3'] },
  ]);
  assert.match(html, /1\. b3-c3/);
  assert.match(html, /d3xb3/);
});
