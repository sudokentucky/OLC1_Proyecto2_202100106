import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { DataType, Result } from "../expression/types";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array"; // Asegúrate de importar la clase Arreglo correctamente
import { DotGenerator } from "../Tree/DotGenerator";

export class Reverse extends Instruction {
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
        const tipoArreglo = arreglo.getTipo();  // Obtener el tipo del arreglo
        
        // Invertir el arreglo dependiendo del tipo de datos
        let valoresInvertidos;
        switch (tipoArreglo) {
            case DataType.ENTERO:
            case DataType.DECIMAL:
            case DataType.CHAR:
                valoresInvertidos = [...arreglo.getValores()].reverse();
                break;
            case DataType.BOOLEANO:
                valoresInvertidos = [...arreglo.getValores()].reverse();  // Simplemente invertimos true/false
                break;
            case DataType.STRING:
                valoresInvertidos = [...arreglo.getValores()].reverse(); // Invertir solo el orden de las cadenas
                break;
            default:
                throw new Errors("Semántico", `El tipo de datos del vector '${this.id}' no es compatible con el método 'reverse'`, this.linea, this.columna);
        }

        // Actualizar los valores del arreglo con los valores invertidos
        arreglo.setValores(valoresInvertidos);

        // Devolver el arreglo invertido como resultado
        return { value: arreglo, DataType: DataType.ARRAY };
    }

    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo para la instrucción `Reverse`
        const reverseNode = dotGenerator.addNode(`Reverse: ${this.id}`);
    
        return reverseNode;
    }
}
