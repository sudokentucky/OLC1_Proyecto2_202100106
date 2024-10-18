import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array"; // Asegúrate de importar la clase Arreglo correctamente
import { DotGenerator } from "../Tree/DotGenerator";

export class Sum extends Expression {
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

        let sumValor;

        switch (tipoArreglo) {
            case DataType.ENTERO:
            case DataType.DECIMAL:
                // Suma de valores numéricos
                sumValor = valores.reduce((a, b) => a + b, 0); // Sumar todos los valores numéricos
                break;
            case DataType.CHAR:
                // Sumar los valores ASCII de los caracteres
                sumValor = valores.reduce((a, b) => a + b.charCodeAt(0), 0);
                break;
            case DataType.BOOLEANO:
                // Sumar considerando true como 1 y false como 0
                sumValor = valores.reduce((a, b) => a + (b ? 1 : 0), 0);
                break;
            case DataType.STRING:
                // Concatenar todas las cadenas en una sola
                sumValor = valores.reduce((a, b) => a + b, ""); 
                break;
            default:
                throw new Errors("Semántico", `El tipo de datos del vector '${this.id}' no es compatible con la función 'sum'`, this.linea, this.columna);
        }

        // Retornar el valor sumado o concatenado
        return { value: sumValor, DataType: tipoArreglo };
    }

    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo para la expresión `Sum`
        const sumNode = dotGenerator.addNode(`Sum: ${this.id}`);
    
        return sumNode;
    }
}
