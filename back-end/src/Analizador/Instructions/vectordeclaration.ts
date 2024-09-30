import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { Result, DataType } from "../expression/types";
import { Expression } from "../abstract/expression";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array"; // Importamos la clase Arreglo

export class VectorDeclaration extends Instruction {
    private tipo: DataType;            // Tipo de dato del vector
    private ids: string[];             // Lista de identificadores del vector
    private size1: Expression | null;  // Tamaño del vector (para la declaración tipo 1)
    private values: Expression[] | null; // Lista de valores (para la declaración tipo 2)

    constructor(tipo: DataType, ids: string[], size1: Expression | null, values: Expression[] | null, line: number, column: number) {
        super(line, column);
        this.tipo = tipo;
        this.ids = ids;                // Recibimos un array de identificadores, aunque sea uno solo
        this.size1 = size1;            // Usado para la declaración tipo 1
        this.values = values;          // Usado para la declaración tipo 2
    }

    public execute(environment: Environment): Result {
        console.log(`[VectorDeclaration] Iniciando declaración de vector(es) ${this.ids.join(', ')} en línea ${this.linea}, columna ${this.columna}.`);

        // Si se proporciona una lista de valores (declaración tipo 2)
        if (this.values !== null) {
            this.declareWithValues(environment);
        }
        // Si se proporciona una expresión de tamaño (declaración tipo 1)
        else if (this.size1 !== null) {
            this.declareWithSize(environment);
        } else {
            throw new Errors("Semántico", `Declaración inválida. Debe proporcionarse un tamaño o una lista de valores.`, this.linea, this.columna);
        }

        return { value: null, DataType: DataType.NULO };
    }

    /**
     * Maneja la declaración con valores predefinidos (tipo 2).
     */
    private declareWithValues(environment: Environment) {
        console.log(`[VectorDeclaration] Declaración con valores predefinidos.`);

        // Evaluar cada valor en la lista de valores
        const valores = this.values!.map(valueExpr => {
            const result = valueExpr.execute(environment);
            console.log(`[VectorDeclaration] Valor evaluado:`, result.value);
            
            // Verificar que el tipo de dato coincida
            if (result.DataType !== this.tipo) {
                throw new Errors("Semántico", `Tipo de dato inválido en la lista de valores del vector. Se esperaba '${DataType[this.tipo]}', pero se obtuvo '${DataType[result.DataType]}'`, this.linea, this.columna);
            }
            return result.value;
        });

        const dimensiones = [valores.length];  // El tamaño del vector es el tamaño de la lista de valores

        // Crear el vector con los valores predefinidos
        this.ids.forEach(id => {
            const vector = new Arreglo<typeof valores[0]>(id, this.tipo, dimensiones, valores);
            console.log(`[VectorDeclaration] Guardando vector '${id}' con valores predefinidos:`, valores);

            // Guardar en el entorno
            try {
                environment.SaveVariable(id, { value: vector, DataType: this.tipo }, this.tipo, this.linea, this.columna, false);
                console.log(`[VectorDeclaration] Vector '${id}' guardado exitosamente en el entorno.`);
            } catch (error) {
                console.error(`[VectorDeclaration] Error al guardar el vector '${id}' en el entorno:`, error);
                throw new Errors("Semántico", `Error al declarar el vector '${id}'`, this.linea, this.columna);
            }
        });
    }

    /**
     * Maneja la declaración con un tamaño especificado (tipo 1).
     */
    private declareWithSize(environment: Environment) {
        console.log(`[VectorDeclaration] Declaración con tamaño especificado.`);

        // Evaluar el tamaño del vector
        const sizeResult: Result = this.size1!.execute(environment);
        const sizeValue1 = sizeResult.value;

        if (typeof sizeValue1 !== 'number' || sizeValue1 <= 0) {
            console.error(`[VectorDeclaration] Error: El tamaño '${sizeValue1}' no es válido.`);
            throw new Errors("Semántico", `El tamaño del vector no es válido.`, this.linea, this.columna);
        }

        console.log(`[VectorDeclaration] Tamaño del vector evaluado: ${sizeValue1}`);

        // Dimensiones del vector unidimensional
        const dimensiones = [sizeValue1];

        // Obtener el valor por defecto para inicializar el vector según el tipo de dato
        const defaultValue = this.getDefaultValueByType(this.tipo);
        console.log(`[VectorDeclaration] Valor por defecto para el tipo '${DataType[this.tipo]}': ${defaultValue}`);

        // Inicializar el vector con el valor por defecto
        const valores = Arreglo.inicializarUnidimensional(sizeValue1, defaultValue);
        console.log(`[VectorDeclaration] Vector inicializado con dimensiones: [${sizeValue1}] y valores:`, valores);

        // Crear el vector y guardarlo en el entorno
        this.ids.forEach(id => {
            console.log(`[VectorDeclaration] Declarando vector '${id}'...`);
            const vector = new Arreglo<typeof defaultValue>(id, this.tipo, dimensiones, valores);

            // Guardar en el entorno
            try {
                environment.SaveVariable(id, { value: vector, DataType: this.tipo }, this.tipo, this.linea, this.columna, false);
                console.log(`[VectorDeclaration] Vector '${id}' guardado exitosamente en el entorno.`);
            } catch (error) {
                console.error(`[VectorDeclaration] Error al guardar el vector '${id}' en el entorno:`, error);
                throw new Errors("Semántico", `Error al declarar el vector '${id}'`, this.linea, this.columna);
            }
        });
    }

    /**
     * Obtiene el valor por defecto según el tipo de dato proporcionado.
     */
    private getDefaultValueByType(tipo: DataType): any {
        switch (tipo) {
            case DataType.ENTERO:
                return 0;      // Valor por defecto para enteros
            case DataType.DECIMAL:
                return 0.0;    // Valor por defecto para decimales
            case DataType.STRING:
                return "";     // Valor por defecto para cadenas
            case DataType.BOOLEANO:
                return false;  // Valor por defecto para booleanos
            case DataType.CHAR:
                return '\0';   // Valor por defecto para caracteres
            case DataType.NULO:
            default:
                return null;   // Valor por defecto para nulos
        }
    }
}
