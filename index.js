import { sleep, escapeRegex, getRandomInt } from './lib.js';

/**
 * Zindagi represents a life-like cellular automata
 */
export class Zindagi {
  /**
   * Initializes a life-like cellular automata
   * @constructor
   * @param {object} [options] - Options to pass for initialization
   * @param {object|string} options.rules=B3/S23 - Like-like rules eg. `B3/S23` or
   * `{ B: { 3: true }, S: { 2: true, 3: true } }`
   * @param {boolean} options.stitchedEdges=false - Enables behavior where the opposite edges seem to be
   *  stitched together such that the next cell of the last cell in a row is the first one.
   * @param {string|state} [options.initState] - Initial state of the automata.
   *  Defaults to a random state geenerated depending on the `grid` option
   * @param {object} [options.grid] - Options for randomly generated initial state
   * @param {number} options.grid.columns=10 - Number of columns
   * @param {number} options.grid.rows=10 - Number of rows
   * @param {object} [options.symbols] - Symbols to represent cell types in initState param
   * @param {*} options.symbols.alive=⬛️ - Alive cells
   * @param {*} options.symbols.dead=⬜️ - Dead cells
   * @param {*} options.symbols.rowDelimeter=\n - Represents new row of cells
   * @param {string} options.algorithm=naive - For future use
   */
  constructor(options = {}) {
    this.rules = Zindagi.parseRules(options?.rules);
    this.algorithm = options?.algorithm || 'naive';
    this.symbols = {
      alive: options?.symbols?.alive ?? '⬛️',
      dead: options?.symbols?.dead ?? '⬜️',
      columnDelimeter: options?.symbols?.columnDelimeter ?? '',
      rowDelimeter: options?.symbols?.rowDelimeter ?? '\n',
    };
    this.initState = Zindagi.parseInitState(options?.initState, options?.grid, this?.symbols), options.stitchedEdges;
    this.grid = { rows: this.initState?.length, columns: this.initState?.[0]?.length };
    this.currentState = this.initState;
    this.stitchedEdges = options?.stitchedEdges === true;

    // A string representation of the currentState
    // generated on call of toString method
    this.str = null;
  }

  set currentState(state) {
    this.state = state;
    this.str = null;
  }

  get currentState() {
    return this.state;
  }

  toString({ alive, dead, eol = '\n' } = {}) {
    // If a string representation of the current state exists, return it
    if (this.str) return this.str;
    // Convert the Array of arrays to a string grid
    let board = this.currentState.map(row => row.join('')).join(eol);

    // If the internal representation os cells is different from
    // the params provided, replace using regex.
    // TODO: Find an efficient way to do this
    if (alive != null && alive !== this.symbols.alive) {
      let aliveRegex = new RegExp(escapeRegex(this.symbols.alive), 'g');
      board = board.replace(aliveRegex, alive);
    }
    if (dead != null && dead !== this.symbols.dead) {
      let deadRegex = new RegExp(escapeRegex(this.symbols.dead), 'g');
      board = board.replace(deadRegex, dead);
    }
    // Save the string generated
    this.str = board;
    return this.str;
  }

  /**
   * Takes the game forward by n generations.
   * If still life is reached globally, it
   * stops living more generations.
   * @generator
   *
   * @param {number} generations=Infinity - Number of generations to live
   * @yields {state}
   */
  * live(generations = Infinity) {
    let iterations = 0;
    // yield the first state
    yield this.currentState;
    // until we have lived all generations
    // loop through the currentState and generate nextState
    while (iterations++ < generations) {
      const prevBoard = this.toString();
      const nextState = new Array(this.grid.rows);
      for (let i = 0; i < this.grid.rows; i++) {
        nextState[i] = new Array(this.grid.columns);
        for (let j = 0; j < this.grid.columns; j++) {
          nextState[i][j] = this.nextStateOfCell(i, j, this.stitchedEdges);
        }
      }
      this.currentState = nextState;
      yield this.currentState;
      // If the new state is identical to the previous one
      // then stop generating more states
      if (prevBoard == this.toString()) {
        break;
      }
    }
  }

  /**
   * Skips n generations ahead
   *
   * @param {number} generations - Generations to skip
   * @returns {state} The state after skipping
   */
  skip(generations) {
    let toSkip = Number(generations);
    if (!toSkip) throw new Error('Skip method requires a positive number as argument');
    const simulation = this.live(generations);
    while(!simulation.next().done) {
      ;
    }
    return this.currentState;
  }

  /**
   * Resets the game to initial state
   */
  reset() {
    this.currentState = this.initState;
  }

  /**
   * Checks if a given cell (x,y) is alive or not
   * @private
   * @param {number} x - row index
   * @param {number} y - column index
   * @param {boolean} stitchedEdges - stitchedEdges flag
   * @returns {boolean} True if the cell is alive
   */
  isCellAlive(x, y, stitchedEdges) {
    let row = stitchedEdges ? (this.grid.rows + x) % this.grid.rows : x;
    let col = stitchedEdges ? (this.grid.columns + y) % this.grid.columns : y;
    return this.currentState?.[row]?.[col] == this.symbols.alive;
  }

  /**
   * Calculates the next state of a given cell (x,y)
   * @private
   * @param {number} x - row index
   * @param {number} y - column index
   * @param {boolean} stitchedEdges - stitchedEdges flag
   * @returns {*} Alive or return symbol
   */
  nextStateOfCell(x, y, stitchedEdges) {
    let aliveNeighbors = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        // Do not count the cell itself
        if (i == x && j == y) continue;
        // Count alive neighbors
        if (this.isCellAlive(i, j, stitchedEdges)) aliveNeighbors++;
      }
    }
    const currentState = this.currentState[x][y];
    if (currentState == this.symbols.alive) {
      // if alive, check if it can survive
      if (this.rules.S[aliveNeighbors]) {
        return this.symbols.alive;
      }
    }
    else {
      // if dead, check if it can be born
      if (this.rules.B[aliveNeighbors]) {
        return this.symbols.alive;
      }
    }
    return this.symbols.dead;
  }

  /**
   * Helper method to print the game on every generation
   *
   * @param {IterableIterator} play - Return value of `live` method
   * @param {object} [options]
   * @param {*} options.alive=⬛️ - Symbol to represent alive cells
   * @param {*} options.dead=⬜️ - Symbol to represent dead cells
   * @param {number} options.timePerGeneration=1 - Time in seconds before next generation is rendered
   */
  async render(play, { alive = '⬛️', dead = '⬜️', timePerGeneration = 1 } = {}) {
    if (globalThis.process) {
      // Print to terminal in Node.js
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      for (let state of play) {
        rl.write(this.toString({ alive, dead }) + '\n');
        await sleep(timePerGeneration);
        readline.moveCursor(rl, -this.grid.columns, -this.grid.rows);
        readline.clearScreenDown(rl);
      }
      rl.write(this.toString({ alive, dead }) + '\n');
      rl.close();
    }
    else if (console) {
      // Print to console in browsers
      for (let state of play) {
        console.clear();
        console.log(this.toString({ alive, dead }) + '\n');
        await sleep(timePerGeneration);
      }
    }
    else {
      return console.error('Zindagi#render method is not supported in this environment');
    }
  }

  /**
   * Generates random init state given the desired row and column count
   * @private
   * @param {number} cols=10 - Columns required in generated state
   * @param {number} rows=10 - Rows required in generated state
   * @param {*} aliveSymbol - Symbol to represent alive cells
   * @param {*} deadSymbol - Symbol to represent dead cells
   * @returns {state}
   */
  static genRandomInitState(cols = 10, rows = 10, aliveSymbol, deadSymbol) {
    const state = new Array(rows);
    for (let i = 0; i < rows; i++) {
      state[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        state[i][j] = getRandomInt(2) ? aliveSymbol : deadSymbol;
      }
    }
    return state;
  }

  /**
   * Parse rules provided for the automata
   * @private
   * @param {object|string} inputRules - Rules like `B3/S23` or
   *          `{ B: { 3: true }, S: { 2: true, 3: true } }` to
   *          represent life-like automata's behavior
   * @returns {object} Rules parsed in the object form
   */
  static parseRules(inputRules) {
    const rules = { B: {}, S: {} };
    switch (typeof inputRules) {
      case 'object':
        rules.B = inputRules.B || {};
        rules.S = inputRules.S || {};
        break;
      case 'string':
        const items = inputRules.toUpperCase().split('/');
        for (const item of items) {
          const set = item.trim(' ').split('');
          for (const num of set.slice(1)) {
            rules[set[0]][num] = true;
          }
        }
        break;
      default:
        rules.B = { 3: true };
        rules.S = { 2: true, 3: true };
    }

    return rules;
  }

  /**
   * Parses a state in the form of string or object to the standard format
   * @private
   * @param {string|state} [initState] - Initial state of the automata
   * @param {object} [grid] - Dimensions of the initial state equired
   * @param {number} grid.rows - Rows required in initial state
   * @param {number} grid.columns - Columns required in initial state
   * @param {object} [symbols] - Symbols to use to represent cells
   * @param {*} symbols.alive - Alive cell symbol
   * @param {*} symbols.dead - Dead cell symbol
   * @param {*} symbols.rowDelimeter - Separator used in initial state definition
   * @returns {state} The parsed state object
   */
  static parseInitState(initState, grid = {}, symbols = {}) {
    switch (typeof initState) {
      case 'object':
        return initState;
      case 'string':
        return initState.trim().split(symbols?.rowDelimeter).map(row => row.trim().split(symbols?.columnDelimeter));
      default:
        return Zindagi.genRandomInitState(grid?.columns, grid?.rows, symbols?.alive, symbols?.dead);
    }
  }
}

/**
 * @typedef state
 * @description An array of arrays used to represent
 *  a unique generation of a life-like cellular automata.
 *  @example [
 *   [ "0", "1", "0", "0", "0", "0" ],
 *   [ "0", "1", "1", "0", "0", "0" ],
 *   [ "0", "0", "0", "0", "0", "0" ]
 * ]
 * @type {Array.<Array.<string>>}
 */