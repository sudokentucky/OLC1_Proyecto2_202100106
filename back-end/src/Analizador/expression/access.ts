import { Environment } from "../Environment/environment"; // El entorno donde se almacenan las variables
import { Expression } from "../abstract/expression"; // Clase base para las expresiones
import { Result } from "./types"; // Tipo que representa el resultado de una expresión
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";
/**
 * Clase que representa el acceso a una variable en el entorno de ejecución.
 * Hereda de la clase `Expression`, lo que indica que es una expresión evaluable.
 */
export class Access extends Expression {
    /**
     * Constructor de la clase `Access`.
     * @param id - El identificador (nombre) de la variable a la que se desea acceder.
     * @param line - La línea en el código fuente donde ocurre el acceso (para manejo de errores y depuración).
     * @param column - La columna en el código fuente donde ocurre el acceso (para manejo de errores y depuración).
     */
    constructor(private id: string, line: number, column: number) {
        super(line, column); // Llama al constructor de la clase padre (Expression)
    }

    /**
     * Método que ejecuta el acceso a una variable en el entorno de ejecución.
     * Busca la variable por su nombre (id) en el entorno actual. Si la variable existe, retorna su valor.
     * Si la variable no se encuentra, lanza un error.
     * 
     * @param environment - El entorno de ejecución donde se buscará la variable.
     * @returns Result - Un objeto que contiene el valor de la variable y su tipo de dato.
     * @throws Error - Si la variable no existe en el entorno.
     */
    public execute(environment: Environment): Result {
        // Busca la variable en el entorno actual o en los entornos padres
        const variable = environment.GetVariable(this.id);

        // Si la variable es encontrada, retorna su valor y tipo de dato
        if (variable) {
            return { value: variable.getValor(), DataType: variable.DataType };
        }else{

        // Si la variable no se encuentra, lanza un error
        throw Errors.addError("Semántico", `La variable ${this.id} no existe en el entorno actual`, this.linea, this.columna);
        }
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear un nodo para el acceso a la variable con su identificador
        const accessNode = dotGenerator.addNode(`Access: ${this.id}`);

        // Retorna el identificador del nodo creado
        return accessNode;
    }
    
}
