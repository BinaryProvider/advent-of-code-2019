const fs = require('fs');
const file = fs.readFileSync('input.txt').toString();
const numbers = file.split(',').map(Number);

const availablePhaseSettings = [0, 1, 2, 3, 4];
const permutations = [];

let maxOutput = 0;

generatePermutations(availablePhaseSettings.length, availablePhaseSettings);

permutations.forEach(phaseSettings => {
  let output = 0;
  phaseSettings.forEach(phaseSetting => {
    output = runComputations([phaseSetting, output], [...numbers]);
    maxOutput = Math.max(output, maxOutput);
  });
});

console.log(maxOutput);

function runComputations(input, numbers) {
  const intCode = require('./intcode');
  intCode.initialize(numbers);
  intCode.compute(input);
  return intCode.output;
}

function generatePermutations(length, items) {
  if (length == 1) {
    permutations.push([...items]);
    return;
  }

  for (let i = 0; i < length; i += 1) {
    generatePermutations(length - 1, items);

    if (length % 2 == 0) {
      swap(items, i, length - 1);
    } else {
      swap(items, 0, length - 1);
    }
  }
}

function swap(collection, indexA, indexB) {
  var tmp = collection[indexA];
  collection[indexA] = collection[indexB];
  collection[indexB] = tmp;
}
