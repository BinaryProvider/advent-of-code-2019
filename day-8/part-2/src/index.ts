import * as fs from 'fs';
import * as path from 'path';
import { createCanvas } from 'canvas';

export class Application {
  private readonly file: Buffer;
  private readonly filePath: string;
  private readonly runTest = false;

  private imgWidth = this.runTest ? 2 : 25;
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

      if (index % (this.imgHeight * this.imgWidth) === 0) {
        this.layers.push(layer);
        layer = [];
      }

      index++;
    }

    this.layers.reverse();
  }

  private getColor(pixel: number): string | null {
    if (pixel === 0) return 'rgb(0, 0, 0)';
    if (pixel === 1) return 'rgb(255, 255, 255)';
    return null;
  }

  public static run() {
    const app = new Application();

    const canvas = createCanvas(app.imgWidth, app.imgHeight);
    const context = canvas.getContext('2d');

    app.layers.forEach(pixels => {
      let x = 0;
      let y = 0;

      pixels.forEach((pixel, index) => {
        const color = app.getColor(pixel);

        if (color) {
          context.fillStyle = color;
          context.fillRect(x, y, 1, 1);
        }

        if ((index + 1) % app.imgWidth === 0) {
          x = 0;
          y++;
        } else {
          x++;
        }
      });
    });

    fs.writeFileSync('output/image.png', canvas.toBuffer());
  }
}

Application.run();
