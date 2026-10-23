import { hasLegalMove, jumpLandings, occupant, occupiedCount, startingPoints } from './board.js';
import { GameError } from './error.js';
import { copyPlies, copyPosition, plyNotation } from './moves.js';
import { jumpedPoint, neighbours } from './points.js';
import { validateJump, validateSelect, validateSlide } from './validate.js';

export const DARK = 'dark';
export const LIGHT = 'light';

export function createGame() {
  const game = {
    turn: DARK,
    phase: 'slide',
    points: startingPoints(),
    selected: null,
    winner: null,
    past: [],
    plies: [],
    origin: null,
  };
  game.origin = originOf(game);
  return game;
}

export function fromPosition(partial) {
  const base = createGame();
  const game = {
    ...base,
    ...partial,
    points: { ...base.points, ...(partial.points ?? {}) },
    selected: partial.selected ?? null,
    winner: partial.winner ?? null,
    past: partial.past ?? [],
    plies: copyPlies(partial.plies ?? []),
    origin: partial.origin ? copyPosition(partial.origin) : null,
  };
  const settled = settle(game);
  settled.origin = partial.origin ? copyPosition(partial.origin) : originOf(settled);
  return settled;
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
  return remember(game, next);
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
  const withPly = pushPly(next, 'slide', [fromId, toId]);
  withPly.turn = other(game.turn);
  return remember(game, stampAfter(settle(withPly)));
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
  const withPly =
    game.phase === 'jump' ? amendPly(next, toId) : pushPly(next, 'jump', [fromId, toId]);
  if (jumpLandings(withPly.points, toId).length > 0) {
    withPly.selected = toId;
    withPly.phase = 'jump';
    return remember(game, stampAfter(settle(withPly)));
  }
  withPly.selected = null;
  withPly.phase = 'slide';
  withPly.turn = other(game.turn);
  return remember(game, stampAfter(settle(withPly)));
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
  return remember(game, next);
}

export function canUndo(game) {
  return (game.past ?? []).length > 0;
}

export function undo(game) {
  const past = game.past ?? [];
  if (past.length === 0) {
    throw new GameError(['past: no ply to undo']);
  }
  const prev = past[past.length - 1];
  return {
    ...cloneGame(prev),
    origin: copyPosition(game.origin),
    past: past.slice(0, -1),
  };
}

function snapshot(game) {
  return {
    turn: game.turn,
    phase: game.phase,
    points: { ...game.points },
    selected: game.selected ?? null,
    winner: game.winner ?? null,
    past: [],
    plies: copyPlies(game.plies),
  };
}

function originOf(game) {
  return copyPosition({
    turn: game.turn,
    phase: game.phase,
    points: game.points,
    selected: game.selected ?? null,
    winner: game.winner ?? null,
  });
}

function stampAfter(game) {
  const plies = game.plies ?? [];
  if (plies.length === 0) return game;
  const next = cloneGame(game);
  const last = next.plies[next.plies.length - 1];
  next.plies = [...next.plies.slice(0, -1), { ...last, after: originOf(next) }];
  return next;
}

function pushPly(game, kind, clicks) {
  const next = cloneGame(game);
  next.plies = [
    ...(game.plies ?? []),
    {
      colour: game.turn,
      kind,
      clicks: [...clicks],
      notation: plyNotation(kind, clicks),
    },
  ];
  return next;
}

function amendPly(game, pointId) {
  const plies = game.plies ?? [];
  const last = plies[plies.length - 1];
  if (!last) return game;
  const clicks = [...last.clicks, pointId];
  const next = cloneGame(game);
  next.plies = [
    ...plies.slice(0, -1),
    {
      ...last,
      clicks,
      notation: plyNotation(last.kind, clicks),
    },
  ];
  return next;
}

function remember(previous, next) {
  const out = cloneGame(next);
  out.past = [...(previous.past ?? []), snapshot(previous)];
  return out;
}

export function cloneGame(game) {
  return {
    turn: game.turn,
    phase: game.phase,
    points: { ...game.points },
    selected: game.selected ?? null,
    winner: game.winner ?? null,
    past: game.past ?? [],
    plies: copyPlies(game.plies),
    origin: copyPosition(game.origin),
  };
}
