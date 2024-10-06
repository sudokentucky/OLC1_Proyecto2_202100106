import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";

export class Length extends Instruction {
    private expression: Expression;

    constructor(expression: Expression, line: number, column: number) {
        super(line, column);
        this.expression = expression;
    }

    public execute(environment: Environment): Result {
        const value = this.expression.execute(environment);

        if (value.DataType === DataType.STRING) {
            return { value: value.value.length, DataType: DataType.ENTERO };
        } else if (Array.isArray(value.value)) {
            return { value: value.value.length, DataType: DataType.ENTERO };
        } else {
            throw new Errors("Semántico", "El argumento de la función 'len' debe ser de tipo cadena o vector", this.linea, this.columna);
        }
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión cuyo length se va a calcular
        const expressionNode = this.expression.generateNode(dotGenerator);
        
        // Crear el nodo principal para la instrucción `Length`
        const lengthNode = dotGenerator.addNode("Length");
    
        // Conectar el nodo `Length` con el nodo de la expresión
        dotGenerator.addEdge(lengthNode, expressionNode);
    
        return lengthNode;
    }
    
}
