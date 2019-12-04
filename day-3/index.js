const fs = require('fs');
const readline = require('readline');

const DIRECTIONS = {
  U: 1,
  R: 1,
  D: -1,
  L: -1
};

const interface = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

const wirePoints = [];

let wireId = 0;

interface.on('line', line => {
  const points = line.split(',');

  let x = 0;
  let y = 0;
  let step = 0;
  let visitedPositions = {};

  points.forEach(point => {
    const dir = point.charAt(0);
    const movement = DIRECTIONS[dir];
    const steps = movement * +point.substring(1);

    const targetX = dir === 'R' || dir === 'L' ? x + steps : 0;
    const targetY = dir === 'U' || dir === 'D' ? y + steps : 0;

    while (targetX && x !== targetX) {
      addWirePoint(visitedPositions, wireId, step++, x, y);
      x += movement;
    }

    while (targetY && y !== targetY) {
      addWirePoint(visitedPositions, wireId, step++, x, y);
      y += movement;
    }

    addWirePoint(visitedPositions, wireId, step, targetX, targetY);
  });

  wireId++;
});

interface.on('close', () => {
  wirePoints.sort((p1, p2) => p1.x - p2.x || p1.y - p2.y);

  let minDistance;
  let minSteps;
  let lastPoint = wirePoints[0];

  wirePoints.forEach(point => {
    if (
      point.wire !== lastPoint.wire &&
      point.x !== 0 &&
      point.y !== 0 &&
      point.x === lastPoint.x &&
      point.y === lastPoint.y
    ) {
      minDistance = Math.min(
        minDistance || Number.MAX_SAFE_INTEGER,
        Math.abs(point.x) + Math.abs(point.y)
      );

      minSteps = Math.min(
        minSteps || Number.MAX_SAFE_INTEGER,
        point.steps + lastPoint.steps
      );
    }

    lastPoint = point;
  });

  console.log(minSteps);
});

function addWirePoint(visitedPositions, wire, steps, x, y) {
  let prevPos = visitedPositions[`${x}.${y}`];

  wirePoints.push({
    steps: prevPos ? prevPos : steps,
    wire,
    x,
    y
  });

  if (!prevPos) {
    prevPos = steps;
  }
}
