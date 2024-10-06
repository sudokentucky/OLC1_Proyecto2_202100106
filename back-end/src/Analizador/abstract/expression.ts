import { Environment } from "../Environment/environment";  // Entorno donde se ejecutan las expresiones
import { Result } from "../expression/types"; 
import { DotGenerator } from "../Tree/DotGenerator";             // Resultado de la evaluación de la expresión

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
     */
    public abstract execute(entorno: Environment): Result;

    /**
     * Método general para generar nodos en formato DOT para Graphviz.
     * Este método puede ser reutilizado por cualquier expresión para crear su nodo.
     * 
     * @param ast - Referencia al AST, que contiene el contador de nodos.
     * @param label - La etiqueta que se mostrará en el nodo.
     * @param children - Los nodos hijos conectados a este nodo (opcional).
     * @returns string - Representación en formato DOT del nodo y sus conexiones.
     */
    /**
     * Método abstracto para generar el nodo DOT de la expresión.
     * Este método debe ser implementado por cada subclase de `Expression`.
     * 
     * @param ast - Referencia al AST que contiene el contador de nodos.
     * @returns string - Representación en formato DOT de la expresión.
     */
    public abstract generateNode(dotGenerator: DotGenerator): string;
}