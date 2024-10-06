import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { Break } from "./transfer";
import { DotGenerator } from "../Tree/DotGenerator";
export class Case extends Instruction {
    private expression: Expression;
    private instructions: Instruction[];

    constructor(expression: Expression, instructions: Instruction[], line: number, column: number) {
        super(line, column);
        this.expression = expression;
        this.instructions = instructions;
    }

    /**
     * Método que devuelve la expresión del `case`.
     * 
     * @returns La expresión que se evalúa en el `case`.
     */
    public getExpression(): Expression {
        return this.expression;
    }

    /**
     * Ejecuta las instrucciones asociadas al `case`.
     * 
     * @param environment - El entorno donde se ejecutarán las instrucciones.
     * @returns El resultado de la ejecución, o un `Break` si se encuentra un `break`.
     */
    public execute(environment: Environment): any {
        for (const instruction of this.instructions) {
            const result = instruction.execute(environment);

            // Si encontramos un break, lo devolvemos para que el switch lo maneje
            if (result instanceof Break) {
                return result;
            }
        }
    }

    /**
     * Genera el nodo DOT para el `case`.
     * 
     * @param ast - Referencia al AST que contiene el contador de nodos.
     * @returns string - Representación en formato DOT del nodo del `case`.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión del `case`
        const expressionNode = this.expression.generateNode(dotGenerator);
    
        // Crear el nodo principal del `case`
        const caseNode = dotGenerator.addNode(`Case`);
    
        // Conectar el nodo del `case` con el nodo de la expresión
        dotGenerator.addEdge(caseNode, expressionNode);
    
        // Generar y conectar los nodos para las instrucciones del `case`
        for (const instruction of this.instructions) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(caseNode, instructionNode); // Conectar cada nodo de instrucción al nodo del `case`
        }
    
        return caseNode;
    }
    
}
