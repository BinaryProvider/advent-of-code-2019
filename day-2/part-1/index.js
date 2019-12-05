const fs = require('fs');
const intCode = require('./intcode');

const file = fs.readFileSync('input.txt').toString();
const numbers = file.split(',');

const result = computeResult(12, 2);
console.log(result[0]);

function computeResult(noun, verb) {
  intCode.initialize(numbers, noun, verb);
  intCode.compute();
  return intCode.result;
}
