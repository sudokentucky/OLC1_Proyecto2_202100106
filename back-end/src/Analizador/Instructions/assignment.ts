import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression"; // Clase base para expresiones
import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { Result } from "../expression/types";

export class Assignment extends Instruction {
    private id: string;       // Nombre de la variable a asignar
    private exp: Expression;  // Expresión cuyo resultado será asignado

    constructor(id: string, exp: Expression, linea: number, columna: number) {
        super(linea, columna);
        this.id = id;
        this.exp = exp;
    }

    // Implementación del método execute de Instruction
    public execute(environment: Environment) {
        // Buscar la variable en el entorno
        const variable = environment.GetVariable(this.id);
        
        if (!variable) {
            throw new Errors("Semántico", `La variable ${this.id} no ha sido declarada.`, this.linea, this.columna);
        }

        // Evaluar la expresión
        const expResult: Result = this.exp.execute(environment);

        // Verificar que los tipos coincidan
        if (variable.DataType !== expResult.DataType) {
            throw new Errors("Semántico", `El tipo de la variable ${this.id} no coincide con el tipo de la expresión.`, this.linea, this.columna);
        }

        // Actualizar el valor de la variable en el entorno
        environment.UpdateVariable(this.id, expResult);
        console.log(`Variable ${this.id} actualizada con valor: ${expResult.value}`);
    }
}
