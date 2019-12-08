const fs = require('fs');
const readline = require('readline');

const interface = readline.createInterface({
  input: fs.createReadStream('testinput.txt'),
  output: process.stdout,
  terminal: false
});

const orbits = {};
let yourOrbit;
let santasOrbit;

interface.on('line', line => {
  const bodies = line.split(')');
  const body = bodies[0];
  const satellite = bodies[1];

  if (!orbits[body]) {
    orbits[body] = [satellite];
  } else {
    orbits[body].push(satellite);
  }

  const orbit = orbits[body];

  if (orbit.includes('YOU')) {
    yourOrbit = body;
  }

  if (orbit.includes('SAN')) {
    santasOrbit = body;
  }
});

interface.on('close', () => {
  let reachedSanta = false;
  let orbitalTransfers = 0;
  let yourTransfers = [];
  let santasTransfers = [];
  let yourCalcOrbit = yourOrbit;
  let santasCalcOrbit = santasOrbit;

  while (!reachedSanta) {
    const newOrbits = calculateOrbitalTransfers(yourCalcOrbit, santasCalcOrbit);

    yourCalcOrbit = newOrbits.you;
    santasCalcOrbit = newOrbits.santa;

    yourTransfers.push(newOrbits.you);
    santasTransfers.push(newOrbits.santa);

    // santasTransfers.forEach((orbitalTransfer, index) => {
    //   if (orbitalTransfer === yourCalcOrbit) {
    //     orbitalTransfers = yourTransfers.length + index;
    //     reachedSanta = true;
    //     return;
    //   }
    // });

    if (!newOrbits.you && !newOrbits.santa) reachedSanta = true;
  }

  console.log(yourTransfers);
  console.log(santasTransfers);
});

function calculateOrbitalTransfers(yourOrbit, santasOrbit) {
  let yourNewOrbit;
  let santasNewOrbit;

  Object.keys(orbits).forEach(body => {
    if (orbits[body].includes(yourOrbit)) {
      yourNewOrbit = body;
    }

    if (orbits[body].includes(santasOrbit)) {
      santasNewOrbit = body;
    }
  });

  return {
    you: yourNewOrbit,
    santa: santasNewOrbit
  };
}

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
