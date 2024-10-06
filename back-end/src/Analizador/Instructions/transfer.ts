import { Instruction } from "../abstract/instruction";
import { DotGenerator } from "../Tree/DotGenerator";

export class Break extends Instruction {
    constructor(line: number, column: number) {
        super(line, column);
    }

    public execute(): Break {
        // Retornamos la propia instancia para que las estructuras de control lo manejen
        return this;
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo principal para la instrucción `Break`
        return dotGenerator.addNode("Break");
    }
    
}

export class Continue extends Instruction {
    constructor(line: number, column: number) {
        super(line, column);
    }

    public execute(): Continue {
        // Retornamos la propia instancia para que los bucles lo manejen
        return this;
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo principal para la instrucción `Continue`
        return dotGenerator.addNode("Continue");
    }
    
    
}
