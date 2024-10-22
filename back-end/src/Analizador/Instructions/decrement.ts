import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { Result, DataType } from "../expression/types";
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";
export class Decrement extends Instruction {
    private id: string;  // El identificador de la variable a decrementar

    constructor(id: string, line: number, column: number) {
        super(line, column);
        this.id = id;
    }

    public execute(environment: Environment): Result {
        console.log(`[Decrement] Decrementando la variable '${this.id}' en la línea ${this.linea}, columna ${this.columna}.`);
    
        // Obtener la variable del entorno
        const variable = environment.GetVariable(this.id);
        if (!variable) {
            Errors.addError(
                "Semántico", 
                `La variable '${this.id}' no ha sido declarada.`, 
                this.linea, 
                this.columna
            );
            throw new Error(`Error Semántico: La variable '${this.id}' no ha sido declarada en la línea ${this.linea}, columna ${this.columna}`);
        }
    
        // Obtener el valor actual de la variable
        const currentValue = variable.getValor();  // Aquí obtenemos directamente el valor
        if (typeof currentValue !== 'number') {
            Errors.addError(
                "Semántico", 
                `La variable '${this.id}' no es un valor numérico y no puede ser decrementada.`, 
                this.linea, 
                this.columna
            );
            throw new Error(`Error Semántico: La variable '${this.id}' no es un valor numérico en la línea ${this.linea}, columna ${this.columna}`);
        }
    
        // Decrementar el valor
        const newValue = currentValue - 1;
    
        // Empaquetar el nuevo valor en un objeto Result
        const result: Result = {
            value: newValue,        // El nuevo valor después de decrementar
            DataType: DataType.ENTERO  // El tipo de dato del nuevo valor
        };
    
        // Guardar el nuevo valor en el entorno
        variable.setValor(result);  // Aquí pasamos el objeto de tipo Result
        console.log(`[Decrement] Nuevo valor de '${this.id}': ${newValue}.`);
    
        return { value: null, DataType: DataType.NULO };  // Retorna un valor nulo porque es una operación de asignación
    }
    
    /**
     * Genera el nodo DOT para la operación de decremento.
     * 
     * @param ast - Referencia al AST que contiene el contador de nodos.
     * @returns string - Representación en formato DOT del nodo de decremento.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo principal para la operación de decremento con el identificador de la variable
        const decrementNode = dotGenerator.addNode(`Decremento: ${this.id}`);
    
        return decrementNode;
    }
    
    
}
