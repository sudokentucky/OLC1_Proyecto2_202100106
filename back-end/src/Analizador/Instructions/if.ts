import { Instruction } from "../abstract/instruction"; // Clase base para las instrucciones
import { Environment } from "../Environment/environment"; // Entorno de ejecución
import { Result, DataType } from "../expression/types"; // Tipos de datos y resultados
import { Expression } from "../abstract/expression";
import { Break, Continue } from "./transfer";
import Errors from "../Error/error"; // Manejo de errores
import { DotGenerator } from "../Tree/DotGenerator";
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
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la condición del `if`
        const conditionNode = this.condition.generateNode(dotGenerator);
        
        // Crear el nodo principal del `If`
        const ifNode = dotGenerator.addNode("If");
    
        // Conectar el nodo del `If` con el nodo de la condición
        dotGenerator.addEdge(ifNode, conditionNode);
    
        // Generar y conectar los nodos para las instrucciones dentro del `if`
        for (const instruction of this.instructions) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(ifNode, instructionNode);
        }
    
        return ifNode;
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
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la condición del `if`
        const conditionNode = this.condition.generateNode(dotGenerator);
        
        // Crear el nodo principal del `If-Else`
        const ifElseNode = dotGenerator.addNode("If-Else");
    
        // Conectar el nodo del `If-Else` con el nodo de la condición
        dotGenerator.addEdge(ifElseNode, conditionNode);
    
        // Generar y conectar los nodos para las instrucciones del bloque `if`
        for (const instruction of this.ifInstructions) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(ifElseNode, instructionNode);
        }
    
        // Generar y conectar los nodos para las instrucciones del bloque `else`
        for (const instruction of this.elseInstructions) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(ifElseNode, instructionNode);
        }
    
        return ifElseNode;
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
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la condición del `if`
        const conditionNode = this.condition.generateNode(dotGenerator);
        
        // Crear el nodo principal del `If-ElseIf`
        const ifElseIfNode = dotGenerator.addNode("If-ElseIf");
    
        // Conectar el nodo del `If-ElseIf` con el nodo de la condición
        dotGenerator.addEdge(ifElseIfNode, conditionNode);
    
        // Generar y conectar los nodos para las instrucciones del bloque `if`
        for (const instruction of this.ifInstructions) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(ifElseIfNode, instructionNode);
        }
    
        // Generar y conectar los nodos para los bloques `else if`
        for (const block of this.elseIfBlocks) {
            // Generar el nodo para la condición del bloque `else if`
            const elseIfConditionNode = block.condition.generateNode(dotGenerator);
            const elseIfNode = dotGenerator.addNode("ElseIf");
    
            // Conectar el nodo `ElseIf` con su condición
            dotGenerator.addEdge(elseIfNode, elseIfConditionNode);
    
            // Conectar el nodo principal `If-ElseIf` con el bloque `ElseIf`
            dotGenerator.addEdge(ifElseIfNode, elseIfNode);
    
            // Generar y conectar las instrucciones del bloque `else if`
            for (const instruction of block.instructions) {
                const instructionNode = instruction.generateNode(dotGenerator);
                dotGenerator.addEdge(elseIfNode, instructionNode);
            }
        }
    
        // Generar y conectar los nodos para las instrucciones del bloque `else` (si existe)
        if (this.elseInstructions) {
            const elseNode = dotGenerator.addNode("Else");
    
            // Conectar el nodo principal `If-ElseIf` con el bloque `else`
            dotGenerator.addEdge(ifElseIfNode, elseNode);
    
            for (const instruction of this.elseInstructions) {
                const instructionNode = instruction.generateNode(dotGenerator);
                dotGenerator.addEdge(elseNode, instructionNode);
            }
        }
    
        return ifElseIfNode;
    }
    
}


