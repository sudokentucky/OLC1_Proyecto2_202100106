import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array"; // Asegúrate de importar la clase Arreglo correctamente
import { DotGenerator } from "../Tree/DotGenerator";

export class Min extends Expression {
    private id: string;

    constructor(id: string, line: number, column: number) {
        super(line, column);
        this.id = id;
    }

    public execute(environment: Environment): Result {
        // Obtener el arreglo del entorno
        const variable = environment.GetVariable(this.id);
    
        // Verificar si la variable existe y es un arreglo
        if (!variable || !(variable.getValor() instanceof Arreglo)) {
            throw new Errors("Semántico", `El identificador '${this.id}' no es un vector válido`, this.linea, this.columna);
        }
    
        const arreglo = variable.getValor() as Arreglo<any>; // Obtener el arreglo
        const tipoArreglo = arreglo.getTipo();  // Obtener el tipo de datos del arreglo
        const valores = arreglo.getValores(); // Obtener los valores del arreglo
    
        let minValor;
        switch (tipoArreglo) {
            case DataType.ENTERO:
            case DataType.DECIMAL:
                minValor = Math.min(...valores); // Usamos Math.min para obtener el mínimo
                break;
            case DataType.CHAR:
                minValor = valores.reduce((a, b) => a < b ? a : b); // Compara usando valores ASCII
                break;
            case DataType.BOOLEANO:
                const boolValues = valores.filter(val => typeof val === "boolean") as boolean[];
                minValor = boolValues.includes(false) ? false : true; // false es menor que true
                break;
            case DataType.STRING:
                minValor = valores.reduce((a, b) => a < b ? a : b); // Comparación lexicográfica
                break;
            default:
                throw new Errors("Semántico", `El tipo de datos del vector '${this.id}' no es compatible con la función 'min'`, this.linea, this.columna);
        }
    
        // Retornar el valor mínimo encontrado
        return { value: minValor, DataType: tipoArreglo };
    }
    
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo para la expresión `Min`
        const minNode = dotGenerator.addNode(`Min: ${this.id}`);
    
        return minNode;
    }
}
