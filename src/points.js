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
