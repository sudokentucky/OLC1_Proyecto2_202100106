import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";

export class Truncate extends Instruction {
    private expression: Expression;

    constructor(expression: Expression, line: number, column: number) {
        super(line, column);
        this.expression = expression;
    }

    public execute(environment: Environment): Result {
        const value = this.expression.execute(environment);

        if (value.DataType !== DataType.DECIMAL) {
            throw new Errors("Semántico", "El argumento de la función 'truncate' debe ser de tipo decimal", this.linea, this.columna);
        }

        const truncatedValue = Math.trunc(value.value);
        return { value: truncatedValue, DataType: DataType.ENTERO };
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión que se va a truncar
        const expressionNode = this.expression.generateNode(dotGenerator);
        
        // Crear el nodo principal para la instrucción `Truncate`
        const truncateNode = dotGenerator.addNode("Truncate");
    
        // Conectar el nodo `Truncate` con el nodo de la expresión
        dotGenerator.addEdge(truncateNode, expressionNode);
    
        return truncateNode;
    }
    
    
}
