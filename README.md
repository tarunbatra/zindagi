[![Zindagi][logo]][docs]

[![build status][build-image]][build-url]
[![coverage status][codecov-image]][codecov-url]
[![npm version][npm-image]][npm-url]
![license][license-image]

Zindagi is a library to easily program and render [life-like cellular automatas][life-like-wiki] including but not limited to Highlife and [Conway's Game of Life][gol-wiki].


## Usage

```js
import { Zindagi } from 'zindagi';        // use ES modules
// const { Zindagi } = require('zindagi); // or CommonJS

const life = new Zindagi({
  // Life-like rule
  rules: 'S23/B3',
  // Flag to enable alive cells to re-appear on
  // the other side of the board in case of overflow
  stitchedEdges: true,
  // Symbols to represent alive and dead cells in initState param
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
[docs]: https://tarunbatra.com/zindagi

[build-image]:https://img.shields.io/github/workflow/status/tarunbatra/zindagi/CI?label=CI&logo=github&style=flat-square
[build-url]:https://github.com/tarunbatra/zindagi/actions?query=workflow%3ACI
[codecov-url]: https://codecov.io/gh/tarunbatra/zindagi
[codecov-image]: https://img.shields.io/codecov/c/gh/tarunbatra/zindagi?logo=codecov&style=flat-square
[npm-image]: https://img.shields.io/npm/v/zindagi.svg?style=flat-square&color=magenta
[npm-url]: https://www.npmjs.com/package/zindagi
[license-image]: https://img.shields.io/github/license/tarunbatra/zindagi?color=pink&style=flat-square

[life-like-wiki]: https://en.wikipedia.org/wiki/Life-like_cellular_automaton
[gol-wiki]: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
[example-output-gif]: https://res.cloudinary.com/tbking/video/upload/e_loop/v1604362000/zindagi/glider-example.gif