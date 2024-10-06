import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { DataType } from "../expression/types";
import { Break, Continue } from "./transfer";
import { DotGenerator } from "../Tree/DotGenerator";
/**
 * Clase para la sentencia While.
 */
export class While extends Instruction {
    private condition: Expression; // Condición del ciclo
    private instructions: Instruction[]; // Instrucciones a ejecutar mientras la condición sea verdadera

    constructor(condition: Expression, instructions: Instruction[], line: number, column: number) {
        super(line, column);
        this.condition = condition;
        this.instructions = instructions;
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

            // Ejecutar instrucciones dentro del ciclo
            const newEnv = new Environment(environment); // Crear un nuevo entorno para el bloque del ciclo
            for (let instr of this.instructions) {
                const result = instr.execute(newEnv);
                if (result instanceof Break) {
                    return; // Salimos del ciclo por una sentencia break
                }
                if (result instanceof Continue) {
                    break; // Salto a la siguiente iteración
                }
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
    
        // Generar y conectar los nodos para las instrucciones dentro del ciclo
        for (const instruction of this.instructions) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(whileNode, instructionNode);
        }
    
        return whileNode;
    }
    
}
