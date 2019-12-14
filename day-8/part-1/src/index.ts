import * as fs from 'fs';
import * as path from 'path';

export class Application {
  private readonly file: Buffer;
  private readonly filePath: string;
  private readonly runTest = false;

  private imgWidth = this.runTest ? 3 : 25;
  private imgHeight = this.runTest ? 2 : 6;
  private layers: number[][] = [];

  constructor() {
    this.filePath = path.join(
      __dirname,
      '../input',
      this.runTest ? 'testinput.txt' : 'input.txt'
    );
    this.file = fs.readFileSync(this.filePath);

    this.extractLayers();
  }

  private extractLayers(): void {
    const input = this.file.toString();

    let index = 1;
    let layer = [];

    while (index <= input.length) {
      const pixel = +input.charAt(index - 1);
      layer.push(pixel);

      if (index % this.imgWidth === 0) {
        if (index % this.imgHeight === 0) {
          this.layers.push(layer);
          layer = [];
        }
      }

      index++;
    }
  }

  public static run() {
    const app = new Application();

    let minZero: number;
    let result: number | undefined = undefined;

    app.layers.forEach((layer, index) => {
      let numZero = 0;
      let sumOne = 0;
      let sumTwo = 0;

      layer.forEach(pixel => {
        if (pixel === 0) numZero++;
        if (pixel === 1) sumOne++;
        if (pixel === 2) sumTwo++;
      });

      if (!minZero || numZero < minZero) {
        minZero = numZero;
        result = sumOne * sumTwo;
      }
    });

    console.log(result);
  }
}

Application.run();
