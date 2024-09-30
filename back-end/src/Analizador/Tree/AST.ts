// Importa las clases necesarias para manejar el entorno y las instrucciones
import { Environment } from "../Environment/environment"; // Entorno donde se ejecutan las instrucciones
import { Instruction } from "../abstract/instruction"; // Clase base para todas las instrucciones

// Define una variable global que simula una consola donde se almacenan los mensajes generados durante la ejecución
let consola: string[] = [];
/**
 * Clase que define un AST (Árbol de Sintaxis Abstracta).
 * El AST es una representación de la estructura sintáctica de un programa, donde las instrucciones están organizadas jerárquicamente.
 */
export class AST {
    private globalEnv: Environment | null = null; // Almacena el entorno global

    /**
     * Constructor de la clase AST.
     * 
     * @param instructions - Un arreglo de instrucciones que representa el programa a ser interpretado.
     */
    constructor(private instructions: Instruction[]) {}

    /**
     * Método que interpreta el AST.
     * Recorre cada una de las instrucciones almacenadas en el AST y las ejecuta dentro de un entorno global.
     * Si se produce algún error durante la ejecución de una instrucción, se captura y se muestra en la consola.
     * 
     * @returns string - Retorna el contenido actual de la consola (los mensajes generados durante la ejecución).
     */
    interpreter(): string[] {  // Cambiamos el tipo de retorno a un array de strings
        this.globalEnv = new Environment(null); // Crea un entorno global sin entorno padre
        consola = []; // Limpia la consola en cada interpretación

        for (const instruction of this.instructions) {
            try {
                instruction.execute(this.globalEnv); // Ejecuta cada instrucción en el entorno global
            } catch (error) {
                console.error(error); // Captura y muestra errores
            }
        }

        return consola;  // Retorna todos los mensajes de la consola
    }

    /**
     * Método para obtener el entorno global después de la ejecución del AST.
     * 
     * @returns Environment | null - El entorno global o null si aún no ha sido inicializado.
     */
    getGlobalEnvironment(): Environment | null {
        return this.globalEnv;
    }
}

/**
 * Función que agrega un mensaje a la consola.
 * Esta función se utiliza para simular la salida de la consola donde se registran los mensajes generados durante la ejecución del programa.
 * 
 * @param value - El valor que se desea agregar a la consola.
 */
export function setConsole(value: any) {
    consola.push(value);  // Agrega el mensaje al array en lugar de sobrescribirlo
}
