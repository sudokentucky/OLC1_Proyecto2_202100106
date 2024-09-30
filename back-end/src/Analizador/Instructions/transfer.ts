import { Instruction } from "../abstract/instruction";


export class Break extends Instruction {
    constructor(line: number, column: number) {
        super(line, column);
    }

    public execute(): Break {
        // Retornamos la propia instancia para que las estructuras de control lo manejen
        return this;
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
}
