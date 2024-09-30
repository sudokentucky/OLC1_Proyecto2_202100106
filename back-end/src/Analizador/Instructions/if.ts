import { Instruction } from "../abstract/instruction"; // Clase base para las instrucciones
import { Environment } from "../Environment/environment"; // Entorno de ejecución
import { Result, DataType } from "../expression/types"; // Tipos de datos y resultados
import { Expression } from "../abstract/expression";
import { Break, Continue } from "./transfer";
import Errors from "../Error/error"; // Manejo de errores

export class If extends Instruction {
    private condition: Expression; // La condición a evaluar (debe devolver un booleano)
    private instructions: Instruction[]; // Instrucciones que se ejecutarán si la condición es verdadera

    constructor(condition: Expression, instructions: Instruction[], line: number, column: number) {
        super(line, column);
        this.condition = condition;
        this.instructions = instructions;
    }

    public execute(environment: Environment): Result {
        const conditionResult = this.condition.execute(environment);
    
        if (conditionResult.DataType !== DataType.BOOLEANO) {
            throw new Errors("Semántico", "La condición del 'if' debe ser de tipo booleano", this.linea, this.columna);
        }
    
        if (conditionResult.value) {
            console.log(`[If] Condición verdadera. Ejecutando instrucciones en línea ${this.linea}`);
            for (const instruction of this.instructions) {
                const result = instruction.execute(environment);
    
                // Verificamos si encontramos un break, continue o return y lo propagamos
                if (result instanceof Break || result instanceof Continue || result?.type === "Return") {
                    return result; // Retornamos inmediatamente si encontramos una sentencia de control
                }
            }
        }
    
        return { value: null, DataType: DataType.NULO }; // Retorna un valor nulo al finalizar
    }
    
}

export class IfElse extends Instruction {
    private condition: Expression; // Condición del if
    private ifInstructions: Instruction[]; // Instrucciones del if
    private elseInstructions: Instruction[]; // Instrucciones del else

    constructor(condition: Expression, ifInstructions: Instruction[], elseInstructions: Instruction[], line: number, column: number) {
        super(line, column);
        this.condition = condition;
        this.ifInstructions = ifInstructions;
        this.elseInstructions = elseInstructions;
    }

    public execute(environment: Environment): Result {
        const conditionResult = this.condition.execute(environment);
    
        if (conditionResult.DataType !== DataType.BOOLEANO) {
            throw new Errors("Semántico", "La condición del 'if' debe ser de tipo booleano", this.linea, this.columna);
        }
    
        if (conditionResult.value) {
            console.log(`[IfElse] Condición verdadera. Ejecutando instrucciones 'if' en línea ${this.linea}`);
            for (const instruction of this.ifInstructions) {
                const result = instruction.execute(environment);
                // Verificamos si encontramos un break, continue o return y lo propagamos
                if (result instanceof Break || result instanceof Continue || result?.type === "Return") {
                    return result; // Retornamos inmediatamente si encontramos una sentencia de control
                }
            }
        } else {
            console.log(`[IfElse] Condición falsa. Ejecutando instrucciones 'else' en línea ${this.linea}`);
            for (const instruction of this.elseInstructions) {
                const result = instruction.execute(environment);
                // Verificamos si encontramos un break, continue o return y lo propagamos
                if (result instanceof Break || result instanceof Continue || result?.type === "Return") {
                    return result; // Retornamos inmediatamente si encontramos una sentencia de control
                }
            }
        }
    
        return { value: null, DataType: DataType.NULO };
    }
    
}

export class IfElseIf extends Instruction {
    private condition: Expression; // Condición del if
    private ifInstructions: Instruction[]; // Instrucciones del if
    private elseIfBlocks: { condition: Expression, instructions: Instruction[] }[]; // Condiciones e instrucciones de else if
    private elseInstructions: Instruction[] | null; // Instrucciones del else (opcional)

    constructor(
        condition: Expression,
        ifInstructions: Instruction[],
        elseIfBlocks: { condition: Expression, instructions: Instruction[] }[],
        elseInstructions: Instruction[] | null,
        line: number,
        column: number
    ) {
        super(line, column);
        this.condition = condition;
        this.ifInstructions = ifInstructions;
        this.elseIfBlocks = elseIfBlocks;
        this.elseInstructions = elseInstructions;
    }

    public execute(environment: Environment): Result {
        let conditionResult = this.condition.execute(environment);
    
        if (conditionResult.DataType !== DataType.BOOLEANO) {
            throw new Errors("Semántico", "La condición del 'if' debe ser de tipo booleano", this.linea, this.columna);
        }
    
        if (conditionResult.value) {
            console.log(`[IfElseIf] Condición 'if' verdadera. Ejecutando instrucciones en línea ${this.linea}`);
            for (const instruction of this.ifInstructions) {
                const result = instruction.execute(environment);
                // Verificamos si encontramos un break, continue o return y lo propagamos
                if (result instanceof Break || result instanceof Continue || result?.type === "Return") {
                    return result; // Retornamos inmediatamente si encontramos una sentencia de control
                }
            }
        } else {
            // Verificar los bloques else if
            let executed = false;
            for (const block of this.elseIfBlocks) {
                const elseIfConditionResult = block.condition.execute(environment);
                if (elseIfConditionResult.DataType !== DataType.BOOLEANO) {
                    throw new Errors("Semántico", "La condición del 'else if' debe ser de tipo booleano", this.linea, this.columna);
                }
    
                if (elseIfConditionResult.value) {
                    console.log(`[IfElseIf] Condición 'else if' verdadera. Ejecutando instrucciones.`);
                    for (const instruction of block.instructions) {
                        const result = instruction.execute(environment);
                        // Verificamos si encontramos un break, continue o return y lo propagamos
                        if (result instanceof Break || result instanceof Continue || result?.type === "Return") {
                            return result; // Retornamos inmediatamente si encontramos una sentencia de control
                        }
                    }
                    executed = true;
                    break;
                }
            }
    
            // Si ningún bloque else if se ejecutó, ejecutamos el bloque else (si existe)
            if (!executed && this.elseInstructions) {
                console.log(`[IfElseIf] Condición 'else'. Ejecutando instrucciones.`);
                for (const instruction of this.elseInstructions) {
                    const result = instruction.execute(environment);
                    // Verificamos si encontramos un break, continue o return y lo propagamos
                    if (result instanceof Break || result instanceof Continue || result?.type === "Return") {
                        return result; // Retornamos inmediatamente si encontramos una sentencia de control
                    }
                }
            }
        }
    
        return { value: null, DataType: DataType.NULO };
    }
    
}


