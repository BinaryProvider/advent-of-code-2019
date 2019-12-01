const fs = require("fs");
const readline = require("readline");

const interface = readline.createInterface({
  input: fs.createReadStream("input.txt"),
  output: process.stdout,
  terminal: false
});

let totalFuelReq = 0;

interface.on("line", mass => {
  const moduleFuelReq = calculateModuleFuelReq(mass);
  totalFuelReq += moduleFuelReq;
});

interface.on("close", () => {
  console.log(totalFuelReq);
});

function calculateModuleFuelReq(moduleMass) {
  let totalFuel = 0;

  let moduleFuel = calculateFuelRequirement(moduleMass);
  totalFuel += moduleFuel;

  let inputMass = moduleFuel;

  while (inputMass > 0) {
    const inputFuel = calculateFuelRequirement(inputMass);
    totalFuel += Math.max(inputFuel, 0);
    inputMass = inputFuel;
  }

  return totalFuel;
}

function calculateFuelRequirement(mass) {
  return Math.floor(mass / 3) - 2;
}
