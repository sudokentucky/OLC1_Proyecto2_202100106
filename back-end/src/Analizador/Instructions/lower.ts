import { Expression } from "../abstract/expression";  // Importamos la clase base para expresiones
import { Instruction } from "../abstract/instruction";  // Importamos la clase base para instrucciones
import { Environment } from "../Environment/environment";  // Importamos el entorno
import { DataType, Result } from "../expression/types";  // Importamos los tipos de datos y resultados
import Errors from "../Error/error";  // Importamos el manejador de errores
import { DotGenerator } from "../Tree/DotGenerator";
/**
 * Clase `Lower` que representa la función nativa lower, la cual convierte una cadena a minúsculas.
 */
export class Lower extends Instruction {
    private expression: Expression;  // La expresión que se evaluará y convertirá a minúsculas

    /**
     * Constructor de la clase `Lower`.
     * 
     * @param expression - La expresión de tipo cadena que se convertirá a minúsculas.
     * @param line - La línea del código donde se llama a la función.
     * @param column - La columna del código donde se llama a la función.
     */
    constructor(expression: Expression, line: number, column: number) {
        super(line, column);  // Llamada al constructor de la clase base Instruction
        this.expression = expression;
    }

    /**
     * Método `execute` que ejecuta la función lower.
     * 
     * Este método evalúa la expresión y convierte el valor de la cadena a minúsculas.
     * 
     * @param environment - El entorno de ejecución actual donde se encuentran las variables y funciones accesibles.
     * @returns Un resultado de tipo cadena con todas las letras en minúsculas.
     */
    public execute(environment: Environment): Result {
        // Evaluamos la expresión para obtener su valor
        const value = this.expression.execute(environment);

        // Verificamos que el valor sea de tipo cadena
        if (value.DataType !== DataType.STRING) {
            throw new Errors("Semántico", "El argumento de la función 'lower' debe ser de tipo cadena", this.linea, this.columna);
        }

        // Convertimos la cadena a minúsculas
        const lowerCaseValue = value.value.toLowerCase();

        // Retornamos el nuevo valor en minúsculas
        return { value: lowerCaseValue, DataType: DataType.STRING };
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión que se va a convertir a minúsculas
        const expressionNode = this.expression.generateNode(dotGenerator);
        
        // Crear el nodo principal para la instrucción `Lower`
        const lowerNode = dotGenerator.addNode("Lower");
    
        // Conectar el nodo `Lower` con el nodo de la expresión
        dotGenerator.addEdge(lowerNode, expressionNode);
    
        return lowerNode;
    }
    
    
}
