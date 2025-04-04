import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { Result, DataType } from "../expression/types"; // Importa Result y DataType
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";
export class Increment extends Instruction {
    private id: string;  // El identificador de la variable a incrementar

    constructor(id: string, line: number, column: number) {
        super(line, column);
        this.id = id;
    }

    public execute(environment: Environment): Result {
        console.log(`[Increment] Incrementing variable '${this.id}' at line ${this.linea}, column ${this.columna}.`);

        // Obtener la variable del entorno
        const variable = environment.GetVariable(this.id);
        if (!variable) {
            throw new Errors("Semantic", `The variable '${this.id}' has not been declared.`, this.linea, this.columna);
        }

        // Obtener el valor directamente de la variable
        const currentValue = variable.getValor();  // Aquí obtenemos directamente el valor
        if (typeof currentValue !== 'number') {
            throw new Errors("Semantic", `The variable '${this.id}' is not a numeric value and cannot be incremented.`, this.linea, this.columna);
        }

        // Incrementar el valor
        const newValue = currentValue + 1;

        // Empaquetar el nuevo valor en un objeto Result
        const result: Result = {
            value: newValue,        // El nuevo valor después de incrementar
            DataType: DataType.ENTERO  // El tipo de dato del nuevo valor
        };

        // Guardar el nuevo valor en el entorno
        variable.setValor(result);  // Aquí pasamos el objeto de tipo Result
        console.log(`[Increment] New value of '${this.id}': ${newValue}.`);

        return { value: null, DataType: DataType.NULO };  // Retorna un valor nulo porque es una operación de asignación
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo para la operación de incremento con el identificador de la variable
        const incrementNode = dotGenerator.addNode(`Incremento: ${this.id}`);
    
        return incrementNode;
    }
    
    
}
