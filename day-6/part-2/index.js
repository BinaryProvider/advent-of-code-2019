const fs = require('fs');
const readline = require('readline');

const interface = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

const bodies = {};
let yourLoc;
let santasLoc;

interface.on('line', line => {
  const data = line.split(')');

  const body = {
    name: data[1],
    parent: data[0]
  };

  if (body.name === 'YOU') {
    yourLoc = body;
  } else if (body.name === 'SAN') {
    santasLoc = body;
  }

  bodies[body.name] = body;
});

interface.on('close', () => {
  let reachedSanta = false;
  let orbitalTransfers = 0;

  const yourTransfers = [];
  const santasTransfers = [];

  yourLoc = bodies[yourLoc.parent];
  santasLoc = bodies[santasLoc.parent];

  while (!reachedSanta) {
    yourLoc = bodies[yourLoc.parent];
    santasLoc = bodies[santasLoc.parent];

    santasTransfers.push(santasLoc.name);
    yourTransfers.push(yourLoc.name);

    if (
      santasTransfers.includes(yourLoc.name) ||
      yourTransfers.includes(santasLoc.name)
    ) {
      reachedSanta = true;
    }
  }

  const intersection = yourTransfers.filter(
    value => -1 !== santasTransfers.indexOf(value)
  );

  let yourSteps = 0;
  yourTransfers.some(body => {
    yourSteps++;
    return body == intersection;
  });

  let santasSteps = 0;
  santasTransfers.some(body => {
    santasSteps++;
    return body == intersection;
  });

  orbitalTransfers = santasSteps + yourSteps;

  console.log(orbitalTransfers);
});

function countOrbits(body) {
  let count = 0;

  const satellites = orbits[body];

  if (satellites) {
    count += satellites.length;

    satellites.forEach(satellite => {
      count += countOrbits(satellite);
    });
  } else {
    return count;
  }

  return count;
}
