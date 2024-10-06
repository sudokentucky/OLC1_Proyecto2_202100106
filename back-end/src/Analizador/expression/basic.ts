// Importa los tipos de datos y el tipo de resultado
import { DataType } from "./types"; // Definición de los tipos de datos posibles (ENTERO, DECIMAL, BOOLEANO, STRING, NULO)
import { Result } from "./types"; // Estructura del resultado de una expresión (valor y tipo de dato)
import { Expression } from "../abstract/expression"; // Clase base que representa una expresión
import { DotGenerator } from "../Tree/DotGenerator";
/**
 * Clase que representa una expresión básica en el lenguaje.
 * Una expresión básica es un valor literal, como un número, cadena, o valor booleano.
 * Hereda de la clase `Expression`, lo que indica que es evaluable.
 */
export class Basic extends Expression {
    private value: string; // Valor de la expresión como cadena (se convertirá al tipo adecuado en tiempo de ejecución)
    private type: DataType; // Tipo de dato de la expresión (ENTERO, DECIMAL, BOOLEANO, STRING, etc.)

    /**
     * Constructor de la clase `Basic`.
     * @param value - El valor de la expresión (como cadena de texto).
     * @param type - El tipo de dato de la expresión (ej. ENTERO, DECIMAL, BOOLEANO, etc.).
     * @param line - La línea del código donde se encuentra la expresión (para manejo de errores y depuración).
     * @param column - La columna del código donde se encuentra la expresión (para manejo de errores y depuración).
     */
    constructor(value: string, type: DataType, line: number, column: number) {
        super(line, column); // Llama al constructor de la clase padre (Expression)
        this.value = value; // Asigna el valor de la expresión
        this.type = type;   // Asigna el tipo de dato de la expresión
    }

    /**
     * Método que ejecuta la expresión básica.
     * Convierte el valor almacenado como cadena en el tipo de dato correspondiente (ENTERO, DECIMAL, BOOLEANO, etc.).
     * @returns Result - Un objeto que contiene el valor convertido y su tipo de dato correspondiente.
     */
    public execute(): Result {
        // Si el tipo es ENTERO, convierte la cadena a número entero
        if (this.type == DataType.ENTERO) {
            console.log("Valor de la expresión básica: ", this.value);
            console.log("Tipo de la expresión básica: ", this.type);
            return { value: parseInt(this.value), DataType: this.type };
        }

        // Si el tipo es DECIMAL, convierte la cadena a número decimal (float)
        if (this.type == DataType.DECIMAL) {
            return { value: parseFloat(this.value), DataType: this.type };
        }

        // Si el tipo es BOOLEANO, convierte la cadena a un valor booleano
        if (this.type == DataType.BOOLEANO) {
            // Convierte la cadena "true" o "false" a un valor booleano real
            if (this.value.toLocaleLowerCase() == "true") {
                return { value: true, DataType: this.type };
            } else {
                return { value: false, DataType: this.type };
            }
        }
        //Si el tipo es CHAR, convierte la cadena a un valor char
        if (this.type == DataType.CHAR) {
            return { value: this.value, DataType: this.type };
        }

        // Si el tipo es STRING, simplemente devuelve la cadena como está
        if (this.type == DataType.STRING) {
            return { value: this.value, DataType: this.type };
        }

        // Si no es ninguno de los anteriores (posiblemente es NULO), devuelve un valor nulo
        return { value: null, DataType: DataType.NULO };
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Escapar las comillas dobles en el valor si es un string
        const escapedValue = typeof this.value === 'string' ? this.value.replace(/"/g, '\\"') : this.value;
        
        // Crear el nodo para la expresión básica con el valor escapado y el tipo de dato
        const basicNode = dotGenerator.addNode(`Basic: ${escapedValue} (${DataType[this.type]})`);
        
        // Retornar el identificador del nodo creado
        return basicNode;
    }
    
    
    
}
