// Importa las dependencias necesarias
import { Environment } from "../Environment/environment"; // Entorno donde se ejecutan y almacenan las expresiones
import { Result } from "../expression/types"; // Resultado de la evaluación de la expresión, incluyendo valor y tipo de dato

/**
 * Clase abstracta que representa una expresión en el lenguaje.
 * Las expresiones son unidades de código que, cuando se evalúan, devuelven un valor.
 * Esta clase es abstracta porque define la estructura que las subclases deben seguir, pero no implementa directamente el método `execute`.
 */
export abstract class Expression {
    protected linea: number;   // Número de línea donde se encuentra la expresión en el código fuente
    protected columna: number; // Número de columna donde se encuentra la expresión en el código fuente

    /**
     * Constructor de la clase `Expression`.
     * @param linea - La línea de código donde se define la expresión (para manejo de errores y depuración).
     * @param columna - La columna de código donde se define la expresión (para manejo de errores y depuración).
     */
    constructor(linea: number, columna: number) {
        this.linea = linea;   // Asigna la línea donde se encuentra la expresión
        this.columna = columna; // Asigna la columna donde se encuentra la expresión
    }

    /**
     * Método abstracto que debe ser implementado por todas las clases que hereden de `Expression`.
     * Evaluar la expresión y devolver un resultado.
     * 
     * @param entorno - El entorno actual donde se evaluará la expresión, permitiendo acceso a variables y funciones.
     * @returns Result - El valor resultante de la evaluación de la expresión, que incluye tanto el valor como el tipo de dato.
     * 
     * Las clases derivadas deben implementar este método según el tipo de expresión que representan (por ejemplo, una constante, una operación aritmética, etc.).
     */
    public abstract execute(entorno: Environment): Result;
}
