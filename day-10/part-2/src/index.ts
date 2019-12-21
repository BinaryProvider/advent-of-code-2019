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
      const bestLocation = this.identifyBestLocation();
      this.deployInstantMonitoringStation(bestLocation!);
    });
  }

  private generateDesignation(): string {
    return [...Array(4)]
      .map(i => Math.floor(Math.random() * 36).toString(36))
      .join('');
  }

  private identifyBestLocation(): Asteroid | undefined {
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

    return bestLocation;
  }

  private deployInstantMonitoringStation(asteroid: Asteroid) {
    const baseLocationIndex = this.asteroids.findIndex(
      a => a.x === asteroid.x && a.y === asteroid.y
    );

    this.asteroids.splice(baseLocationIndex, 1);

    const relativeAsteroids = this.findAsteroidsRelativeTo(asteroid);
    let visibleAsteroids: any = [];
    let vaporized: Asteroid[] = [];

    Object.keys(relativeAsteroids).forEach(angle => {
      const asteroidsOnAngle = relativeAsteroids[+angle];
      visibleAsteroids.push([
        +angle,
        asteroidsOnAngle.sort((_a, b) => this.distanceBetween(asteroid, b))[0]
      ]);
    });

    visibleAsteroids = visibleAsteroids.map((x: any) => [
      this.convertAngle(x[0]),
      x[1]
    ]);

    vaporized = visibleAsteroids
      .sort((a: any, b: any) => (a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0))
      .map((x: any) => x[1]);

    vaporized.forEach((a: Asteroid, index: number) => {
      if (index === 199) {
        console.log(
          `${index + 1}. Destroyed asteroid at ${asteroid.x +
            a.x},${asteroid.y + a.y}.`
        );
      }
    });
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

  private convertAngle(angle: number): number {
    angle = angle < 0 ? 360 + angle : angle;
    angle += 91;
    angle = angle > 360 ? angle - 360 : angle;
    angle -= 1;
    return angle;
  }
}

Application.run();
