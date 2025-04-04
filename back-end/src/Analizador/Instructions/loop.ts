import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { Break } from "./transfer";
import { DotGenerator } from "../Tree/DotGenerator";
/**
 * Clase para la sentencia Loop.
 */
export class Loop extends Instruction {
    private instructions: Instruction[];

    constructor(instructions: Instruction[], line: number, column: number) {
        super(line, column);
        this.instructions = instructions;
    }

    public execute(environment: Environment) {
        console.log("Ejecutando ciclo loop (infinito)");

        const loopEnv = new Environment(environment, 'Loop');

        while (true) {
            for (let instr of this.instructions) {
                const result = instr.execute(loopEnv);
                if (result instanceof Break) {
                    return; // Salimos del ciclo por un break
                }
            }
        }
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo principal para el ciclo infinito `Loop`
        const loopNode = dotGenerator.addNode("Loop");
    
        // Generar y conectar los nodos para las instrucciones dentro del ciclo `Loop`
        for (const instruction of this.instructions) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(loopNode, instructionNode); // Conectar cada instrucción al nodo `Loop`
        }
    
        return loopNode;
    }
    
    
}
