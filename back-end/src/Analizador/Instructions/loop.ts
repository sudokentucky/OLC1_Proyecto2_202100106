import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { Break } from "./transfer";

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

        const loopEnv = new Environment(environment);

        while (true) {
            for (let instr of this.instructions) {
                const result = instr.execute(loopEnv);
                if (result instanceof Break) {
                    return; // Salimos del ciclo por un break
                }
            }
        }
    }
}
