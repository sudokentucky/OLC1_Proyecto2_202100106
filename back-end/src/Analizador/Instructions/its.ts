import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import { DotGenerator } from "../Tree/DotGenerator";

export class Is extends Instruction {
    private expression: Expression;
    private tipo: DataType;

    constructor(expression: Expression, tipo: DataType, line: number, column: number) {
        super(line, column);
        this.expression = expression;
        this.tipo = tipo;
    }

    public execute(environment: Environment): Result {
        const value = this.expression.execute(environment);

        const isType = value.DataType === this.tipo;
        return { value: isType, DataType: DataType.BOOLEANO };
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión que se va a evaluar
        const expressionNode = this.expression.generateNode(dotGenerator);
        
        // Crear el nodo principal para la instrucción `Is` con el tipo de dato
        const isNode = dotGenerator.addNode(`Is: ${DataType[this.tipo]}`);
    
        // Conectar el nodo `Is` con el nodo de la expresión
        dotGenerator.addEdge(isNode, expressionNode);
    
        return isNode;
    }
    
    
}
