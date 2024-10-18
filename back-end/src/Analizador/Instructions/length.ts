import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array"; // Asegúrate de importar correctamente la clase Arreglo
import { DotGenerator } from "../Tree/DotGenerator";

export class Length extends Instruction {
    private expression: Expression;

    constructor(expression: Expression, line: number, column: number) {
        super(line, column);
        this.expression = expression;
    }

    public execute(environment: Environment): Result {
        // Evaluamos la expresión
        const value = this.expression.execute(environment);

        // Si es una cadena (STRING), calculamos la longitud de la cadena
        if (value.DataType === DataType.STRING) {
            return { value: value.value.length, DataType: DataType.ENTERO };
        }
        // Si es un arreglo nativo de JavaScript, calculamos la longitud
        else if (Array.isArray(value.value)) {
            return { value: value.value.length, DataType: DataType.ENTERO };
        }
        // Si es una instancia de la clase Arreglo, usamos su método getLength
        else if (value.value instanceof Arreglo) {
            const arreglo = value.value as Arreglo<any>; // Convertimos value a Arreglo
            return { value: arreglo.getLength(), DataType: DataType.ENTERO };
        } else {
            throw new Errors("Semántico", "El argumento de la función 'len' debe ser de tipo cadena, vector o arreglo", this.linea, this.columna);
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
