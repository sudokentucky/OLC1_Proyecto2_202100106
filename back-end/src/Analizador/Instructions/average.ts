import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array"; // Asegúrate de importar la clase Arreglo correctamente
import { DotGenerator } from "../Tree/DotGenerator";

export class Average extends Expression {
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

        let averageValor;

        // Si el arreglo está vacío, lanzamos un error para evitar la división por cero
        if (valores.length === 0) {
            throw new Errors("Semántico", `El vector '${this.id}' está vacío, no se puede calcular el promedio`, this.linea, this.columna);
        }

        switch (tipoArreglo) {
            case DataType.ENTERO:
            case DataType.DECIMAL:
                // Calcular el promedio de los valores numéricos
                averageValor = valores.reduce((a, b) => a + b, 0) / valores.length;
                break;
            case DataType.CHAR:
                // Calcular el promedio de los valores ASCII de los caracteres
                averageValor = valores.reduce((a, b) => a + b.charCodeAt(0), 0) / valores.length;
                break;
            case DataType.BOOLEANO:
                // Calcular el promedio considerando true como 1 y false como 0
                averageValor = valores.reduce((a, b) => a + (b ? 1 : 0), 0) / valores.length;
                break;
            case DataType.STRING:
                // Lanzar error porque el promedio no es aplicable a cadenas
                throw new Errors("Semántico", `El promedio no es aplicable para vectores de tipo string ('${this.id}')`, this.linea, this.columna);
            default:
                throw new Errors("Semántico", `El tipo de datos del vector '${this.id}' no es compatible con la función 'average'`, this.linea, this.columna);
        }

        // Retornar el valor del promedio calculado
        return { value: averageValor, DataType: tipoArreglo };
    }

    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo para la expresión `Average`
        const averageNode = dotGenerator.addNode(`Average: ${this.id}`);
    
        return averageNode;
    }
}
