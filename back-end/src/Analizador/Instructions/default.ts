import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";

export class Default extends Instruction {
    private instructions: Instruction[];

    constructor(instructions: Instruction[], line: number, column: number) {
        super(line, column);
        this.instructions = instructions;
    }

    public execute(environment: Environment): any {
        for (const instruction of this.instructions) {
            instruction.execute(environment);
        }
    }
}
