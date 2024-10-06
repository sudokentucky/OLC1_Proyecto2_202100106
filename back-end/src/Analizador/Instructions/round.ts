import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";

export class Round extends Instruction {
    private expression: Expression;

    constructor(expression: Expression, line: number, column: number) {
        super(line, column);
        this.expression = expression;
    }

    public execute(environment: Environment): Result {
        const value = this.expression.execute(environment);

        if (value.DataType !== DataType.DECIMAL) {
            throw new Errors("Semántico", "El argumento de la función 'round' debe ser de tipo decimal", this.linea, this.columna);
        }

        const roundedValue = Math.round(value.value);
        return { value: roundedValue, DataType: DataType.ENTERO };
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión que se va a redondear
        const expressionNode = this.expression.generateNode(dotGenerator);
        
        // Crear el nodo principal para la instrucción `Round`
        const roundNode = dotGenerator.addNode("Round");
    
        // Conectar el nodo `Round` con el nodo de la expresión
        dotGenerator.addEdge(roundNode, expressionNode);
    
        return roundNode;
    }
    
    
}
