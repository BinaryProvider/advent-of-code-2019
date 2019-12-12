import { IntCodeComputer } from './intcode-computer';
import { PermutationGenerator } from './permutation-generator';
import * as fs from 'fs';
import * as path from 'path';

export class Application {
  private file: Buffer;
  private filePath: string;
  private numbers: number[];
  private phaseSettingSequence = [1, 0, 4, 3, 2];
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

    app.permutations.forEach((phaseSettings: number[]) => {
      let ampOutput = 0;

      phaseSettings.forEach((phaseSetting: number) => {
        const amplifier = new IntCodeComputer([...app.numbers]);

        amplifier.output.on('result', (output: number) => {
          ampOutput = output;
          maxOutput = Math.max(output, maxOutput);
        });

        amplifier.run([phaseSetting, ampOutput]);
      });
    });

    console.log(maxOutput);
  }
}

Application.run();
