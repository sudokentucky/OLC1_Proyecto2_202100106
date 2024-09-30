import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import { Result, DataType } from "../expression/types";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array"; // Importamos la clase Arreglo

export class VectorAccess extends Expression {
    private id: string;
    private index: Expression;

    constructor(id: string, index: Expression, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.index = index;
    }

    public execute(environment: Environment): Result {
        // Obtener la variable del entorno
        const variable = environment.GetVariable(this.id);

        // Verificar si la variable existe y es de tipo Arreglo
        if (!variable || !(variable.getValor() instanceof Arreglo)) {
            throw new Errors("Semántico", `El identificador '${this.id}' no es un vector unidimensional válido`, this.linea, this.columna);
        }

        // Obtener el arreglo unidimensional (asumimos que el Arreglo contiene números)
        const vector = variable.getValor() as Arreglo<number>;

        // Evaluar el índice
        const idx = this.index.execute(environment).value;

        // Verificar que el índice sea un número válido
        if (typeof idx !== 'number') {
            throw new Errors("Semántico", `El índice ${idx} no es un número válido para el acceso al vector '${this.id}'`, this.linea, this.columna);
        }

        // Intentar obtener el valor en la posición indicada del vector
        try {
            const value = vector.getValor(idx);
            return { value, DataType: this.detectDataType(value) };
        } catch (error) {
            if (error instanceof Error) {
                throw new Errors("Semántico", error.message, this.linea, this.columna);
            } else {
                throw new Errors("Semántico", "Error desconocido accediendo al vector", this.linea, this.columna);
            }
        }
    }

    /**
     * Detecta el tipo de dato de un valor accedido en el vector.
     */
    private detectDataType(value: any): DataType {
        if (typeof value === 'number') return DataType.ENTERO;
        if (typeof value === 'string') return DataType.STRING;
        if (typeof value === 'boolean') return DataType.BOOLEANO;
        if (value === null) return DataType.NULO;
        return DataType.NULO;
    }
}
