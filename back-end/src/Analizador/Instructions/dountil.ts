import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { Break, Continue } from "./transfer";
import { DataType } from "../expression/types";
import { DotGenerator } from "../Tree/DotGenerator";
/**
 * Clase para la sentencia Do-Until.
 */
export class DoUntil extends Instruction {
    private condition: Expression;
    private instructions: Instruction[];

    constructor(condition: Expression, instructions: Instruction[], line: number, column: number) {
        super(line, column);
        this.condition = condition;
        this.instructions = instructions;
    }

    public execute(environment: Environment) {
        console.log("Ejecutando ciclo do-until");
    
        const doEnv = new Environment(environment, 'Do-until'); // Crear un nuevo entorno para el ciclo
        let conditionResult; // Declarar conditionResult fuera del bloque do
    
        do {
            // Ejecutar cada instrucción en el ciclo
            for (let instr of this.instructions) {
                const result = instr.execute(doEnv);
    
                // Manejo de sentencias Break y Continue
                if (result instanceof Break) {
                    return; // Termina el ciclo si se encuentra un Break
                }
                if (result instanceof Continue) {
                    break; // Salta a la siguiente iteración si se encuentra un Continue
                }
            }
    
            // Evaluar la condición
            conditionResult = this.condition.execute(doEnv);
    
            // Verificar que el resultado de la condición sea booleana
            if (conditionResult.DataType !== DataType.BOOLEANO) {
                Errors.addError(
                    "Semántico", 
                    "La condición del ciclo do-until no es booleana", 
                    this.linea, 
                    this.columna
                );
                break; // Salir del ciclo si la condición no es booleana
            }
    
        } while (!conditionResult.value); // Se ejecuta hasta que la condición sea verdadera
    }
    
    /**
     * Genera el nodo DOT para la estructura `do-until`.
     * 
     * @param ast - Referencia al AST que contiene el contador de nodos.
     * @returns string - Representación en formato DOT del nodo del ciclo `do-until`.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la condición del ciclo
        const conditionNode = this.condition.generateNode(dotGenerator);
    
        // Crear el nodo principal para el ciclo `Do-Until`
        const doUntilNode = dotGenerator.addNode("Do-Until");
    
        // Conectar el nodo del ciclo con el nodo de la condición
        dotGenerator.addEdge(doUntilNode, conditionNode);
    
        // Generar y conectar los nodos para las instrucciones dentro del ciclo `do`
        for (const instruction of this.instructions) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(doUntilNode, instructionNode); // Conectar cada instrucción al nodo `Do-Until`
        }
    
        return doUntilNode;
    }
    
    
}
