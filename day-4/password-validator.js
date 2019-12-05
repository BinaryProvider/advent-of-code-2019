function validate(password) {
  const characters = password.toString().split('');

  var counts = {};

  for (let charIndex = 0; charIndex < characters.length; charIndex++) {
    const char = characters[charIndex];
    const nextChar = characters[charIndex + 1];

    if (nextChar && char > nextChar) return false;

    counts[char] = counts[char] + 1 || 1;
    prevChar = nextChar;
  }

  let containsPair = false;

  Object.keys(counts).forEach(char => {
    const charCount = counts[char];
    if (charCount > 2) return;
    if (charCount % 2 === 0) containsPair = true;
  });

  return containsPair;
}

exports.validate = validate;
