import {
  Operations,
  ParameterCount,
  OperationCode,
  Instruction,
  ParameterMode
} from './models/intcode-computer.models';

export class IntCodeComputer {
  public output: number[] = [];
  public input: number[] = [];
  public isRunning: boolean = false;

  private pointer: number = 0;
  private relativeBase: number = 0;
  private operations: Operations;
  private paramCount: ParameterCount;

  constructor(private memory: number[]) {
    this.memory = this.memory.concat(new Array(100).fill(0));

    this.operations = {
      1: (paramMode, _input) => this.add(paramMode),
      2: (paramMode, _input) => this.multiply(paramMode),
      3: (paramMode, input) => this.save(paramMode, input),
      4: (paramMode, _input) => this.setOutput(paramMode),
      5: (paramMode, _input) => this.jumpIfTrue(paramMode),
      6: (paramMode, _input) => this.jumpIfFalse(paramMode),
      7: (paramMode, _input) => this.lessThan(paramMode),
      8: (paramMode, _input) => this.equals(paramMode),
      9: (paramMode, _input) => this.setRelativeBase(paramMode)
    };

    this.paramCount = {
      1: 3,
      2: 3,
      3: 1,
      4: 1,
      5: 2,
      6: 2,
      7: 3,
      8: 3,
      9: 1
    };
  }

  public run() {
    while (true) {
      const instruction = this.parseInstruction(this.memory[this.pointer]);

      if (instruction.opCode === OperationCode.HALT) {
        break;
      }

      let jumpCursor = this.processInstruction(instruction, this.input[0]);

      if (isNaN(jumpCursor)) {
        this.pointer += instruction.length + 1;
      } else {
        this.pointer = jumpCursor;
      }
    }
  }

  private parseInstruction(instruction: number): Instruction {
    const params: number[] = (new Array(5).join('0') + instruction)
      .slice(-5)
      .split('')
      .map(Number)
      .reverse();

    const opCode: number = +(params[1].toString() + params[0].toString());

    return {
      opCode,
      mode1: params[2],
      mode2: params[3],
      mode3: params[4],
      length: this.paramCount[opCode as keyof ParameterCount]
    };
  }

  private processInstruction(
    instruction: Instruction,
    input: number | undefined
  ): number {
    const operation = this.operations[instruction.opCode as keyof Operations];

    if (operation) {
      return operation(
        [instruction.mode1, instruction.mode2, instruction.mode3],
        input
      );
    }

    return NaN;
  }

  private getValue(index: number, mode: ParameterMode): number {
    switch (mode) {
      case ParameterMode.Position:
        return this.memory[this.memory[index]];
      case ParameterMode.Immediate:
        return this.memory[index];
      case ParameterMode.Relative:
        return this.memory[this.relativeBase + this.memory[index]];
      default:
        throw new Error('Bad parameter mode.');
    }
  }

  private getWritePtr(index: number, mode: ParameterMode): number {
    switch (mode) {
      case ParameterMode.Position:
        return this.memory[index];
      case ParameterMode.Relative:
        return this.relativeBase + this.memory[index];
      default:
        throw new Error('Bad parameter mode.');
    }
  }

  private add(paramMode: ParameterMode[]): number {
    const v1 = this.getValue(this.pointer + 1, paramMode[0]);
    const v2 = this.getValue(this.pointer + 2, paramMode[1]);
    const w3 = this.getWritePtr(this.pointer + 3, paramMode[2]);
    const output = v1 + v2;
    this.memory[w3] = output;
    return NaN;
  }

  private multiply(paramMode: ParameterMode[]): number {
    const v1 = this.getValue(this.pointer + 1, paramMode[0]);
    const v2 = this.getValue(this.pointer + 2, paramMode[1]);
    const w3 = this.getWritePtr(this.pointer + 3, paramMode[2]);
    const output = v1 * v2;
    this.memory[w3] = output;
    return NaN;
  }

  private save(paramMode: ParameterMode[], input?: number): number {
    const w1 = this.getWritePtr(this.pointer + 1, paramMode[0]);
    if (input !== null && input !== undefined) this.memory[w1] = input;
    return NaN;
  }

  private setOutput(paramMode: ParameterMode[]): number {
    const v1 = this.getValue(this.pointer + 1, paramMode[0]);
    this.output.push(v1);
    return NaN;
  }

  private jumpIfTrue(paramMode: ParameterMode[]): number {
    const v1 = this.getValue(this.pointer + 1, paramMode[0]);
    const v2 = this.getValue(this.pointer + 2, paramMode[1]);
    if (v1 !== 0) return v2;
    return NaN;
  }

  private jumpIfFalse(paramMode: ParameterMode[]): number {
    const v1 = this.getValue(this.pointer + 1, paramMode[0]);
    const v2 = this.getValue(this.pointer + 2, paramMode[1]);
    if (v1 === 0) return v2;
    return NaN;
  }

  private lessThan(paramMode: ParameterMode[]): number {
    const v1 = this.getValue(this.pointer + 1, paramMode[0]);
    const v2 = this.getValue(this.pointer + 2, paramMode[1]);
    const w3 = this.getWritePtr(this.pointer + 3, paramMode[2]);
    const value = v1 < v2 ? 1 : 0;
    this.memory[w3] = value;
    return NaN;
  }

  private equals(paramMode: ParameterMode[]): number {
    const v1 = this.getValue(this.pointer + 1, paramMode[0]);
    const v2 = this.getValue(this.pointer + 2, paramMode[1]);
    const w3 = this.getWritePtr(this.pointer + 3, paramMode[2]);
    const value = v1 === v2 ? 1 : 0;
    this.memory[w3] = value;
    return NaN;
  }

  private setRelativeBase(paramMode: ParameterMode[]): number {
    const v1 = this.getValue(this.pointer + 1, paramMode[0]);
    this.relativeBase += v1;
    return NaN;
  }
}
