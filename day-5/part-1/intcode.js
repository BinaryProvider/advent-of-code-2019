const EXIT_CODE = 99;

const OPERATIONS = {
  1: add,
  2: multiply,
  3: save,
  4: output
};

let result = undefined;
let numbers = [];
let pointer = 0;

function initialize(input, noun, verb) {
  result = undefined;
  pointer = 0;
  numbers = [...input];

  if (noun) numbers[1] = +noun;
  if (verb) numbers[2] = +verb;
}

function compute(input) {
  let isRunning = true;

  do {
    isRunning = processInstruction(input);
  } while (isRunning);

  this.result = numbers;
}

function processInstruction(input) {
  const instruction = numbers[pointer];

  const params = (new Array(5).join('0') + instruction)
    .slice(-5)
    .split('')
    .map(Number)
    .reverse();

  const opCode = +(params[1] + params[0]);
  const mode1 = params[2];
  const mode2 = params[3];
  const mode3 = params[4];

  if (opCode === EXIT_CODE) {
    return false;
  }

  console.log(opCode);

  if (OPERATIONS[opCode]) {
    OPERATIONS[opCode](mode1, mode2, mode3, input);
  } else {
    return false;
  }

  // step(instruction.toString().length);
  // const opCode = numbers[pointer];

  // if (opCode === EXIT_CODE) {
  //   return false;
  // }

  // if (OPERATIONS[opCode]) {
  //   OPERATIONS[opCode]();
  // } else {
  //   return false;
  // }

  // if (pointer < numbers.length) return false;

  step(4);
}

function step(steps) {
  pointer += steps;
}

function getParam(input, byVal, writeParam) {
  writeParam = writeParam || false;
  const param = byVal && !writeParam ? input : numbers[input];
  return param;
}

function add(mode1, mode2) {
  const p1 = getParam(numbers[pointer + 1], mode1);
  const p2 = getParam(numbers[pointer + 2], mode2);
  const output = p1 + p2;
  numbers[numbers[pointer + 3]] = output;
}

function multiply(mode1, mode2) {
  const p1 = getParam(numbers[pointer + 1], mode1);
  const p2 = getParam(numbers[pointer + 2], mode2);
  const output = p1 * p2;
  numbers[numbers[pointer + 3]] = output;
}

function save(mode1, mode2, mode3, input) {
  const address = getParam(numbers[pointer + 1], mode1);
  numbers[address] = input;
}

function output(mode1, mode2, mode3) {
  const address = getParam(numbers[pointer + 1], mode1);
  console.log(numbers[address]);
}

exports.initialize = initialize;
exports.compute = compute;
exports.result = result;
