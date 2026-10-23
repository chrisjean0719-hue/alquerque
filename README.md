# Alquerque

A browser game for alquerque. Two players start with twelve pieces each on the 25-point board. The centre is empty. Dark starts. You play Dark. Light is a rules-based opponent that jumps if it can, else blocks a Dark jump, else takes a legal point. Click a piece, then an empty neighbour, to slide it. Click a piece, then the empty point beyond an opponent neighbour, to jump and take that piece. If any jump is open, you must take; a quiet slide is refused. If that piece can jump again, it stays selected and you must finish the chain. A colour with no pieces left, or with no legal slide or jump, loses. Legal points for the current ply are marked with a warm ring. Undo takes back your last ply and Light's reply. Each finished ply is listed. The board uses the usual point names, a1 to e5.

It is for someone learning the starting array, a quiet slide, a jump, a chain, a forced take, a win, legal points, undo, an opponent, and a move list at home. The sample positions are made up. The page does not store names, scores under a person, or accounts.

Written in JavaScript for Node 22.18 or newer. It has no dependencies. Tests use `node --test`.

## Run

```bash
npm test
node bin/serve.js
```

The game is at http://127.0.0.1:8029.

Dark slides first. Each colour has 12 pieces. The opening leaves c3 empty. Click your piece, then an empty neighbour. Occupied points reject a second piece. A slide must follow a board line. A jump follows the same line over an opponent piece onto the empty point beyond it, and that piece comes off. If any jump is open, only a jumping piece can be chosen. If the landing can jump again, that colour keeps the turn with that piece selected and must take again. You play Dark. After each Dark ply, Light answers: it jumps if it can (and keeps jumping while a chain is open), else occupies a point that would be a Dark landing, else takes the first legal point. Undo takes back Light's reply and your last ply. Finished plies are listed as slides and jumps. A colour with no pieces on the board loses. A colour that cannot slide or jump also loses. Movable pieces, empty neighbours, and jump landings that are legal for this ply get a warm ring. New game restores the starting array. The sample mid-slide is at http://127.0.0.1:8029/?fixture=mid : Dark has already slid b3 to c3, and Light jumps d3 to b3. The sample jump is at http://127.0.0.1:8029/?fixture=jump : Dark on c2 must jump c3 and land on c4. The sample chain is at http://127.0.0.1:8029/?fixture=chain : Dark on c1 must jump to c3, then to c5. The sample force is at http://127.0.0.1:8029/?fixture=force : Dark must jump c2 to c4 and cannot slide b2 to b3. The sample win is at http://127.0.0.1:8029/?fixture=win : Dark on c2 jumps the last Light on c3 and wins.

## Layout

```
src/            the board graph, sliding, jumping, a chain, a forced take, a win, hints, undo, the opponent, the move list, the SVG, the static server
examples/       a fictional opening
test/           unit tests
```

## Next

About 35 hours of later work stay in [ROADMAP.md](ROADMAP.md).

## License

MIT
