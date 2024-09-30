// Importa la clase Environment desde el archivo environment.ts en el directorio Environment
import { Environment } from "../Environment/environment";

/**
 * Clase abstracta que define una instrucción.
 * Esta clase sirve como base para todas las instrucciones que se puedan definir.
 */
export abstract class Instruction {
    // Línea en la que se encuentra la instrucción en el código fuente
    public linea: number;
    // Columna en la que se encuentra la instrucción en el código fuente
    public columna: number;

    /**
     * Constructor de la clase Instruction.
     * @param linea - Número de línea en el código fuente donde se encuentra la instrucción.
     * @param columna - Número de columna en el código fuente donde se encuentra la instrucción.
     */
    constructor(linea: number, columna: number) {
        this.linea = linea;
        this.columna = columna;
    }

    /**
     * Método abstracto que ejecuta una instrucción.
     * Este método debe ser implementado por las clases que hereden de Instruction.
     * @param entorno - El entorno en el que se ejecuta la instrucción.
     * @returns El resultado de la ejecución de la instrucción.
     */
    public abstract execute(entorno: Environment): any;
}