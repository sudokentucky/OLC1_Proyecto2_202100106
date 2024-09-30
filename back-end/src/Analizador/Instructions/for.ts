import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { Break, Continue } from "./transfer";
import { DataType } from "../expression/types";

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

        const forEnv = new Environment(environment); // Crear un nuevo entorno para el ciclo

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
}
