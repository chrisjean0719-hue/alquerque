# Alquerque

A browser game for alquerque. Two players start with twelve pieces each on the 25-point board. The centre is empty. Dark starts. Click a piece, then an empty neighbour, to slide it. Click a piece, then the empty point beyond an opponent neighbour, to jump and take that piece. If that piece can jump again, it stays selected and you jump from the landing. Light then moves the same way. The board uses the usual point names, a1 to e5.

It is for someone learning the starting array, a quiet slide, a jump, and a chain at home. The sample positions are made up. The page does not store names, scores under a person, or accounts.

Written in JavaScript for Node 22.18 or newer. It has no dependencies. Tests use `node --test`.

## Run

```bash
npm test
node bin/serve.js
```

The game is at http://127.0.0.1:8029.

Dark slides first. Each colour has 12 pieces. The opening leaves c3 empty. Click your piece, then an empty neighbour. Occupied points reject a second piece. A slide must follow a board line. A jump follows the same line over an opponent piece onto the empty point beyond it, and that piece comes off. If the landing can jump again, Dark (or Light) keeps the turn with that piece selected. Click the piece to stop the chain. After the chain ends, the other colour moves. New game restores the starting array. The sample mid-slide is at http://127.0.0.1:8029/?fixture=mid : Dark has already slid b3 to c3, and it is Light to slide. The sample jump is at http://127.0.0.1:8029/?fixture=jump : Dark on c2 jumps c3 and lands on c4. The sample chain is at http://127.0.0.1:8029/?fixture=chain : Dark on c1 jumps to c3, then to c5.

## Layout

```
src/            the board graph, sliding, jumping, a chain, the SVG, the static server
examples/       a fictional opening
test/           unit tests
```

## Next

About 35 hours of later work stay in [ROADMAP.md](ROADMAP.md).

## License

MIT
