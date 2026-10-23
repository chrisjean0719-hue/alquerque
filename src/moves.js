export function plyNotation(kind, clicks) {
  if (kind === 'slide') {
    return `${clicks[0]}-${clicks[1]}`;
  }
  return clicks.join('x');
}

export function copyPlies(plies) {
  return (plies ?? []).map((ply) => ({
    colour: ply.colour,
    kind: ply.kind,
    notation: ply.notation,
    clicks: [...(ply.clicks ?? [])],
  }));
}

export function formatMoveList(plies) {
  const rows = [];
  for (let i = 0; i < plies.length; i += 2) {
    const n = i / 2 + 1;
    const dark = plies[i].notation;
    const light = plies[i + 1]?.notation;
    rows.push(light ? `${n}. ${dark} ${light}` : `${n}. ${dark}`);
  }
  return rows.join('\n');
}

export function renderMoveList(plies) {
  if (!plies.length) {
    return '<ol class="moves"></ol>';
  }
  const items = [];
  for (let i = 0; i < plies.length; i += 2) {
    const n = i / 2 + 1;
    const dark = `<span>${n}. ${plies[i].notation}</span>`;
    const light = plies[i + 1] ? `<span>${plies[i + 1].notation}</span>` : '';
    items.push(`<li>${dark}${light}</li>`);
  }
  return `<ol class="moves">${items.join('')}</ol>`;
}
