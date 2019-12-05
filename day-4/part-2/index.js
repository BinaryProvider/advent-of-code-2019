const validator = require('./password-validator');

// Test: First half
let result = validator.validate(111122);
console.log(`Test case 1 (111122): ${result} (${result ? 'Pass' : 'Fail'})`);
result = validator.validate(223450);
console.log(`Test case 2 (223450): ${result} (${result ? 'Fail' : 'Pass'})`);
result = validator.validate(123789);
console.log(`Test case 3 (123789): ${result} (${result ? 'Fail' : 'Pass'})`);

// Test: Second half
result = validator.validate(112233);
console.log(`Test case 4 (112233): ${result} (${result ? 'Pass' : 'Fail'})`);
result = validator.validate(123444);
console.log(`Test case 5 (123444): ${result} (${result ? 'Fail' : 'Pass'})`);
result = validator.validate(111122);
console.log(`Test case 6 (111122): ${result} (${result ? 'Pass' : 'Fail'})`);

// Puzzle input
result = countValidPasswords(402328, 864247);
console.log(result);

function countValidPasswords(rangeFrom, rangeTo) {
  let validPasswords = 0;

  for (let password = rangeFrom; password <= rangeTo; password++) {
    if (validator.validate(password.toString())) {
      validPasswords++;
    }
  }

  return validPasswords;
}
