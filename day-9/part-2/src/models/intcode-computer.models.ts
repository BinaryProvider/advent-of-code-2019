export enum OperationCode {
  ADD = 1,
  MULTIPLY = 2,
  SAVE = 3,
  OUTPUT = 4,
  JUMP_IF_TRUE = 5,
  JUMP_IF_FALSE = 6,
  LESS_THAN = 7,
  EQUALS = 8,
  SET_RELATIVE_BASE = 9,
  HALT = 99
}

export enum ParameterMode {
  Position = 0,
  Immediate = 1,
  Relative = 2
}

export interface Instruction {
  opCode: number;
  mode1: ParameterMode;
  mode2: ParameterMode;
  mode3: ParameterMode;
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
  9: number;
}

export interface Operations {
  1: (paramMode: ParameterMode[], input?: number) => number;
  2: (paramMode: ParameterMode[], input?: number) => number;
  3: (paramMode: ParameterMode[], input?: number) => number;
  4: (paramMode: ParameterMode[], input?: number) => number;
  5: (paramMode: ParameterMode[], input?: number) => number;
  6: (paramMode: ParameterMode[], input?: number) => number;
  7: (paramMode: ParameterMode[], input?: number) => number;
  8: (paramMode: ParameterMode[], input?: number) => number;
  9: (paramMode: ParameterMode[], input?: number) => number;
}
