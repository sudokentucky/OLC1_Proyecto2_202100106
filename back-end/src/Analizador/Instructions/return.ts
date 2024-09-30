import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { Result } from "../expression/types";

export class Return extends Instruction {
    private expression: Expression | null; // Expresión opcional para retornar un valor

    constructor(expression: Expression | null, line: number, column: number) {
        super(line, column);
        this.expression = expression;
    }

    public execute(environment: Environment): any {
        let value: Result | null = null;
        
        // Si existe una expresión, la evaluamos
        if (this.expression) {
            value = this.expression.execute(environment);
        }

        // Retornamos el valor (o null si no hay expresión)
        return { type: "Return", value: value };
    }
}
