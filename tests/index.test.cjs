const test = require('tape');
const { Zindagi } = require('../cjs');
const { GliderStates, GliderStatesStitchedEdges } = require('./fixtures/index.cjs');

const gliderInitState = `..........
                         ..........
                         ..........
                         ..........
                         ..........
                         ..0.......
                         ...0......
                         .000......`;

test('CommonJS require works', (t) => {
  t.equal(
    Zindagi.prototype.constructor.name,
    'Zindagi',
    'imported module is a class'
  );
  t.end();
});

test('Default values are assigned to a new life instance`', (t) => {
  const life = new Zindagi();
  t.deepEqual(
    life.rules,
    { S: { 2: true, 3: true }, B: { 3: true } },
    'default rules are set'
  );
  t.deepEqual(
    life.symbols,
    { alive: '⬛️', dead: '⬜️', columnDelimeter: '', rowDelimeter: '\n' },
    'default symbols are set'
  );
  t.deepEqual(life.grid, { rows: 10, columns: 10 }, 'default grid is set');
  t.equal(life.stitchedEdges, false, 'default stitchedEdges are set');
  t.equal(life.algorithm, 'naive', 'default algorithm is set');
  t.equal(
    life.initState.length,
    life.grid.rows,
    'default initState has length equal to grid.rows'
  );
  t.equal(
    life.initState[0].length,
    10,
    'default initState has a nested array with length equal to grid.columns'
  );
  t.equal(
    life.currentState,
    life.initState,
    'default currentState is equal to default initState'
  );
  t.end();
});

test('`options.rules` should accept valid string', (t) => {
  const args = {
    rules: 'S23/B36',
  };
  const life = new Zindagi(args);
  t.deepEqual(
    life.rules,
    { S: { 2: true, 3: true }, B: { 3: true, 6: true } },
    'string rules are parsed correctly'
  );
  t.end();
});

test('`options.rules` should accept valid object', (t) => {
  const args = {
    rules: { S: { 2: true, 3: true }, B: { 3: true, 6: true } },
  };
  const life = new Zindagi(args);
  t.deepEqual(life.rules, args.rules, 'object rules are set correctly');
  t.end();
});

test('`options.initState` should accept valid string', (t) => {
  const args = {
    initState: gliderInitState,
    symbols: { alive: '0', dead: '.' },
  };
  const life = new Zindagi(args);
  const parsedInitState = GliderStates[0];
  t.deepEqual(life.initState, parsedInitState, 'initState is parsed correctly');
  t.deepEqual(
    life.symbols,
    { alive: '0', dead: '.', columnDelimeter: '', rowDelimeter: '\n' },
    'symbols are set correctly'
  );
  t.deepEqual(
    life.grid,
    { rows: 8, columns: 10 },
    'grid values are set correctly'
  );
  t.end();
});

test('`options.initState` should accept valid object', (t) => {
  const args = {
    initState: GliderStates[0],
    symbols: { alive: '1', dead: '0' },
  };
  const life = new Zindagi(args);
  const parsedInitState = GliderStates[0];
  t.deepEqual(life.initState, parsedInitState, 'initState is parsed correctly');
  t.deepEqual(
    life.symbols,
    { alive: '1', dead: '0', columnDelimeter: '', rowDelimeter: '\n' },
    'symbols are set correctly'
  );
  t.deepEqual(
    life.grid,
    { rows: GliderStates[0].length, columns: GliderStates[0][0].length },
    'grid values are set correctly'
  );
  t.end();
});

test('`.live` should return an iterator of valid states', (t) => {
  const args = {
    initState: gliderInitState,
    symbols: { alive: '0', dead: '.' },
  };
  const life = new Zindagi(args);
  const play = life.live(3);
  const expectedStates = GliderStates;
  let index = 0;
  let state = play.next();
  t.plan(4);
  while (!state.done) {
    t.deepEqual(state.value, expectedStates[index++], `state ${index} matched`);
    state = play.next();
  }
});

test('`.skip` should return the final state', (t) => {
  const args = {
    initState: gliderInitState,
    symbols: { alive: '0', dead: '.' },
  };
  const life = new Zindagi(args);
  const finalStateAfterSkipping = life.skip(2);
  const expectedState = GliderStates[2];
  t.deepEqual(finalStateAfterSkipping, expectedState, 'final state after skipping matched');
  t.end();
});

test('`.live` with stitchedEdges', (t) => {
  const args = {
    initState: gliderInitState,
    symbols: { alive: '0', dead: '.' },
    stitchedEdges: true,
  };
  const life = new Zindagi(args);
  const play = life.live(10);
  const expectedStates = GliderStatesStitchedEdges;
  let index = 0;
  let state = play.next();
  t.plan(11);
  while (!state.done) {
    t.deepEqual(state.value, expectedStates[index++], `state ${index} matched`);
    state = play.next();
  }
});

test('`.live` should stop iterating when still life reached', (t) => {
  const args = {
    initState: gliderInitState,
    symbols: { alive: '0', dead: '.' },
  };
  const life = new Zindagi(args);
  const play = life.live(10);
  const expectedStates = GliderStates;
  let index = 0;
  let state = play.next();
  t.plan(5);
  while (!state.done) {
    t.deepEqual(state.value, expectedStates[index++], `state ${index} matched`);
    state = play.next();
  }
});

test('`.toString` is called', t => {
  const args = {
    initState: gliderInitState,
    symbols: { alive: '0', dead: '.' },
  };
  const life = new Zindagi(args);
  life.skip(8);
  const stringState = '..........\n..........\n..........\n..........\n..........\n..........\n..00......\n..00......';
  t.deepEqual(life.toString(), stringState, 'string is rendered with defaults');
  t.end();
});

test('`.toString` is called with args', t => {
  const args = {
    initState: gliderInitState,
    symbols: { alive: '0', dead: '.' },
  };
  const life = new Zindagi(args);
  life.skip(8);
  const stringState = '0 0 0 0 0 0 0 0 0 0\t0 0 0 0 0 0 0 0 0 0\t0 0 0 0 0 0 0 0 0 0\t0 0 0 0 0 0 0 0 0 0\t0 0 0 0 0 0 0 0 0 0\t0 0 0 0 0 0 0 0 0 0\t0 0 1 1 0 0 0 0 0 0\t0 0 1 1 0 0 0 0 0 0';
  const strArgs = { alive: '1', dead: '0', columnDelimeter: ' ', rowDelimeter: '\t' };
  t.deepEqual(life.toString(strArgs), stringState, 'string is rendered with provided options');
  t.end();
});


test('`.render` is called', async t => {
  const args = {
    initState: gliderInitState,
    symbols: { alive: '0', dead: '.' },
  };
  const life = new Zindagi(args);
  const play = life.live(3);
  await life.render(play, { timePerGeneration: 0.01 });
  t.deepEqual(life.currentState, GliderStates[3], 'state after render is correct');
  t.end();
});
