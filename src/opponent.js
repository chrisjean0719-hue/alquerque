import { canUndo, playPoint, undo } from './game.js';
import { legalPoints } from './hints.js';
import { jumpLandings } from './board.js';
import { POINTS } from './points.js';

export const OPPONENT = 'light';
export const HUMAN = 'dark';

export function choosePoint(game) {
  const legal = legalPoints(game);
  if (legal.length === 0) return null;
  return (
    legal.find((id) => continuesJump(game, id)) ??
    legal.find((id) => blocksJump(game, id)) ??
    legal[0]
  );
}

export function playOpponent(game) {
  let next = game;
  let guard = 0;
  while (next.turn === OPPONENT && !next.winner && next.phase !== 'over' && guard < 16) {
    const id = choosePoint(next);
    if (!id) break;
    next = playPoint(next, id);
    guard += 1;
  }
  return next;
}

export function undoHuman(game) {
  if (!canUndo(game)) {
    return undo(game);
  }
  let next = undo(game);
  while (canUndo(next) && (next.turn !== HUMAN || next.selected)) {
    next = undo(next);
  }
  return next;
}

function tryPlay(game, id) {
  try {
    return playPoint(game, id);
  } catch {
    return null;
  }
}

function continuesJump(game, id) {
  const next = tryPlay(game, id);
  if (!next) return false;
  if (next.phase === 'jump' && next.turn === game.turn) return true;
  if (!game.selected && next.selected === id) {
    return legalPoints(next).some((to) => continuesJump(next, to));
  }
  return false;
}

function blocksJump(game, id) {
  if (!game.selected && game.phase !== 'jump' && game.points[id] === game.turn) {
    const next = tryPlay(game, id);
    return next ? legalPoints(next).some((to) => blocksJump(next, to)) : false;
  }
  if (game.points[id] !== null) return false;
  return POINTS.some(
    (from) => game.points[from] === HUMAN && jumpLandings(game.points, from).includes(id),
  );
}
