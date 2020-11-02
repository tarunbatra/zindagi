import { sleep, escapeRegex, getRandomInt } from './lib.js';

/**
 * Zindagi represents a life-like cellular automata
 */
class Zindagi {
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

  * live(generations = Number.POSITIVE_INFINITY) {
    let iterations = 0;
    yield this.currentState;
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
      if (prevBoard == this.toString()) {
        break;
      }
    }
  }

  skip(generations) {
    let toSkip = Number(generations);
    if (!toSkip) throw new Error('Skip method requires a positive number as argument');
    const simulation = this.live(generations);
    while(!simulation.next().done) {
      ;
    }
    return this.currentState;
  }

  reset() {
    this.currentState = this.initState;
  }

  isCellAlive(x, y, stitchedEdges) {
    let row = stitchedEdges ? (this.grid.rows + x) % this.grid.rows : x;
    let col = stitchedEdges ? (this.grid.columns + y) % this.grid.columns : y;
    return this.currentState?.[row]?.[col] == this.symbols.alive;
  }

  nextStateOfCell(x, y, stitchedEdges) {
    let aliveNeighbors = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {

        if (i == x && j == y) continue;

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

  async render(play, { alive = '⬛️', dead = '⬜️', timePerGeneration = 1 } = {}) {
    if (globalThis.process) {
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

export default Zindagi;
