const EXIT_CODE = 99;
const SAVE_CODE = 3;

const OPERATIONS = {
  1: add,
  2: multiply,
  3: save,
  4: output,
  5: jumpIfTrue,
  6: jumpIfFalse,
  7: lessThan,
  8: equals
};

const PARAM_LENGTH = {
  1: 3,
  2: 3,
  3: 1,
  4: 1,
  5: 2,
  6: 2,
  7: 3,
  8: 3
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

  let input1 = input[0];
  let input2 = input[1];
  let nextInput = input1;

  do {
    const instruction = parseInstruction(numbers[pointer]);

    let jumpPointer = NaN;
    let instructionPointer = instruction.length + 1;

    if (instruction.opCode === EXIT_CODE || isNaN(instruction.opCode)) {
      isRunning = false;
    } else {
      jumpPointer = processInstruction(instruction, nextInput);
    }

    if (instruction.opCode === SAVE_CODE) {
      nextInput = input2;
    }

    if (isNaN(jumpPointer)) {
      pointer += instructionPointer;
    } else {
      pointer = jumpPointer;
    }
  } while (isRunning);

  this.result = numbers;
}

function parseInstruction(instruction) {
  const params = (new Array(5).join('0') + instruction)
    .slice(-5)
    .split('')
    .map(Number)
    .reverse();

  const opCode = +(params[1] + params[0]);
  const mode1 = params[2];
  const mode2 = params[3];
  const mode3 = params[4];
  const length = PARAM_LENGTH[opCode];

  return {
    opCode,
    mode1,
    mode2,
    mode3,
    length
  };
}

function processInstruction(instruction, input) {
  if (OPERATIONS[instruction.opCode]) {
    return OPERATIONS[instruction.opCode](
      input,
      instruction.mode1,
      instruction.mode2,
      instruction.mode3
    );
  }

  return NaN;
}

function getParam(input, byVal, writeParam) {
  writeParam = writeParam || false;
  byVal = writeParam ? true : byVal;
  const param = byVal ? input : numbers[input];
  return param;
}

function add(input, mode1, mode2) {
  const p1 = getParam(numbers[pointer + 1], mode1);
  const p2 = getParam(numbers[pointer + 2], mode2);
  const writeAddress = numbers[pointer + 3];
  const output = p1 + p2;
  numbers[writeAddress] = output;
  return NaN;
}

function multiply(input, mode1, mode2) {
  const p1 = getParam(numbers[pointer + 1], mode1);
  const p2 = getParam(numbers[pointer + 2], mode2);
  const writeAddress = numbers[pointer + 3];
  const output = p1 * p2;
  numbers[writeAddress] = output;
  return NaN;
}

function save(input, mode1, mode2, mode3) {
  const address = getParam(numbers[pointer + 1], true);
  numbers[address] = input;
  return NaN;
}

function output(input, mode1, mode2, mode3) {
  const value = getParam(numbers[pointer + 1], mode1);
  exports.output = value;
  return NaN;
}

function jumpIfTrue(input, mode1, mode2, mode3) {
  const p1 = getParam(numbers[pointer + 1], mode1);
  const p2 = getParam(numbers[pointer + 2], mode2);
  if (p1 !== 0) return p2;
  return NaN;
}

function jumpIfFalse(input, mode1, mode2, mode3) {
  const p1 = getParam(numbers[pointer + 1], mode1);
  const p2 = getParam(numbers[pointer + 2], mode2);
  if (p1 === 0) return p2;
  return NaN;
}

function lessThan(input, mode1, mode2, mode3) {
  const p1 = getParam(numbers[pointer + 1], mode1);
  const p2 = getParam(numbers[pointer + 2], mode2);
  const writeAddress = numbers[pointer + 3];
  const value = p1 < p2 ? 1 : 0;
  numbers[writeAddress] = value;
  return NaN;
}

function equals(input, mode1, mode2, mode3) {
  const p1 = getParam(numbers[pointer + 1], mode1);
  const p2 = getParam(numbers[pointer + 2], mode2);
  const writeAddress = numbers[pointer + 3];
  const value = p1 === p2 ? 1 : 0;
  numbers[writeAddress] = value;
  return NaN;
}

exports.initialize = initialize;
exports.compute = compute;
exports.result = result;
