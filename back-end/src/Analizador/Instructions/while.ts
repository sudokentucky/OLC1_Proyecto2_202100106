import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { DataType } from "../expression/types";
import { Break, Continue } from "./transfer";
import { DotGenerator } from "../Tree/DotGenerator";
import { Statement } from "./statement";  // Importa la clase Statement

/**
 * Clase para la sentencia While.
 */

export class While extends Instruction {
    private condition: Expression; // Condición del ciclo
    private statementBlock: Statement; // El bloque de instrucciones a ejecutar mientras la condición sea verdadera

    constructor(condition: Expression, statementBlock: Statement, line: number, column: number) {
        super(line, column);
        this.condition = condition;
        this.statementBlock = statementBlock;  // Usamos Statement en lugar de un array de instrucciones
    }


    public execute(environment: Environment) {
        console.log("Ejecutando ciclo while");
    
        while (true) {
            const conditionResult = this.condition.execute(environment); // Evaluar la condición
            if (conditionResult.DataType !== DataType.BOOLEANO) {
                Errors.addError("Semántico", "La condición del ciclo while no es booleana", this.linea, this.columna);
                break;
            }
    
            // Si la condición es falsa, salimos del ciclo
            if (!conditionResult.value) {
                break;
            }
    
            // Ejecutar el bloque de instrucciones del ciclo
            // Usamos el mismo `environment` para que pueda acceder a las variables globales como `x`
            const result = this.statementBlock.execute(environment); // Ejecutar el bloque de instrucciones
    
            // Si el bloque retorna un `Break`, terminamos el ciclo
            if (result instanceof Break) {
                break;
            }
    
            // Si el bloque retorna un `Continue`, saltamos a la siguiente iteración
            if (result instanceof Continue) {
                continue;
            }
        }
    }
    
    
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la condición del ciclo `while`
        const conditionNode = this.condition.generateNode(dotGenerator);
        
        // Crear el nodo principal para el ciclo `While`
        const whileNode = dotGenerator.addNode("While");
    
        // Conectar el nodo `While` con el nodo de la condición
        dotGenerator.addEdge(whileNode, conditionNode);
    
        // Generar y conectar el nodo para el bloque de instrucciones (statementBlock)
        const statementNode = this.statementBlock.generateNode(dotGenerator);
        dotGenerator.addEdge(whileNode, statementNode);
    
        // Retornar el nodo principal del ciclo `While`
        return whileNode;
    }
}