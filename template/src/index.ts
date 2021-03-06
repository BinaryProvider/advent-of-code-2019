import * as fs from 'fs';
import * as path from 'path';

export class Application {
  private readonly file: Buffer;
  private readonly filePath: string;
  private readonly runTest = false;

  public static run() {
    const app = new Application();
  }

  constructor() {
    this.filePath = path.join(
      __dirname,
      '../input',
      this.runTest ? 'testinput.txt' : 'input.txt'
    );
    this.file = fs.readFileSync(this.filePath);
  }
}

Application.run();
