import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

export interface Asteroid {
  name: string;
  x: number;
  y: number;
}

export enum SpaceEntity {
  Asteroid = '#',
  Void = '.'
}

export class Application {
  private readonly filePath: string;
  private readonly runTest = false;

  private grid: string[][] = [];
  private asteroids: Asteroid[] = [];

  public static run() {
    const app = new Application();
  }

  constructor() {
    this.filePath = path.join(
      __dirname,
      '../input',
      this.runTest ? 'testinput.txt' : 'input.txt'
    );

    const rl = readline.createInterface({
      input: fs.createReadStream(this.filePath),
      output: process.stdout,
      terminal: false
    });

    let y = 0;

    rl.on('line', (line: string) => {
      const row = line.split('');

      row.forEach((_char: string, x: number) => {
        if (row[x] === SpaceEntity.Asteroid) {
          const name = this.generateDesignation();
          row[x] = name;
          this.asteroids.push({ x, y, name });
        }
      });

      this.grid.push(row);

      y++;
    });

    rl.on('close', () => {
      const result = this.identifyBestLocation(this.grid);
      console.log('x:', result.x, 'y:', result.y, 'count:', result.count);
    });
  }

  private generateDesignation(): string {
    return [...Array(4)]
      .map(i => (~~(Math.random() * 36)).toString(36))
      .join('');
  }

  private identifyBestLocation(grid: string[][]): any {
    let maxAsteroids = 0;
    let bestLocation: Asteroid | undefined;

    this.asteroids.forEach(asteroid => {
      const relativeAsteroids = this.findAsteroidsRelativeTo(asteroid);
      const visibleAsteroids = this.findVisibleAsteroidsFrom(
        asteroid,
        relativeAsteroids
      );

      if (visibleAsteroids.length > maxAsteroids) {
        maxAsteroids = visibleAsteroids.length;
        bestLocation = asteroid;
      }
    });

    return {
      x: bestLocation!.x,
      y: bestLocation!.y,
      count: maxAsteroids
    };
  }

  private findAsteroidsRelativeTo(
    baseAsteroid: Asteroid
  ): Record<number, Asteroid[]> {
    const relativePositions: Record<string, Asteroid> = {};
    const asteroidsOnAngle: Record<number, Asteroid[]> = {};

    this.asteroids.forEach(asteroid => {
      relativePositions[asteroid.name] = {
        name: asteroid.name,
        x: asteroid.x - baseAsteroid.x,
        y: asteroid.y - baseAsteroid.y
      };
    });

    delete relativePositions[baseAsteroid.name];

    Object.keys(relativePositions).forEach((name, index) => {
      const asteroid = relativePositions[name];
      const angle = (Math.atan2(asteroid.y, asteroid.x) * 180) / Math.PI;

      let asteroids = asteroidsOnAngle[angle];

      if (!asteroids) {
        asteroidsOnAngle[angle] = [asteroid];
      } else {
        asteroids.push(asteroid);
      }
    });

    return asteroidsOnAngle;
  }

  private findVisibleAsteroidsFrom(
    baseAsteroid: Asteroid,
    asteroidsOnAngle: Record<number, Asteroid[]>
  ): Asteroid[] {
    const visibleAsteroids: Asteroid[] = [];

    Object.keys(asteroidsOnAngle).forEach((angle: string) => {
      const asteroids = asteroidsOnAngle[+angle];
      visibleAsteroids.push(
        asteroids.sort((_a, b) => this.distanceBetween(baseAsteroid, b))[0]
      );
    });

    return visibleAsteroids;
  }

  private distanceBetween(a: Asteroid, b: Asteroid): number {
    const x = a.x - b.x;
    const y = a.y - b.y;
    return Math.max(Math.abs(x), Math.abs(y));
  }
}

Application.run();
