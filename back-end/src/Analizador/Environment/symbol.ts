import { Result, DataType } from "../expression/types";
import Errors from "../Error/error";

/**
 * Clase que representa un símbolo en el entorno de ejecución.
 * Un símbolo puede ser una variable, función, clase, etc.
 * Almacena el identificador del símbolo, su valor, su tipo de dato y su posición en el código.
 */
export class Symbol {
    private id: string;           // Identificador (nombre) del símbolo
    private valor: any;           // Valor almacenado en el símbolo (variable, función, etc.)
    public DataType: DataType;    // Tipo de dato asociado al símbolo
    private linea: number;        // Línea donde se declara el símbolo
    private columna: number;      // Columna donde se declara el símbolo
    private isConst: boolean;     // Indica si el símbolo es una constante
    /**
     * Constructor de la clase `Symbol`.
     * 
     * @param id - El identificador (nombre) del símbolo.
     * @param valor - El valor asociado al símbolo.
     * @param DataType - El tipo de dato del símbolo (ej. ENTERO, BOOLEANO, STRING, etc.).
     * @param linea - La línea de código donde se define el símbolo (para manejo de errores y depuración).
     * @param columna - La columna de código donde se define el símbolo (para manejo de errores y depuración).
     */
    constructor(id: string, valor: any, DataType: DataType, linea: number, columna: number, isConst: boolean = false) {
        this.id = id;
        this.valor = valor;
        this.DataType = DataType;
        this.linea = linea;
        this.columna = columna;
        this.isConst = isConst;
    }

        /**
     * Método estático para crear una variable mutable.
     * 
     * @param id - El identificador (nombre) de la variable.
     * @param valor - El valor de la variable.
     * @param DataType - El tipo de dato de la variable.
     * @param linea - La línea de código donde se declara la variable.
     * @param columna - La columna de código donde se declara la variable.
     * @returns Una nueva instancia de `Symbol` que representa una variable mutable.
     */
        public static crearVariableMutable(
            id: string, 
            valor: any, 
            DataType: DataType, 
            linea: number, 
            columna: number
        ): Symbol {
            return new Symbol(id, valor, DataType, linea, columna, false); // isConst = false
        }

        /**
     * Método estático para crear una variable constante.
     * 
     * @param id - El identificador (nombre) de la constante.
     * @param valor - El valor de la constante.
     * @param DataType - El tipo de dato de la constante.
     * @param linea - La línea de código donde se declara la constante.
     * @param columna - La columna de código donde se declara la constante.
     * @returns Una nueva instancia de `Symbol` que representa una constante.
     */
        public static crearVariableConstante(
            id: string, 
            valor: any, 
            DataType: DataType, 
            linea: number, 
            columna: number
        ): Symbol {
            return new Symbol(id, valor, DataType, linea, columna, true); // isConst = true
        }

    // Getters

    /**
     * Método que obtiene el valor almacenado en el símbolo.
     * @returns El valor almacenado en la propiedad `valor` del símbolo.
     */
    public getValor(): any {
        return this.valor;
    }

    /**
     * Método que obtiene el nombre (ID) del símbolo.
     * @returns El identificador (nombre) del símbolo.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Método que obtiene el tipo de dato del símbolo.
     * @returns El tipo de dato asociado al símbolo (como cadena).
     */
    public getTipo(): string {
        return DataType[this.DataType];
    }

    /**
     * Método que obtiene la línea donde se declaró el símbolo.
     * @returns La línea de código donde se define el símbolo.
     */
    public getLinea(): number {
        return this.linea;
    }

    /**
     * Método que obtiene la columna donde se declaró el símbolo.
     * @returns La columna de código donde se define el símbolo.
     */
    public getColumna(): number {
        return this.columna;
    }

    // Setters

    /**
     * Método que asigna un nuevo valor al símbolo.
     * Verifica que el tipo de dato del nuevo valor coincida con el tipo de dato del símbolo antes de realizar la asignación.
     * 
     * @param v - El nuevo valor que se desea asignar al símbolo, empaquetado en un objeto `Result` (que contiene el valor y el tipo de dato).
     * @throws Error - Si el tipo de dato del nuevo valor no coincide con el tipo de dato del símbolo.
     */
    public setValor(v: Result) {
        if (v.DataType != this.DataType) {
            Errors.addError("Semántico", `El tipo de dato del valor asignado a la variable ${this.id} no coincide con el tipo de dato de la variable`, 0, 0);
        }
        this.valor = v.value;
    }

    /**
     * Método que asigna un nuevo identificador (ID) al símbolo.
     * @param nuevoId - El nuevo nombre del símbolo.
     */
    public setId(nuevoId: string): void {
        this.id = nuevoId;
    }

    /**
     * Método que asigna un nuevo tipo de dato al símbolo.
     * @param nuevoTipo - El nuevo tipo de dato del símbolo.
     */
    public setTipo(nuevoTipo: DataType): void {
        this.DataType = nuevoTipo;
    }

    /**
     * Método que asigna una nueva línea de declaración al símbolo.
     * @param nuevaLinea - La nueva línea de código donde se declaró el símbolo.
     */
    public setLinea(nuevaLinea: number): void {
        this.linea = nuevaLinea;
    }

    /**
     * Método que asigna una nueva columna de declaración al símbolo.
     * @param nuevaColumna - La nueva columna de código donde se declaró el símbolo.
     */
    public setColumna(nuevaColumna: number): void {
        this.columna = nuevaColumna;
    }

    public esConstante(): boolean {
        return this.isConst;
    }
}
