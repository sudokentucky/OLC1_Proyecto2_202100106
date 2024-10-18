import { Expression } from "../abstract/expression";  // Ahora hereda de Expression
import { Environment } from "../Environment/environment"; // Entorno donde se ejecuta la expresión
import { DataType, Result } from "../expression/types";  // Tipos y Resultados
import { DotGenerator } from "../Tree/DotGenerator";  // Generador de nodos para representación gráfica

/**
 * Clase Is que representa la verificación de tipo en una expresión.
 * Esta clase es una expresión, no una instrucción, por lo tanto puede usarse dentro de otras expresiones.
 */
export class Is extends Expression {
    private expression: Expression; // Expresión que se va a evaluar
    private tipo: DataType;         // Tipo de dato con el que se va a comparar

    /**
     * Constructor de la clase `Is`.
     * @param expression - La expresión a evaluar.
     * @param tipo - El tipo de dato con el que se va a comparar la expresión evaluada.
     * @param linea - La línea de código donde se encuentra la expresión.
     * @param columna - La columna de código donde se encuentra la expresión.
     */
    constructor(expression: Expression, tipo: DataType, linea: number, columna: number) {
        super(linea, columna);  // Llama al constructor de Expression
        this.expression = expression;
        this.tipo = tipo;
    }

    /**
     * Método `execute` que evalúa la expresión y compara su tipo con el tipo esperado.
     * @param environment - El entorno de ejecución donde se evaluará la expresión.
     * @returns Result - El resultado de la comparación (booleano) y el tipo de dato (booleano).
     */
    public execute(environment: Environment): Result {
        const value = this.expression.execute(environment);  // Ejecuta la expresión y obtiene su valor y tipo
        const isType = value.DataType === this.tipo;         // Compara el tipo de la expresión con el tipo esperado

        // Retorna un objeto Result que contiene el valor booleano y su tipo (BOOLEANO)
        return { value: isType, DataType: DataType.BOOLEANO };
    }

    /**
     * Método para generar el nodo de esta expresión en formato DOT para AST.
     * @param dotGenerator - El generador de nodos para la representación en formato DOT.
     * @returns string - El identificador del nodo generado.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión que se va a evaluar
        const expressionNode = this.expression.generateNode(dotGenerator);

        // Crear el nodo principal para la expresión `Is` con el tipo de dato
        const isNode = dotGenerator.addNode(`Is: ${DataType[this.tipo]}`);

        // Conectar el nodo `Is` con el nodo de la expresión
        dotGenerator.addEdge(isNode, expressionNode);

        return isNode;
    }
}
