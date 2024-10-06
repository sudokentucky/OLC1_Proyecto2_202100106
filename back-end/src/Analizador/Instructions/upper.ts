import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";

export class Upper extends Instruction {
    private expression: Expression;

    constructor(expression: Expression, line: number, column: number) {
        super(line, column);
        this.expression = expression;
    }

    public execute(environment: Environment): Result {
        const value = this.expression.execute(environment);

        if (value.DataType !== DataType.STRING) {
            throw new Errors("Semántico", "El argumento de la función 'upper' debe ser de tipo cadena", this.linea, this.columna);
        }

        const upperCaseValue = value.value.toUpperCase();
        return { value: upperCaseValue, DataType: DataType.STRING };
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión que se va a convertir a mayúsculas
        const expressionNode = this.expression.generateNode(dotGenerator);
        
        // Crear el nodo principal para la instrucción `Upper`
        const upperNode = dotGenerator.addNode("Upper");
    
        // Conectar el nodo `Upper` con el nodo de la expresión
        dotGenerator.addEdge(upperNode, expressionNode);
    
        return upperNode;
    }
    
    
}
