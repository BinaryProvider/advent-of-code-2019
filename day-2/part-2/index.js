const fs = require('fs');
const intCode = require('./intcode');

const file = fs.readFileSync('input.txt').toString();
const numbers = file.split(',');

const maxIterations = 10000;
const targetResult = 19690720;
const nounMax = Math.sqrt(maxIterations);
const verbMax = Math.sqrt(maxIterations);

const input = calculateInputForOutput(targetResult);
if (input) {
  console.log(
    `Noun: ${input.noun} Verb: ${input.verb} Result: ${100 * input.noun +
      input.verb}`
  );
} else {
  console.log('Could not calculate input.');
}

function calculateInputForOutput(expectedResult) {
  for (let noun = 0; noun < nounMax; noun++) {
    for (let verb = 0; verb < verbMax; verb++) {
      const computedResult = computeResult(noun, verb);
      if (computedResult[0] === expectedResult) {
        return {
          verb,
          noun
        };
      }
    }
  }

  return null;
}

function computeResult(noun, verb) {
  intCode.initialize(numbers, noun, verb);
  intCode.compute();
  return intCode.result;
}
