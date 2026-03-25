export const POINTS = [
  'a5',
  'b5',
  'c5',
  'd5',
  'e5',
  'a4',
  'b4',
  'c4',
  'd4',
  'e4',
  'a3',
  'b3',
  'c3',
  'd3',
  'e3',
  'a2',
  'b2',
  'c2',
  'd2',
  'e2',
  'a1',
  'b1',
  'c1',
  'd1',
  'e1',
];

export const NEIGHBOURS = buildNeighbours();
export const LINES = linesFromNeighbours(NEIGHBOURS);

export function isPoint(id) {
  return POINTS.includes(id);
}

export function pointId(file, rank) {
  return `${String.fromCharCode(97 + file)}${rank}`;
}

export function fileIndex(id) {
  return id.charCodeAt(0) - 97;
}

export function rankIndex(id) {
  return Number(id.slice(1));
}

export function neighbours(id) {
  return NEIGHBOURS[id] ?? [];
}

export function beyond(fromId, overId) {
  if (!neighbours(fromId).includes(overId)) return null;
  const toFile = fileIndex(overId) + (fileIndex(overId) - fileIndex(fromId));
  const toRank = rankIndex(overId) + (rankIndex(overId) - rankIndex(fromId));
  if (toFile < 0 || toFile > 4 || toRank < 1 || toRank > 5) return null;
  const toId = pointId(toFile, toRank);
  if (!neighbours(overId).includes(toId)) return null;
  return toId;
}

export function jumpedPoint(fromId, toId) {
  const df = fileIndex(toId) - fileIndex(fromId);
  const dr = rankIndex(toId) - rankIndex(fromId);
  if (![0, 2, -2].includes(df) || ![0, 2, -2].includes(dr) || (df === 0 && dr === 0)) {
    return null;
  }
  const overId = pointId(fileIndex(fromId) + df / 2, rankIndex(fromId) + dr / 2);
  if (beyond(fromId, overId) !== toId) return null;
  return overId;
}

export function hasDiagonal(id) {
  return (fileIndex(id) + (rankIndex(id) - 1)) % 2 === 0;
}

function buildNeighbours() {
  const map = Object.fromEntries(POINTS.map((id) => [id, []]));
  for (const id of POINTS) {
    const file = fileIndex(id);
    const rank = rankIndex(id);
    const next = [];
    pushIfPoint(next, file - 1, rank);
    pushIfPoint(next, file + 1, rank);
    pushIfPoint(next, file, rank - 1);
    pushIfPoint(next, file, rank + 1);
    if (hasDiagonal(id)) {
      pushIfPoint(next, file - 1, rank - 1);
      pushIfPoint(next, file - 1, rank + 1);
      pushIfPoint(next, file + 1, rank - 1);
      pushIfPoint(next, file + 1, rank + 1);
    }
    map[id] = next;
  }
  return map;
}

function pushIfPoint(list, file, rank) {
  if (file < 0 || file > 4 || rank < 1 || rank > 5) return;
  list.push(pointId(file, rank));
}

function linesFromNeighbours(map) {
  const lines = [];
  for (const id of POINTS) {
    for (const other of map[id]) {
      if (id < other) lines.push([id, other]);
    }
  }
  return lines;
}
