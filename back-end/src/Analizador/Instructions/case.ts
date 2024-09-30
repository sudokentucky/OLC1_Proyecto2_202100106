import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { Break } from "./transfer";

export class Case extends Instruction {
    private expression: Expression;
    private instructions: Instruction[];

    constructor(expression: Expression, instructions: Instruction[], line: number, column: number) {
        super(line, column);
        this.expression = expression;
        this.instructions = instructions;
    }

    public getExpression(): Expression {
        return this.expression;
    }

    public execute(environment: Environment): any {
        for (const instruction of this.instructions) {
            const result = instruction.execute(environment);

            // Si encontramos un break, lo devolvemos para que el switch lo maneje
            if (result instanceof Break) {
                return result;
            }
        }
    }
}
