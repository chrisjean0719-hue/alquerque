import { hasLegalJump, jumpLandings } from './board.js';
import { POINTS, neighbours } from './points.js';

export function destinations(game, fromId) {
  if (game.points[fromId] !== game.turn) return [];
  if (game.phase === 'jump' || hasLegalJump(game.points, game.turn)) {
    return jumpLandings(game.points, fromId);
  }
  return neighbours(fromId).filter((id) => game.points[id] === null);
}

export function legalPoints(game) {
  if (game.winner || game.phase === 'over') return [];
  if (game.phase === 'jump') {
    return destinations(game, game.selected);
  }
  if (hasLegalJump(game.points, game.turn)) {
    if (game.selected) return destinations(game, game.selected);
    return POINTS.filter((id) => game.points[id] === game.turn && destinations(game, id).length > 0);
  }
  if (game.selected) {
    return destinations(game, game.selected);
  }
  return POINTS.filter((id) => game.points[id] === game.turn && destinations(game, id).length > 0);
}
