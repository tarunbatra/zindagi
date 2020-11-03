![Zindagi][logo]

Zindagi is a library to easily program and render [life-like cellular automatas][life-like-wiki] including but not limited to Highlife and [Conway's Game of Life][gol-wiki].

## Usage

```js
import Zindagi from 'zindagi';

const life = new Zindagi({
  // Rule for conway's game of life
  rules: 'S23/B3',
  // Flag to enable alive cells to re-appear on
  // the other side of the board in case of overflow
  stitchedEdges: true,
  // Symbols to represent alive and dead cells in initialState param
  symbols: {
    alive: '0',
    dead: '.'
  },
  // Initial state of the automata
  initState: `..........
              .0........
              ..00......
              .00.......
              ..........
              ..........
              ..........
              ..........`
});

// play for 1000 generations
const generations = life.live(1000);

// in built method to render the automata to console/terminal
const life.render(generations, {
    alive: '⬛️',            // represent alive cells with black block
    dead: '⬜️',             // represent dead cells with white block
    timePerGeneration: 0.5, // 0.5 seconds per generation
});
```

## Output
![Example Output][example-output-gif]

## Install
```
npm install zindagi
```

## TODO
- [x] Documentation
- [ ] Tests
- [ ] Optimizations


[logo]: https://res.cloudinary.com/tbking/image/upload/v1604344754/zindagi/zindagi-logo.gif
[life-like-wiki]: https://en.wikipedia.org/wiki/Life-like_cellular_automaton
[gol-wiki]: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
[highlife-wiki]: https://en.wikipedia.org/wiki/Highlife_(cellular_automaton)
[example-output-gif]: https://res.cloudinary.com/tbking/video/upload/e_loop/v1604362000/zindagi/glider-example.gif