import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array"; // Asegúrate de importar la clase Arreglo correctamente
import { DotGenerator } from "../Tree/DotGenerator";

export class ToCharArray extends Instruction {
    private expression: Expression;

    constructor(expression: Expression, line: number, column: number) {
        super(line, column);
        this.expression = expression;
    }

    public execute(environment: Environment): Result {
        // Evaluamos la expresión
        const value = this.expression.execute(environment);

        // Verificamos que sea de tipo cadena (STRING)
        if (value.DataType === DataType.STRING) {
            // Convertimos la cadena en un arreglo de caracteres
            const charArray = value.value.split(''); // Convierte la cadena en un arreglo de caracteres

            // Creamos un nuevo Arreglo de tipo CHAR
            const arreglo = new Arreglo<string>(
                "",             // No necesita un ID porque es temporal
                DataType.CHAR,  // Tipo de dato CHAR
                [charArray.length], // Dimensión 1D del tamaño del array de caracteres
                charArray       // Los caracteres individuales
            );

            // Retornamos el arreglo
            return { value: arreglo, DataType: DataType.ARRAY };
        } else {
            throw new Errors("Semántico", "El argumento de la función 'toCharArray' debe ser de tipo cadena", this.linea, this.columna);
        }
    }

    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión que se convertirá a un arreglo de caracteres
        const expressionNode = this.expression.generateNode(dotGenerator);
        
        // Crear el nodo principal para la instrucción `ToCharArray`
        const toCharArrayNode = dotGenerator.addNode("ToCharArray");
    
        // Conectar el nodo `ToCharArray` con el nodo de la expresión
        dotGenerator.addEdge(toCharArrayNode, expressionNode);
    
        return toCharArrayNode;
    }
}
