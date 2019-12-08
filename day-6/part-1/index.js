const fs = require('fs');
const readline = require('readline');

const interface = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

const orbits = {};

let orbitCount = 0;

interface.on('line', line => {
  const bodies = line.split(')');
  const body = bodies[0];
  const satellite = bodies[1];

  if (!orbits[body]) {
    orbits[body] = [satellite];
  } else {
    orbits[body].push(satellite);
  }
});

interface.on('close', () => {
  Object.keys(orbits).forEach(body => {
    orbitCount += countSatellites(body);
  });

  console.log(orbitCount);
});

function countSatellites(body) {
  let count = 0;

  const satellites = orbits[body];

  if (satellites) {
    count += satellites.length;

    satellites.forEach(satellite => {
      count += countSatellites(satellite);
    });
  } else {
    return count;
  }

  return count;
}
