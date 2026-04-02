import { POINTS, beyond, neighbours } from './points.js';
import { PIECES } from './sizes.js';

export function emptyPoints() {
  return Object.fromEntries(POINTS.map((id) => [id, null]));
}

export function startingPoints() {
  const points = emptyPoints();
  for (const id of POINTS) {
    const rank = Number(id.slice(1));
    const file = id.charCodeAt(0) - 97;
    if (rank <= 2 || (rank === 3 && file <= 1)) {
      points[id] = 'dark';
    } else if (rank >= 4 || (rank === 3 && file >= 3)) {
      points[id] = 'light';
    }
  }
  return points;
}

export function occupant(points, id) {
  return points[id] ?? null;
}

export function occupiedCount(points, colour) {
  return POINTS.filter((id) => points[id] === colour).length;
}

export function emptyCount(points) {
  return POINTS.filter((id) => points[id] === null).length;
}

export function hasLegalSlide(points, colour) {
  return POINTS.some(
    (from) => points[from] === colour && neighbours(from).some((to) => points[to] === null),
  );
}

export function hasLegalJump(points, colour) {
  return POINTS.some((id) => points[id] === colour && jumpLandings(points, id).length > 0);
}

export function jumpLandings(points, fromId) {
  const colour = points[fromId];
  if (!colour) return [];
  const foe = colour === 'dark' ? 'light' : 'dark';
  const lands = [];
  for (const over of neighbours(fromId)) {
    if (points[over] !== foe) continue;
    const to = beyond(fromId, over);
    if (to && points[to] === null) lands.push(to);
  }
  return lands;
}

export function isStartingArray(points) {
  const start = startingPoints();
  return POINTS.every((id) => points[id] === start[id]) && occupiedCount(points, 'dark') === PIECES;
}
