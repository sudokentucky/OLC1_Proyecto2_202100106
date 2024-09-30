import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { Case } from "./case";
import { Default } from "./default";
import { Break } from "./transfer";

export class Switch extends Instruction {
    private expression: Expression;
    private cases: Case[];
    private defaultCase: Default | null;

    constructor(expression: Expression, cases: Case[], defaultCase: Default | null, line: number, column: number) {
        super(line, column);
        this.expression = expression;
        this.cases = cases;
        this.defaultCase = defaultCase;
    }

    public execute(environment: Environment): any {
        const switchValue = this.expression.execute(environment);

        let caseMatched = false;

        for (const caseBlock of this.cases) {
            const caseValue = caseBlock.getExpression().execute(environment);

            if (switchValue.value === caseValue.value || caseMatched) {
                caseMatched = true; // Continuar ejecutando si un case ya ha sido coincidente
                const result = caseBlock.execute(environment);

                // Si encontramos un `break`, salimos del switch
                if (result instanceof Break) {
                    return;
                }
            }
        }

        // Si no se encontró un break y tenemos un bloque default
        if (!caseMatched && this.defaultCase) {
            return this.defaultCase.execute(environment);
        }
    }
}
