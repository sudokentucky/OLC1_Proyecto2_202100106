import { Environment } from "../Environment/environment";
import { DotGenerator } from '../Tree/DotGenerator';

/**
 * Clase abstracta que define una instrucción.
 * Esta clase sirve como base para todas las instrucciones que se puedan definir.
 */
export abstract class Instruction {
    public linea: number;  // Línea en la que se encuentra la instrucción en el código fuente
    public columna: number; // Columna en la que se encuentra la instrucción en el código fuente

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

    /**
     * Método abstracto que genera el nodo DOT específico para cada instrucción.
     * Cada instrucción debe implementar este método para generar su representación en el AST.
     * @param dotGenerator - Instancia del DotGenerator, que se utiliza para crear nodos y conexiones.
     * @returns string - El identificador del nodo generado en el DOT.
     */
    public abstract generateNode(dotGenerator: DotGenerator): string;
}
