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
life.render(generations, {
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

## Documentation
This is a list of the methods supproted. A detailed documentation is available in the [documentation section][zindagi-class-doc] of the homepage.

|Method|Description|
|:-----|:----------|
|`.live(n)`|Returns an [iterator][mdn-iterator-doc] of the current state plus `n` subsequent states|
|`.skip(n)`|Returns the current state after moving ahead `n` states|
|`.reset()`|Resets the current state to the `initState`|
|`.toString(opts)`|Returns the current state represented as a formatted string|
|`.render(iterator, opts)`|Renders a cellular automata in console using options|

<br>

## TODO
- [x] Documentation
- [x] Tests
- [ ] Optimizations
- [ ] HashLife implementation

<br>

__Contributions are welcome!__

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

[zindagi-class-doc]: https://tarunbatra.com/zindagi/Zindagi.html
[mdn-iterator-doc]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol