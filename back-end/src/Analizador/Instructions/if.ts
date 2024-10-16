import { Instruction } from "../abstract/instruction"; 
import { Environment } from "../Environment/environment"; 
import { Result, DataType } from "../expression/types"; 
import { Expression } from "../abstract/expression";
import Errors from "../Error/error"; 
import { DotGenerator } from "../Tree/DotGenerator";
import { Statement } from "./statement";

/**
 * Clase `ifSentence` que representa las sentencias `if`, `else if` y `else`.
 */
export class ifSentence extends Instruction {
    private condition: Expression;  // Condición del `if`
    private ifBlock: Statement;     // Bloque de instrucciones del `if`
    private elseBlock: Statement | ifSentence | null; // Bloque de `else` o `else if`, puede ser otro `ifSentence` o null

    /**
     * @param condition - La expresión condicional del `if`.
     * @param ifBlock - Bloque de instrucciones para el `if`.
     * @param elseBlock - Bloque `else` o `else if` (puede ser otro `ifSentence`).
     * @param line - Línea de la sentencia `if` en el código fuente.
     * @param column - Columna de la sentencia `if` en el código fuente.
     */
    constructor(
        condition: Expression, 
        ifBlock: Statement, 
        elseBlock: Statement | ifSentence | null,  // Aquí se acepta tanto un `Statement` como un `ifSentence`
        line: number, 
        column: number
    ) {
        super(line, column);
        this.condition = condition;
        this.ifBlock = ifBlock;
        this.elseBlock = elseBlock; // Puede ser un bloque `else` o un `ifSentence` para manejar `else if`
    }

    /**
     * Ejecuta la sentencia `if`, `else if` o `else` en el entorno dado.
     */
    public execute(environment: Environment): Result {
        const conditionResult = this.condition.execute(environment); //Usa el mismo entorno para la condición

        // Verificar que la condición sea booleana
        if (conditionResult.DataType !== DataType.BOOLEANO) {
            throw new Errors("Semántico", "La condición del 'if' debe ser de tipo booleano", this.linea, this.columna);
        }

        // Si la condición del `if` es verdadera, ejecuta el bloque `if`
        if (conditionResult.value) {
            console.log("Condición verdadera, ejecutando bloque 'if'");
            return this.ifBlock.execute(environment);
        } else if (this.elseBlock) {
            console.log("Bloque else if")
            // Si hay un bloque `else`, ejecuta ese bloque
            if (this.elseBlock instanceof ifSentence) {
                console.log("Condición falsa, ejecutando bloque 'else if'");
                // Si el `elseBlock` es un `ifSentence`, es un `else if`, lo ejecutamos como tal
                return this.elseBlock.execute(environment);
            } else {
                console.log("Condición falsa, ejecutando bloque 'else'");
                // Si es un bloque normal, es un `else`, lo ejecutamos
                return this.elseBlock.execute(environment);
            }
        }

        return { value: null, DataType: DataType.NULO }; // Retorna nulo si ninguna condición fue verdadera
    }

    /**
     * Genera el nodo DOT para visualización en Graphviz.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la condición del `if`
        const conditionNode = this.condition.generateNode(dotGenerator);
        
        // Crear el nodo principal del `ifSentence`
        const ifSentenceNode = dotGenerator.addNode("IfSentence");
        
        // Conectar el nodo de la condición con el nodo del `IfSentence`
        dotGenerator.addEdge(ifSentenceNode, conditionNode);
        
        // Generar el nodo para el bloque de instrucciones del `if`
        const ifBlockNode = this.ifBlock.generateNode(dotGenerator);
        dotGenerator.addEdge(ifSentenceNode, ifBlockNode);
        
        // Generar y conectar el nodo del bloque `else` o `else if` si existe
        if (this.elseBlock) {
            const elseNode = dotGenerator.addNode(this.elseBlock instanceof ifSentence ? "ElseIf" : "Else");
            const elseBlockNode = this.elseBlock.generateNode(dotGenerator);
            dotGenerator.addEdge(elseNode, elseBlockNode);
            dotGenerator.addEdge(ifSentenceNode, elseNode);
        }

        return ifSentenceNode;
    }
}
