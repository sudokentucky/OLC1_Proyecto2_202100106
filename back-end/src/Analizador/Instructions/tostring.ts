import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";

export class ToString extends Instruction {
    private expression: Expression;

    constructor(expression: Expression, line: number, column: number) {
        super(line, column);
        this.expression = expression;
    }

    public execute(environment: Environment): Result {
        const value = this.expression.execute(environment);

        if (value.DataType === DataType.ENTERO || value.DataType === DataType.DECIMAL || value.DataType === DataType.BOOLEANO) {
            return { value: value.value.toString(), DataType: DataType.STRING };
        } else {
            throw new Errors("Semántico", "El argumento de la función 'toString' debe ser de tipo numérico o booleano", this.linea, this.columna);
        }
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión que se va a convertir a cadena
        const expressionNode = this.expression.generateNode(dotGenerator);
        
        // Crear el nodo principal para la instrucción `ToString`
        const toStringNode = dotGenerator.addNode("ToString");
    
        // Conectar el nodo `ToString` con el nodo de la expresión
        dotGenerator.addEdge(toStringNode, expressionNode);
    
        return toStringNode;
    }
    
}
