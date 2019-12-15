import { IntCodeComputer } from './intcode-computer';
import * as fs from 'fs';
import * as path from 'path';

export class Application {
  private readonly file: Buffer;
  private readonly filePath: string;
  private readonly runTest = false;

  private numbers: number[];

  constructor() {
    this.filePath = path.join(
      __dirname,
      '../input',
      this.runTest ? 'testinput.txt' : 'input.txt'
    );
    this.file = fs.readFileSync(this.filePath);

    this.numbers = this.file
      .toString()
      .split(',')
      .map(Number);

    const computer = new IntCodeComputer([...this.numbers]);
    computer.input.push(1);
    computer.run();

    console.log(computer.output.join(','));
  }

  public static run() {
    const app = new Application();
  }
}

Application.run();
