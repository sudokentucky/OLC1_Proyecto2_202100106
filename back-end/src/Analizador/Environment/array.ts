import { DataType } from "../expression/types";
import Errors from "../Error/error";

export class Arreglo<T> {
    private tipo: DataType;  // Tipo de datos del arreglo
    private id: string;      // Identificador del arreglo
    private valores: T[][] | T[];  // Valores del arreglo (puede ser unidimensional o bidimensional)
    private dimensiones: number[]; // Dimensiones del arreglo (1D o 2D)

    constructor(id: string, tipo: DataType, dimensiones: number[], valores: T[][] | T[]) {
        this.id = id.toLowerCase();  // Guardamos el ID en minúsculas
        this.tipo = tipo;
        this.dimensiones = dimensiones;
        this.valores = valores;
    }

    // Obtener el tipo del arreglo
    public getTipo(): DataType {
        return this.tipo;
    }

    public getLength(dimension: 1 | 2 = 1): number {
        if (this.dimensiones.length === 1) {
            return this.valores.length;
        } else if (this.dimensiones.length === 2) {
            if (dimension === 1) {
                // Longitud de las filas
                return this.valores.length;
            } else if (dimension === 2) {
                // Longitud de las columnas (asumiendo que todas las filas tienen el mismo número de columnas)
                return (this.valores[0] as T[]).length;
            } else {
                throw new Errors("Semántico", `La dimensión especificada '${dimension}' no es válida para un arreglo bidimensional`, 0, 0);
            }
        } else {
            throw new Errors("Semántico", `El arreglo '${this.id}' tiene un número de dimensiones no soportado para calcular la longitud`, 0, 0);
        }
    }
    
    
    // Establecer el tipo del arreglo
    public setTipo(tipo: DataType): void {
        this.tipo = tipo;
    }

    // Obtener el identificador del arreglo
    public getId(): string {
        return this.id;
    }

    // Establecer el identificador del arreglo
    public setId(id: string): void {
        this.id = id.toLowerCase();
    }

    // Obtener los valores del arreglo
    public getValores(): T[] | T[][] {
        return this.valores;
    }

    // Establecer nuevos valores en el arreglo
    public setValores(valores: T[] | T[][]): void {
        this.valores = valores;
    }

    // Obtener el tamaño del arreglo (dimensiones)
    public getDimensiones(): number[] {
        return this.dimensiones;
    }

    // Establecer el tamaño del arreglo
    public setDimensiones(dimensiones: number[]): void {
        this.dimensiones = dimensiones;
    }

    // Método para obtener un valor en una posición específica
    public getValor(index1: number, index2?: number): T {
        if (this.dimensiones.length === 1) {
            if (index1 < 0 || index1 >= this.valores.length) {
                throw new Errors("Semántico", `El índice '${index1}' está fuera de los límites`, 0, 0);
            }
            return this.valores[index1] as T; // Casting a T ya que es unidimensional
        } else if (this.dimensiones.length === 2) {
            if (index1 < 0 || index1 >= this.valores.length || index2 === undefined || index2 < 0 || index2 >= (this.valores[index1] as T[]).length) {
                throw new Errors("Semántico", `El índice '${index1},${index2}' está fuera de los límites`, 0, 0);
            }
            return (this.valores[index1] as T[])[index2];
        } else {
            throw new Errors("Semántico", `El arreglo '${this.id}' tiene un número de dimensiones no soportado`, 0, 0);
        }
    }

    // Método para asignar un valor en una posición específica
    public setValor(index1: number, valor: T, index2?: number): void {
        // Verificamos que el tipo del valor sea el mismo que el tipo del arreglo
        const tipoValor = tipoJavascriptADataType(valor);
    
        if (tipoValor !== this.tipo) {
            throw new Errors("Semántico", `El tipo del valor no coincide con el tipo del arreglo. Se esperaba ${DataType[this.tipo]}, pero se recibió ${DataType[tipoValor]}`, 0, 0);
        }
    
        if (this.dimensiones.length === 1) {
            if (index1 < 0 || index1 >= this.valores.length) {
                throw new Errors("Semántico", `El índice '${index1}' está fuera de los límites`, 0, 0);
            }
            (this.valores as T[])[index1] = valor; // Casting para unidimensional
        } else if (this.dimensiones.length === 2) {
            if (index1 < 0 || index1 >= this.valores.length || index2 === undefined || index2 < 0 || index2 >= (this.valores[index1] as T[]).length) {
                throw new Errors("Semántico", `El índice '${index1},${index2}' está fuera de los límites`, 0, 0);
            }
            (this.valores[index1] as T[])[index2] = valor;
        } else {
            throw new Errors("Semántico", `El arreglo '${this.id}' tiene un número de dimensiones no soportado`, 0, 0);
        }
    }
    
    // Método para inicializar un arreglo unidimensional con un tamaño y valor por defecto
    public static inicializarUnidimensional<T>(tamaño: number, valorPorDefecto: T = null as unknown as T): T[] {
        return Array(tamaño).fill(valorPorDefecto);
    }

    // Método para inicializar un arreglo bidimensional con tamaño y valor por defecto
    public static inicializarBidimensional<T>(filas: number, columnas: number, valorPorDefecto: T = null as unknown as T): T[][] {
        return Array(filas).fill(null).map(() => Array(columnas).fill(valorPorDefecto));
    }

    
}

// Función para mapear el resultado de typeof a los valores de DataType
function tipoJavascriptADataType(valor: any): DataType {
    if (typeof valor === "number") {
        // Podemos usar Number.isInteger() para diferenciar entre ENTERO y DECIMAL
        return Number.isInteger(valor) ? DataType.ENTERO : DataType.DECIMAL;
    } else if (typeof valor === "boolean") {
        return DataType.BOOLEANO;
    } else if (typeof valor === "string") {
        // Si es un solo carácter, considerarlo CHAR, si no, STRING
        return valor.length === 1 ? DataType.CHAR : DataType.STRING;
    } else if (valor === null) {
        return DataType.NULO;
    }
    throw new Error(`Tipo de dato no soportado: ${typeof valor}`);
}

