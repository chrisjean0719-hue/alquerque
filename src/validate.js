import { occupant } from './board.js';
import { isPoint, jumpedPoint, neighbours } from './points.js';

export function validateSelect(game, pointId) {
  const errors = [];
  if (game === null || typeof game !== 'object' || Array.isArray(game)) {
    return ['game: Game must be an object'];
  }
  if (game.winner || game.phase === 'over') {
    errors.push('phase: the game is over');
  }
  if (game.phase !== 'slide') {
    errors.push('phase: it is not time to slide');
  }
  if (!isPoint(pointId)) {
    errors.push('point: point must be a board point');
    return errors;
  }
  if (occupant(game.points, pointId) !== game.turn) {
    errors.push('point: choose your piece');
  }
  return errors;
}

export function validateSlide(game, fromId, toId) {
  const errors = [];
  if (game === null || typeof game !== 'object' || Array.isArray(game)) {
    return ['game: Game must be an object'];
  }
  if (game.winner || game.phase === 'over') {
    errors.push('phase: the game is over');
  }
  if (game.phase !== 'slide') {
    errors.push('phase: it is not time to slide');
  }
  if (!isPoint(fromId) || !isPoint(toId)) {
    errors.push('point: point must be a board point');
    return errors;
  }
  if (occupant(game.points, fromId) !== game.turn) {
    errors.push('point: choose your piece');
    return errors;
  }
  if (occupant(game.points, toId) !== null) {
    errors.push('point: that point is taken');
    return errors;
  }
  if (!neighbours(fromId).includes(toId)) {
    errors.push('point: that point is not a neighbour');
  }
  return errors;
}

export function validateJump(game, fromId, toId) {
  const errors = [];
  if (game === null || typeof game !== 'object' || Array.isArray(game)) {
    return ['game: Game must be an object'];
  }
  if (game.winner || game.phase === 'over') {
    errors.push('phase: the game is over');
  }
  if (game.phase !== 'slide' && game.phase !== 'jump') {
    errors.push('phase: it is not time to jump');
  }
  if (!isPoint(fromId) || !isPoint(toId)) {
    errors.push('point: point must be a board point');
    return errors;
  }
  if (occupant(game.points, fromId) !== game.turn) {
    errors.push('point: choose your piece');
    return errors;
  }
  if (occupant(game.points, toId) !== null) {
    errors.push('point: that point is taken');
    return errors;
  }
  const overId = jumpedPoint(fromId, toId);
  if (!overId) {
    errors.push('point: that is not a jump');
    return errors;
  }
  const foe = game.turn === 'dark' ? 'light' : 'dark';
  if (occupant(game.points, overId) !== foe) {
    errors.push('point: jump an opponent piece');
  }
  return errors;
}
