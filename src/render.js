import { hasLegalJump, jumpLandings } from './board.js';
import { LINES, POINTS, fileIndex, neighbours, rankIndex } from './points.js';
import {
  BOARD_FILL,
  BOARD_SIZE,
  DARK_FILL,
  HIT_R,
  LABEL_FILL,
  LIGHT_FILL,
  LIGHT_STROKE,
  LINE_STROKE,
  PAD,
  PIECE_R,
  POINT_FILL,
  POINT_R,
  SELECT_STROKE,
  STEP,
} from './sizes.js';

export function pointXY(id) {
  return {
    x: PAD + fileIndex(id) * STEP,
    y: PAD + (5 - rankIndex(id)) * STEP,
  };
}

export function renderBoard(game) {
  const lines = LINES.map(([a, b]) => {
    const from = pointXY(a);
    const to = pointXY(b);
    return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="${LINE_STROKE}" stroke-width="4" />`;
  }).join('');

  const points = POINTS.map((id) => {
    const { x, y } = pointXY(id);
    const colour = game.points[id];
    const piece = colour ? pieceMarkup(x, y, colour, game.selected === id) : '';
    return `<g data-point="${id}" role="button" tabindex="0" aria-label="${pointLabel(id, colour, game)}">
      <circle class="hit" cx="${x}" cy="${y}" r="${HIT_R}" fill="transparent" />
      <circle class="spot" cx="${x}" cy="${y}" r="${POINT_R}" fill="${POINT_FILL}" stroke="${LINE_STROKE}" stroke-width="2" />
      ${piece}
    </g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOARD_SIZE} ${BOARD_SIZE}" width="${BOARD_SIZE}" height="${BOARD_SIZE}" role="img" aria-label="Alquerque board">
    <rect width="${BOARD_SIZE}" height="${BOARD_SIZE}" fill="${BOARD_FILL}" />
    ${lines}
    ${fileLabels()}
    ${rankLabels()}
    ${points}
  </svg>`;
}

function pointLabel(id, colour, game) {
  const mustJump = game.phase === 'jump' || hasLegalJump(game.points, game.turn);
  if (mustJump) {
    if (colour === game.turn && jumpLandings(game.points, id).length > 0) {
      return `Jump from ${id}`;
    }
    if (!colour && game.selected && jumpLandings(game.points, game.selected).includes(id)) {
      return `Jump to ${id}`;
    }
  } else {
    if (colour === game.turn) return `Slide from ${id}`;
    if (!colour && game.selected && neighbours(game.selected).includes(id)) {
      return `Slide to ${id}`;
    }
  }
  if (colour === 'dark') return `Dark on ${id}`;
  if (colour === 'light') return `Light on ${id}`;
  return `Empty ${id}`;
}

function pieceMarkup(x, y, colour, selected) {
  const klass = `piece${selected ? ' selected' : ''}`;
  if (colour === 'dark') {
    const extra = selected ? ` stroke="${SELECT_STROKE}" stroke-width="4"` : '';
    return `<circle class="${klass}" cx="${x}" cy="${y}" r="${PIECE_R}" fill="${DARK_FILL}"${extra} />`;
  }
  const stroke = selected ? SELECT_STROKE : LIGHT_STROKE;
  const width = selected ? 4 : 2;
  return `<circle class="${klass}" cx="${x}" cy="${y}" r="${PIECE_R}" fill="${LIGHT_FILL}" stroke="${stroke}" stroke-width="${width}" />`;
}

function fileLabels() {
  return ['a', 'b', 'c', 'd', 'e']
    .map((file, index) => {
      const x = PAD + index * STEP;
      const y = BOARD_SIZE - 16;
      return `<text x="${x}" y="${y}" text-anchor="middle" fill="${LABEL_FILL}" font-size="14">${file}</text>`;
    })
    .join('');
}

function rankLabels() {
  return [5, 4, 3, 2, 1]
    .map((rank, index) => {
      const x = 16;
      const y = PAD + index * STEP + 4;
      return `<text x="${x}" y="${y}" text-anchor="middle" fill="${LABEL_FILL}" font-size="14">${rank}</text>`;
    })
    .join('');
}
