import { IntCodeComputer } from './intcode-computer';
import { PermutationGenerator } from './permutation-generator';
import * as fs from 'fs';
import * as path from 'path';

export class Application {
  private file: Buffer;
  private filePath: string;
  private numbers: number[];
  private phaseSettingSequence = [9, 8, 7, 6, 5];
  private permutations: number[][];

  constructor() {
    this.filePath = path.join(__dirname, '../input', 'testinput.txt');
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

    // app.permutations = [9, 8, 7, 6, 5];

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

      let allRunning = false;
      let prevOutput = 0;

      do {
        ampA.input.push(prevOutput);
        ampA.run();
        prevOutput = ampA.output;

        ampB.input.push(prevOutput);
        ampB.run();
        prevOutput = ampB.output;

        ampC.input.push(prevOutput);
        ampC.run();
        prevOutput = ampC.output;

        ampD.input.push(prevOutput);
        ampD.run();
        prevOutput = ampD.output;

        ampE.input.push(prevOutput);
        ampE.run();
        prevOutput = ampE.output;

        ampA.input.push(prevOutput);

        allRunning =
          ampA.isRunning &&
          ampB.isRunning &&
          ampC.isRunning &&
          ampD.isRunning &&
          ampE.isRunning;

        console.log(allRunning);
      } while (allRunning);

      maxOutput = Math.max(prevOutput, maxOutput);

      // phaseSettings.forEach((phaseSetting: number, index: number) => {
      //   const amplifier = new IntCodeComputer([...app.numbers]);

      //   amplifier.output.on('result', (output: number) => {
      //     ampOutput = output;
      //     maxOutput = Math.max(output, maxOutput);
      //   });

      //   amplifier.run([phaseSetting, ampOutput]);
      // });
    });

    console.log(maxOutput);
  }
}

Application.run();
