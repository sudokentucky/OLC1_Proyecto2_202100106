import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { Break, Continue } from "./transfer";
import { DataType } from "../expression/types";
import { DotGenerator } from "../Tree/DotGenerator";
/**
 * Clase para la sentencia For.
 */
export class For extends Instruction {
    private initialization: Instruction;
    private condition: Expression;
    private update: Instruction;
    private instructions: Instruction[];

    constructor(
        initialization: Instruction,
        condition: Expression,
        update: Instruction,
        instructions: Instruction[],
        line: number,
        column: number
    ) {
        super(line, column);
        this.initialization = initialization;
        this.condition = condition;
        this.update = update;
        this.instructions = instructions;
    }

    public execute(environment: Environment) {
        console.log("Ejecutando ciclo for");

        const forEnv = new Environment(environment, 'For'); // Crear un nuevo entorno para el ciclo

        this.initialization.execute(forEnv); // Ejecutar la inicialización

        while (true) {
            const conditionResult = this.condition.execute(forEnv); // Evaluar la condición

            if (conditionResult.DataType !== DataType.BOOLEANO) {
                Errors.addError("Semántico", "La condición del ciclo for no es booleana", this.linea, this.columna);
                break;
            }

            if (!conditionResult.value) {
                break; // Si la condición es falsa, salimos del ciclo
            }

            for (let instr of this.instructions) {
                const result = instr.execute(forEnv);
                if (result instanceof Break) {
                    return;
                }
                if (result instanceof Continue) {
                    break; // Salto a la siguiente iteración
                }
            }

            this.update.execute(forEnv); // Ejecutar la actualización
        }
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar nodos para las diferentes partes del ciclo for
        const initNode = this.initialization.generateNode(dotGenerator);
        const conditionNode = this.condition.generateNode(dotGenerator);
        const updateNode = this.update.generateNode(dotGenerator);
        
        // Crear el nodo principal para el ciclo `For`
        const forNode = dotGenerator.addNode("For");
    
        // Conectar el nodo del `For` con las partes inicialización, condición y actualización
        dotGenerator.addEdge(forNode, initNode);
        dotGenerator.addEdge(forNode, conditionNode);
        dotGenerator.addEdge(forNode, updateNode);
    
        // Generar y conectar los nodos para las instrucciones dentro del ciclo `for`
        for (const instruction of this.instructions) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(forNode, instructionNode); // Conectar cada instrucción al nodo `For`
        }
    
        return forNode;
    }
    
    
}
