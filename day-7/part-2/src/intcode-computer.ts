export enum OperationCode {
  ADD = 1,
  MULTIPLY = 2,
  SAVE = 3,
  OUTPUT = 4,
  JUMP_IF_TRUE = 5,
  JUMP_IF_FALSE = 6,
  LESS_THAN = 7,
  EQUALS = 8,
  EXIT = 99
}

export interface Instruction {
  opCode: number;
  mode1: boolean;
  mode2: boolean;
  mode3: boolean;
  length: number;
}

export interface ParameterCount {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
}

export interface Operations {
  1: (paramMode: boolean[], input?: number) => number;
  2: (paramMode: boolean[], input?: number) => number;
  3: (paramMode: boolean[], input?: number) => number;
  4: (paramMode: boolean[], input?: number) => number;
  5: (paramMode: boolean[], input?: number) => number;
  6: (paramMode: boolean[], input?: number) => number;
  7: (paramMode: boolean[], input?: number) => number;
  8: (paramMode: boolean[], input?: number) => number;
}

export class IntCodeComputer {
  public output: number = NaN;
  public input: number[] = [];
  public isRunning: boolean = false;
  public isPaused: boolean = false;

  private pointer: number = 0;
  private operations: Operations;
  private paramCount: ParameterCount;

  constructor(private numbers: number[]) {
    this.operations = {
      1: (paramMode, _input) => this.add(paramMode),
      2: (paramMode, _input) => this.multiply(paramMode),
      3: (paramMode, input) => this.save(paramMode, input),
      4: (paramMode, _input) => this.emitOutput(paramMode),
      5: (paramMode, _input) => this.jumpIfTrue(paramMode),
      6: (paramMode, _input) => this.jumpIfFalse(paramMode),
      7: (paramMode, _input) => this.lessThan(paramMode),
      8: (paramMode, _input) => this.equals(paramMode)
    };

    this.paramCount = {
      1: 3,
      2: 3,
      3: 1,
      4: 1,
      5: 2,
      6: 2,
      7: 3,
      8: 3
    };
  }

  public run() {
    this.isRunning = true;
    this.isPaused = false;

    do {
      const instruction = this.parseInstruction(this.numbers[this.pointer]);

      let jumpCursor = NaN;
      let instructionCursor = instruction.length + 1;

      if (
        instruction.opCode === OperationCode.EXIT ||
        isNaN(instruction.opCode)
      ) {
        this.isRunning = false;
      } else {
        if (
          instruction.opCode === OperationCode.SAVE &&
          this.input.length === 0
        ) {
          this.isPaused = true;
          break;
        }
        jumpCursor = this.processInstruction(instruction, this.input.pop());
      }

      if (isNaN(jumpCursor)) {
        this.pointer += instructionCursor;
      } else {
        this.pointer = jumpCursor;
      }

      if (instruction.opCode === OperationCode.OUTPUT) {
        this.isPaused = true;
      }
    } while (this.isRunning && !this.isPaused);
  }

  private parseInstruction(instruction: number): Instruction {
    const params: number[] = (new Array(5).join('0') + instruction)
      .slice(-5)
      .split('')
      .map(Number)
      .reverse();

    const opCode: number = Number(params[1] + params[0]);
    const mode1: boolean = Boolean(params[2]);
    const mode2: boolean = Boolean(params[3]);
    const mode3: boolean = Boolean(params[4]);

    const key = opCode as keyof ParameterCount;
    const length: number = this.paramCount[key];

    return {
      opCode,
      mode1,
      mode2,
      mode3,
      length
    };
  }

  private processInstruction(
    instruction: Instruction,
    input: number | undefined
  ): number {
    const opCode = instruction.opCode as keyof Operations;

    if (this.operations[opCode]) {
      return this.operations[opCode](
        [instruction.mode1, instruction.mode2, instruction.mode3],
        input
      );
    }

    return NaN;
  }

  private getParam(input: number, byVal?: boolean, writeParam?: boolean) {
    byVal = writeParam ? true : byVal;
    const param = byVal ? input : this.numbers[input];
    return param;
  }

  private add(paramMode: boolean[]): number {
    const p1 = this.getParam(this.numbers[this.pointer + 1], paramMode[0]);
    const p2 = this.getParam(this.numbers[this.pointer + 2], paramMode[1]);
    const writeAddress = this.numbers[this.pointer + 3];
    const output = p1 + p2;
    this.numbers[writeAddress] = output;
    return NaN;
  }

  private multiply(paramMode: boolean[]): number {
    const p1 = this.getParam(this.numbers[this.pointer + 1], paramMode[0]);
    const p2 = this.getParam(this.numbers[this.pointer + 2], paramMode[1]);
    const writeAddress = this.numbers[this.pointer + 3];
    const output = p1 * p2;
    this.numbers[writeAddress] = output;
    return NaN;
  }

  private save(paramMode: boolean[], input?: number): number {
    const address = this.getParam(this.numbers[this.pointer + 1], true);
    if (input !== null && input !== undefined) this.numbers[address] = input;
    return NaN;
  }

  private emitOutput(paramMode: boolean[]): number {
    const value = this.getParam(this.numbers[this.pointer + 1], paramMode[0]);
    this.output = value;
    return NaN;
  }

  private jumpIfTrue(paramMode: boolean[]): number {
    const p1 = this.getParam(this.numbers[this.pointer + 1], paramMode[0]);
    const p2 = this.getParam(this.numbers[this.pointer + 2], paramMode[1]);
    if (p1 !== 0) return p2;
    return NaN;
  }

  private jumpIfFalse(paramMode: boolean[]): number {
    const p1 = this.getParam(this.numbers[this.pointer + 1], paramMode[0]);
    const p2 = this.getParam(this.numbers[this.pointer + 2], paramMode[1]);
    if (p1 === 0) return p2;
    return NaN;
  }

  private lessThan(paramMode: boolean[]): number {
    const p1 = this.getParam(this.numbers[this.pointer + 1], paramMode[0]);
    const p2 = this.getParam(this.numbers[this.pointer + 2], paramMode[1]);
    const writeAddress = this.numbers[this.pointer + 3];
    const value = p1 < p2 ? 1 : 0;
    this.numbers[writeAddress] = value;
    return NaN;
  }

  private equals(paramMode: boolean[]): number {
    const p1 = this.getParam(this.numbers[this.pointer + 1], paramMode[0]);
    const p2 = this.getParam(this.numbers[this.pointer + 2], paramMode[1]);
    const writeAddress = this.numbers[this.pointer + 3];
    const value = p1 === p2 ? 1 : 0;
    this.numbers[writeAddress] = value;
    return NaN;
  }
}
