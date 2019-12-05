const EXIT_CODE = 99;

const OPERATIONS = {
  1: add,
  2: multiply
};

let result = undefined;
let numbers = [];
let pointer = 0;

function initialize(input, noun, verb) {
  result = undefined;
  pointer = 0;
  numbers = [...input];
  numbers[1] = +noun;
  numbers[2] = +verb;
}

function compute() {
  while (processInstruction()) {
    step();
  }

  this.result = numbers;
}

function processInstruction() {
  const opCode = numbers[pointer];

  if (opCode === EXIT_CODE) {
    return false;
  }

  const address1 = numbers[pointer + 1];
  const address2 = numbers[pointer + 2];
  const outputAddress = numbers[pointer + 3];

  const param1 = +numbers[address1];
  const param2 = +numbers[address2];

  if (OPERATIONS[opCode]) {
    const output = OPERATIONS[opCode](param1, param2);
    numbers[outputAddress] = output;
  } else {
    return false;
  }

  return pointer < numbers.length;
}

function add(input1, input2) {
  return input1 + input2;
}

function multiply(input1, input2) {
  return input1 * input2;
}

function step() {
  pointer += 4;
}

exports.initialize = initialize;
exports.compute = compute;
exports.result = result;
