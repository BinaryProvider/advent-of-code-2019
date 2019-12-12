export class PermutationGenerator {
  public permutations: Array<number>[] = [];

  constructor(private numbers: number[]) {
    this.generate(this.numbers.length);
  }

  private generate(length: number): void {
    if (length == 1) {
      this.permutations.push([...this.numbers]);
      return;
    }

    for (let i = 0; i < length; i += 1) {
      this.generate(length - 1);

      if (length % 2 == 0) {
        this.swap(this.numbers, i, length - 1);
      } else {
        this.swap(this.numbers, 0, length - 1);
      }
    }
  }

  private swap(collection: number[], indexA: number, indexB: number) {
    var tmp = collection[indexA];
    collection[indexA] = collection[indexB];
    collection[indexB] = tmp;
  }
}
