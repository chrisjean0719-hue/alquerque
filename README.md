# Alquerque

A browser game for alquerque. Two players start with twelve pieces each on the 25-point board. The centre is empty. Dark starts. Click a Dark piece, then an empty neighbour, to slide it. Light then slides the same way. The board uses the usual point names, a1 to e5.

It is for someone learning the starting array and a quiet slide at home. The sample mid-slide is made up. The page does not store names, scores under a person, or accounts.

Written in JavaScript for Node 22.18 or newer. It has no dependencies. Tests use `node --test`.

## Run

```bash
npm test
node bin/serve.js
```

The game is at http://127.0.0.1:8029.

Dark slides first. Each colour has 12 pieces. The opening leaves c3 empty. Click your piece, then an empty neighbour. Occupied points reject a second piece. A slide must follow a board line. New game restores the starting array. The sample mid-slide is at http://127.0.0.1:8029/?fixture=mid : Dark has already slid b3 to c3, and it is Light to slide.

## Layout

```
src/            the board graph, sliding, the SVG, the static server
examples/       a fictional opening
test/           unit tests
```

## Next

About 35 hours of later work stay in [ROADMAP.md](ROADMAP.md).

## License

MIT
