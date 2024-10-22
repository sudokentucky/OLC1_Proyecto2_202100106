/**
 * Clase que define un error, ya sea léxico o sintáctico o semántico.
 * Los errores son una parte fundamental del análisis léxico y sintáctico, y esta clase proporciona una manera
 * de almacenar y gestionar la información relacionada con ellos.
 */
export default class Errors {
    private static errors: Errors[] = []; // Lista estática que almacena todos los errores
    private type: string;        // Tipo de error (léxico, sintáctico, semántico, etc.)
    private description: string; // Descripción del error
    private file: number;        // Número de línea en el archivo donde se encuentra el error
    private column: number;      // Número de columna en la línea donde se encuentra el error

    /**
     * Constructor de la clase `Errors`.
     * Inicializa un nuevo error con el tipo, descripción, línea y columna en el código.
     * 
     * @param type - El tipo de error (por ejemplo, "Léxico", "Sintáctico", "Semántico", etc.).
     * @param description - Una descripción detallada del error.
     * @param file - El número de la línea del archivo donde se detectó el error.
     * @param column - El número de columna donde ocurrió el error en la línea.
     */
    constructor(type: string, description: string, file: number, column: number) {
        this.type = type;            
        this.description = description; 
        this.file = file;            
        this.column = column;        
    }

    // Métodos Getters para acceder a los detalles del error

    public getType(): string {
        return this.type;
    }

    public getDescription(): string {
        return this.description;
    }

    public getFile(): number {
        return this.file;
    }

    public getColumn(): number {
        return this.column;
    }

    // Métodos Setters para modificar los detalles del error

    public setType(type: string): void {
        this.type = type;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setFile(file: number): void {
        this.file = file;
    }

    public setColumn(column: number): void {
        this.column = column;
    }

    // Métodos estáticos para gestionar errores a nivel global

    /**
     * Agrega un nuevo error a la lista global de errores.
     * 
     * @param type - Tipo de error.
     * @param description - Descripción del error.
     * @param file - Línea donde ocurrió el error.
     * @param column - Columna donde ocurrió el error.
     */
    public static addError(type: string, description: string, file: number, column: number): void {
        const error = new Errors(type, description, file, column);
        Errors.errors.push(error);
        console.log("Error añadido:", error);  // <-- Agrega este log para verificar
    }
    

    /**
     * Obtiene la lista de todos los errores almacenados.
     * @returns Un arreglo con todos los errores.
     */
    public static getErrors(): Errors[] {
        console.log("Obteniendo errores...");  // <-- Agrega este log para verificar
        return Errors.errors;
    }

    /**
     * Limpia la lista de errores.
     */
    public static clearErrors(): void {
        console.log("Limpiando errores...");  // <-- Agrega este log para verificar
        Errors.errors = [];
    }

    /**
     * Imprime todos los errores almacenados en formato de texto o JSON.
     * @returns Una representación de los errores en formato de texto.
     */
    public static printErrors(): string {
        return Errors.errors.map(error => 
            `Error ${error.getType()} en línea ${error.getFile()}, columna ${error.getColumn()}: ${error.getDescription()}`
        ).join('\n');
    }

    /**
     * Retorna la lista de errores en formato JSON.
     * @returns Un JSON que contiene todos los errores.
     */
    public static getErrorsAsJSON(): object[] {
        return Errors.errors.map(error => ({
            type: error.getType(),
            description: error.getDescription(),
            file: error.getFile(),
            column: error.getColumn(),
        }));
    }
}
