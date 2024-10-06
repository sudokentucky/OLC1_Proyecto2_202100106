import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { DotGenerator } from "../Tree/DotGenerator";
export class Default extends Instruction {
    private instructions: Instruction[];

    constructor(instructions: Instruction[], line: number, column: number) {
        super(line, column);
        this.instructions = instructions;
    }

    public execute(environment: Environment): any {
        for (const instruction of this.instructions) {
            instruction.execute(environment);
        }
    }

    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo principal para el `default`
        const defaultNode = dotGenerator.addNode(`Default`);
    
        // Generar y conectar los nodos para las instrucciones del `default`
        for (const instruction of this.instructions) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(defaultNode, instructionNode); // Conectar cada nodo de instrucción al nodo `default`
        }
    
        return defaultNode;
    }
    
}
