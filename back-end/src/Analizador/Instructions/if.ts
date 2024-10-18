import { Instruction } from "../abstract/instruction"; 
import { Environment } from "../Environment/environment"; 
import { DataType } from "../expression/types"; 
import { Expression } from "../abstract/expression";
import { Break, Continue } from "./transfer";
import Errors from "../Error/error";
import { Return } from "../Instructions/return";
import { DotGenerator } from "../Tree/DotGenerator";

/**
 * Clase `ifSentence` que representa las sentencias `if`, `else if` y `else`.
 */
export class ifSentence extends Instruction {
    constructor(
        private condition: Expression,  // Condición del `if`
        private ifBlock: Instruction,   // Bloque de instrucciones del `if`
        private elseBlock: Instruction | null = null, // Bloque de `else`, puede ser nulo
        private elseIfBlock: ifSentence | null = null, // Bloque de `else if`, puede ser nulo
        line: number, 
        column: number
    ) {
        super(line, column);
    }

    /**
     * Ejecuta la sentencia `if`, `else if` o `else` en el entorno dado.
     */
    public execute(environment: Environment): any {
        const nuevoEntorno = new Environment(environment, "IfStatement"); // Crear un nuevo entorno para la sentencia
        environment.agregarSubEntorno(nuevoEntorno); // Agregar el nuevo entorno al entorno actual
        const conditionResult = this.condition.execute(environment); // Evaluar la condición

        // Verificar que la condición sea booleana
        if (conditionResult.DataType !== DataType.BOOLEANO) {
            const error = new Errors("Semántico", `La condición no es booleana: ${conditionResult.value}`, this.linea, this.columna);
            throw error; // Lanza un error si la condición no es booleana
        }

        // Si la condición es verdadera, ejecutar el bloque `if`
        if (conditionResult.value) {
            return this.ejecutarBloque(this.ifBlock, nuevoEntorno);
        } 
        // Si la condición es falsa y existe un bloque `else`
        else if (this.elseBlock !== null) {
            return this.ejecutarBloque(this.elseBlock, nuevoEntorno);
        } 
        // Si existe un bloque `else if`, ejecutarlo
        else if (this.elseIfBlock !== null) {
            return this.elseIfBlock.execute(nuevoEntorno); // Recursión para el else if
        }

        return null; // Retorna null si no se ejecuta ningún bloque
    }

    /**
     * Ejecuta un bloque de instrucciones y maneja las sentencias de control como `Return`, `Break` y `Continue`.
     * 
     * @param block - El bloque de instrucciones a ejecutar.
     * @param environment - El entorno en el que se ejecutan las instrucciones.
     * @returns El resultado de una instrucción `Return`, `Break` o `Continue` si se encuentra alguna.
     */
    private ejecutarBloque(block: Instruction, environment: Environment): any {
        const result = block.execute(environment);

        // Si se encuentra un `Return`, `Break` o `Continue`, detener la ejecución y devolver el resultado.
        if (result instanceof Return || result instanceof Break || result instanceof Continue) {
            return result;
        }

        return result; // Retornar el resultado si no es `Return`, `Break` o `Continue`
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
