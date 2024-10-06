import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { Case } from "./case";
import { Default } from "./default";
import { Break } from "./transfer";
import { DotGenerator } from "../Tree/DotGenerator";

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
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión del `switch`
        const expressionNode = this.expression.generateNode(dotGenerator);
        
        // Crear el nodo principal para el `Switch`
        const switchNode = dotGenerator.addNode("Switch");
    
        // Conectar el nodo `Switch` con el nodo de la expresión
        dotGenerator.addEdge(switchNode, expressionNode);
    
        // Generar y conectar los nodos para los casos del `switch`
        for (const caseBlock of this.cases) {
            const caseNode = caseBlock.generateNode(dotGenerator);
            dotGenerator.addEdge(switchNode, caseNode);
        }
    
        // Generar y conectar el nodo para el bloque `default`, si existe
        if (this.defaultCase) {
            const defaultNode = this.defaultCase.generateNode(dotGenerator);
            dotGenerator.addEdge(switchNode, defaultNode);
        }
    
        return switchNode;
    }
    
    
}
