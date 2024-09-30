import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { Break, Continue } from "./transfer";
import { DataType } from "../expression/types";

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

        const doEnv = new Environment(environment); // Crear un nuevo entorno para el ciclo
        let conditionResult; // Declarar conditionResult fuera del bloque do

        do {
            for (let instr of this.instructions) {
                const result = instr.execute(doEnv);
                if (result instanceof Break) {
                    return;
                }
                if (result instanceof Continue) {
                    break;
                }
            }

            conditionResult = this.condition.execute(doEnv); // Evaluar la condición
            if (conditionResult.DataType !== DataType.BOOLEANO) {
                Errors.addError("Semántico", "La condición del ciclo do-until no es booleana", this.linea, this.columna);
                break;
            }
        } while (!conditionResult.value); // Se ejecuta hasta que la condición sea verdadera
    }
}