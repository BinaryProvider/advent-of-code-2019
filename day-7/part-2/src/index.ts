import { IntCodeComputer } from './intcode-computer';
import { PermutationGenerator } from './permutation-generator';
import * as fs from 'fs';
import * as path from 'path';

export class Application {
  private file: Buffer;
  private filePath: string;
  private numbers: number[];
  private phaseSettingSequence = [5, 6, 7, 8, 9];
  private permutations: number[][];

  constructor() {
    this.filePath = path.join(__dirname, '../input', 'input.txt');
    this.file = fs.readFileSync(this.filePath);

    this.permutations = new PermutationGenerator(
      this.phaseSettingSequence
    ).permutations;

    this.numbers = this.file
      .toString()
      .split(',')
      .map(Number);
  }

  public static run() {
    const app = new Application();

    let maxOutput = 0;

    app.permutations.forEach((phaseSetting: number[]) => {
      const ampA = new IntCodeComputer([...app.numbers]);
      ampA.input.push(phaseSetting[0]);
      ampA.run();

      const ampB = new IntCodeComputer([...app.numbers]);
      ampB.input.push(phaseSetting[1]);
      ampB.run();

      const ampC = new IntCodeComputer([...app.numbers]);
      ampC.input.push(phaseSetting[2]);
      ampC.run();

      const ampD = new IntCodeComputer([...app.numbers]);
      ampD.input.push(phaseSetting[3]);
      ampD.run();

      const ampE = new IntCodeComputer([...app.numbers]);
      ampE.input.push(phaseSetting[4]);
      ampE.run();

      let allRunning = true;
      let output = 0;

      do {
        ampA.input.push(output);
        ampA.run();
        output = ampA.output;

        ampB.input.push(output);
        ampB.run();
        output = ampB.output;

        ampC.input.push(output);
        ampC.run();
        output = ampC.output;

        ampD.input.push(output);
        ampD.run();
        output = ampD.output;

        ampE.input.push(output);
        ampE.run();
        output = ampE.output;

        allRunning =
          ampA.isRunning &&
          ampB.isRunning &&
          ampC.isRunning &&
          ampD.isRunning &&
          ampE.isRunning;
      } while (allRunning);

      maxOutput = Math.max(output, maxOutput);
    });

    console.log(maxOutput);
  }
}

Application.run();
