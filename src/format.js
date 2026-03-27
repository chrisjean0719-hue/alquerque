import { occupiedCount } from './board.js';

export function formatStatus(game) {
  if (game.winner) {
    const who = game.winner === 'dark' ? 'Dark' : 'Light';
    return `${who} wins.`;
  }
  const who = game.turn === 'dark' ? 'Dark' : 'Light';
  if (game.phase === 'jump' && game.selected) {
    return `${who} to jump from ${game.selected}`;
  }
  if (game.selected) {
    return `${who} to slide from ${game.selected}`;
  }
  return `${who} to slide`;
}

export function formatBoard(game) {
  const dark = occupiedCount(game.points, 'dark');
  const light = occupiedCount(game.points, 'light');
  return [
    formatStatus(game),
    `dark: ${dark} on the board`,
    `light: ${light} on the board`,
  ].join('\n');
}
