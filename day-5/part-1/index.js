const fs = require('fs');
const intCode = require('./intcode');

runDiagnostics(1);

function runDiagnostics(input) {
  const file = fs.readFileSync('input.txt').toString();
  const numbers = file.split(',').map(Number);
  return runComputations(input, numbers);
}

function runComputations(input, numbers) {
  intCode.initialize(numbers);
  intCode.compute(input);
  return intCode.result;
}
