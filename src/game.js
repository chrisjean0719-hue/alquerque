import { hasLegalMove, jumpLandings, occupant, occupiedCount, startingPoints } from './board.js';
import { GameError } from './error.js';
import { jumpedPoint, neighbours } from './points.js';
import { validateJump, validateSelect, validateSlide } from './validate.js';

export const DARK = 'dark';
export const LIGHT = 'light';

export function createGame() {
  return {
    turn: DARK,
    phase: 'slide',
    points: startingPoints(),
    selected: null,
    winner: null,
  };
}

export function fromPosition(partial) {
  const base = createGame();
  return settle({
    ...base,
    ...partial,
    points: { ...base.points, ...(partial.points ?? {}) },
    selected: partial.selected ?? null,
    winner: partial.winner ?? null,
  });
}

export function other(colour) {
  return colour === DARK ? LIGHT : DARK;
}

export function playPoint(game, pointId) {
  if (game.winner || game.phase === 'over') {
    throw new GameError(['phase: the game is over']);
  }
  if (game.phase === 'jump') {
    if (pointId === game.selected || occupant(game.points, pointId) === game.turn) {
      throw new GameError(['phase: finish the jump']);
    }
    return jumpPiece(game, game.selected, pointId);
  }
  const occ = occupant(game.points, pointId);
  if (game.selected === null || occ === game.turn) {
    if (game.selected === pointId) {
      return deselect(game);
    }
    return selectPiece(game, pointId);
  }
  if (neighbours(game.selected).includes(pointId)) {
    return slidePiece(game, game.selected, pointId);
  }
  return jumpPiece(game, game.selected, pointId);
}

export function selectPiece(game, pointId) {
  const errors = validateSelect(game, pointId);
  if (errors.length > 0) {
    throw new GameError(errors);
  }
  const next = cloneGame(game);
  next.selected = pointId;
  return next;
}

export function slidePiece(game, fromId, toId) {
  const errors = validateSlide(game, fromId, toId);
  if (errors.length > 0) {
    throw new GameError(errors);
  }
  const next = cloneGame(game);
  next.points[fromId] = null;
  next.points[toId] = game.turn;
  next.selected = null;
  next.turn = other(game.turn);
  return settle(next);
}

export function jumpPiece(game, fromId, toId) {
  const errors = validateJump(game, fromId, toId);
  if (errors.length > 0) {
    throw new GameError(errors);
  }
  const overId = jumpedPoint(fromId, toId);
  const next = cloneGame(game);
  next.points[fromId] = null;
  next.points[overId] = null;
  next.points[toId] = game.turn;
  if (jumpLandings(next.points, toId).length > 0) {
    next.selected = toId;
    next.phase = 'jump';
    return settle(next);
  }
  next.selected = null;
  next.phase = 'slide';
  next.turn = other(game.turn);
  return settle(next);
}

function settle(game) {
  const next = cloneGame(game);
  if (occupiedCount(next.points, DARK) === 0) {
    next.winner = LIGHT;
    next.phase = 'over';
    next.selected = null;
    return next;
  }
  if (occupiedCount(next.points, LIGHT) === 0) {
    next.winner = DARK;
    next.phase = 'over';
    next.selected = null;
    return next;
  }
  if (next.winner || next.phase === 'over' || next.phase === 'jump') {
    return next;
  }
  if (!hasLegalMove(next.points, next.turn)) {
    next.winner = other(next.turn);
    next.phase = 'over';
    next.selected = null;
  }
  return next;
}

function deselect(game) {
  const next = cloneGame(game);
  next.selected = null;
  if (game.phase === 'jump') {
    next.phase = 'slide';
    next.turn = other(game.turn);
  }
  return next;
}

export function cloneGame(game) {
  return {
    turn: game.turn,
    phase: game.phase,
    points: { ...game.points },
    selected: game.selected ?? null,
    winner: game.winner ?? null,
  };
}
