import { Environment } from "../Environment/environment"; // Importamos el entorno
import { Instruction } from "../abstract/instruction";   // Clase base para las instrucciones
import { Statement } from "./statement";                // Bloque de código que ejecutará la función

/**
 * Clase `Function` que representa una función dentro del entorno de ejecución.
 * 
 * Esta clase define una función que puede ser llamada en cualquier momento. La función contiene un
 * bloque de código (`Statement`) que se ejecutará cuando la función sea invocada. Además, la función
 * puede tener una lista de parámetros que se pasan cuando se invoca.
 */
export class Function extends Instruction {
    /**
     * Constructor de la clase `Function`.
     * 
     * @param id - El nombre (identificador) de la función.
     * @param statement - El bloque de código (`Statement`) que se ejecutará cuando la función sea llamada.
     * @param paramsIDs - Un arreglo que contiene los nombres de los parámetros de la función.
     * @param line - La línea del código donde se define la función.
     * @param column - La columna del código donde se define la función.
     */
    constructor(public id: string, public statement: Statement, public paramsIDs: Array<string>, line: number, column: number) {
        super(line, column); // Llamada al constructor de la clase base Instruction
    }

    /**
     * Método `execute` que guarda la función en el entorno actual.
     * 
     * Este método añade la función al entorno, lo que permite que sea accesible y ejecutable
     * en el futuro. La función se guarda asociada a su identificador (`id`), permitiendo su
     * invocación posterior mediante su nombre.
     * 
     * @param environment - El entorno de ejecución actual (`Environment`) donde se almacenará la función.
     */
    public execute(environment: Environment) {
        // Guarda la función en el entorno actual, asociándola a su identificador `id`.
        environment.guardarFuncion(this.id, this);
    }
}
