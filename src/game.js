import { occupant, startingPoints } from './board.js';
import { GameError } from './error.js';
import { validateSelect, validateSlide } from './validate.js';

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
  return {
    ...base,
    ...partial,
    points: { ...base.points, ...(partial.points ?? {}) },
    selected: partial.selected ?? null,
    winner: partial.winner ?? null,
  };
}

export function other(colour) {
  return colour === DARK ? LIGHT : DARK;
}

export function playPoint(game, pointId) {
  if (game.winner || game.phase === 'over') {
    throw new GameError(['phase: the game is over']);
  }
  const occ = occupant(game.points, pointId);
  if (game.selected === null || occ === game.turn) {
    if (game.selected === pointId) {
      return deselect(game);
    }
    return selectPiece(game, pointId);
  }
  return slidePiece(game, game.selected, pointId);
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
  return next;
}

function deselect(game) {
  const next = cloneGame(game);
  next.selected = null;
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
