import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import { Result, DataType } from "../expression/types";
import { Instruction } from "../abstract/instruction";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array";  // Importamos la clase Arreglo
import { DotGenerator } from "../Tree/DotGenerator";
export class MatrixDeclaration extends Instruction {
    private tipo: DataType;    // Tipo de datos de la matriz (int, string, etc.)
    private ids: string[];     // Lista de identificadores de la matriz
    private filas: Expression | null; // Número de filas de la matriz (expresión que se evalúa para tipo 1)
    private columnas: Expression | null;  // Número de columnas de la matriz (expresión que se evalúa para tipo 1)
    private values: Expression[][] | null; // Lista de listas de valores para tipo 2

    constructor(tipo: DataType, ids: string[], filas: Expression | null, columnas: Expression | null, values: Expression[][] | null, line: number, column: number) {
        super(line, column);  
        this.tipo = tipo;
        this.ids = ids;  
        this.filas = filas;  
        this.columnas = columnas;
        this.values = values;  // Usado para la declaración tipo 2
    }

    public execute(environment: Environment): Result {
        console.log(`[MatrixDeclaration] Iniciando declaración de matriz(es) ${this.ids.join(', ')} en línea ${this.linea}, columna ${this.columna}.`);

        // Si se proporciona una lista de valores (declaración tipo 2)
        if (this.values !== null) {
            this.declareWithValues(environment);
        }
        // Si se proporcionan expresiones para filas y columnas (declaración tipo 1)
        else if (this.filas !== null && this.columnas !== null) {
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
        console.log(`[MatrixDeclaration] Declaración con valores predefinidos.`);

        // Evaluar cada lista de valores en la lista bidimensional
        const valores = this.values!.map(row => {
            return row.map(valueExpr => {
                const result = valueExpr.execute(environment);
                console.log(`[MatrixDeclaration] Valor evaluado:`, result.value);

                // Verificar que el tipo de dato coincida
                if (result.DataType !== this.tipo) {
                    throw new Errors("Semántico", `Tipo de dato inválido en la lista de valores de la matriz. Se esperaba '${DataType[this.tipo]}', pero se obtuvo '${DataType[result.DataType]}'`, this.linea, this.columna);
                }
                return result.value;
            });
        });

        const dimensiones = [valores.length, valores[0].length];  // Dimensiones según la lista de valores

        // Crear la matriz con los valores predefinidos
        this.ids.forEach(id => {
            const matriz = new Arreglo<any>(id, this.tipo, dimensiones, valores);
            console.log(`[MatrixDeclaration] Guardando matriz '${id}' con valores predefinidos:`, valores);

            // Guardar en el entorno
            try {
                environment.SaveVariable(id, { value: matriz, DataType: this.tipo }, this.tipo, this.linea, this.columna, false);
                console.log(`[MatrixDeclaration] Matriz '${id}' guardada exitosamente en el entorno.`);
            } catch (error) {
                console.error(`[MatrixDeclaration] Error al guardar la matriz '${id}' en el entorno:`, error);
                throw new Errors("Semántico", `Error al declarar la matriz '${id}'`, this.linea, this.columna);
            }
        });
    }

    /**
     * Maneja la declaración con un tamaño especificado (tipo 1).
     */
    private declareWithSize(environment: Environment) {
        console.log(`[MatrixDeclaration] Declaración con tamaño especificado.`);

        // Evaluar el número de filas y columnas
        const filasResult: Result = this.filas!.execute(environment);
        const columnasResult: Result = this.columnas!.execute(environment);
        const numFilas = filasResult.value;
        const numColumnas = columnasResult.value;

        if (typeof numFilas !== 'number' || typeof numColumnas !== 'number' || numFilas <= 0 || numColumnas <= 0) {
            console.error(`[MatrixDeclaration] Error: Dimensiones inválidas.`);
            throw new Errors("Semántico", `Dimensiones de la matriz inválidas (filas: ${numFilas}, columnas: ${numColumnas})`, this.linea, this.columna);
        }

        console.log(`[MatrixDeclaration] Filas: ${numFilas}, Columnas: ${numColumnas}`);

        // Inicializar la matriz con valores por defecto
        const matriz = Arreglo.inicializarBidimensional(numFilas, numColumnas, this.getDefaultValueByType(this.tipo));
        console.log(`[MatrixDeclaration] Matriz inicializada con valores por defecto:`, matriz);

        // Crear la matriz y guardarla en el entorno
        this.ids.forEach(id => {
            console.log(`[MatrixDeclaration] Declarando matriz '${id}'...`);
            const nuevoArreglo = new Arreglo<any>(id, this.tipo, [numFilas, numColumnas], matriz);

            // Guardar en el entorno
            try {
                environment.SaveVariable(id, { value: nuevoArreglo, DataType: this.tipo }, this.tipo, this.linea, this.columna, false);
                console.log(`[MatrixDeclaration] Matriz '${id}' guardada exitosamente en el entorno.`);
            } catch (error) {
                console.error(`[MatrixDeclaration] Error al guardar la matriz '${id}' en el entorno:`, error);
                throw new Errors("Semántico", `Error al declarar la matriz '${id}'`, this.linea, this.columna);
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
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo principal para la declaración de la matriz con los identificadores
        const matrixDeclarationNode = dotGenerator.addNode(`MatrixDeclaration: ${this.ids.join(", ")}`);
    
        // Si es declaración con tamaño (tipo 1)
        if (this.filas && this.columnas) {
            const filasNode = this.filas.generateNode(dotGenerator);
            const columnasNode = this.columnas.generateNode(dotGenerator);
    
            // Crear nodo para el tamaño de la matriz y conectar los nodos de filas y columnas
            const sizeNode = dotGenerator.addNode("Size");
            dotGenerator.addEdge(sizeNode, filasNode);
            dotGenerator.addEdge(sizeNode, columnasNode);
            dotGenerator.addEdge(matrixDeclarationNode, sizeNode);
        }
    
        // Si es declaración con valores (tipo 2)
        if (this.values) {
            for (const row of this.values) {
                for (const expr of row) {
                    const valueNode = expr.generateNode(dotGenerator);
                    dotGenerator.addEdge(matrixDeclarationNode, valueNode); // Conectar cada valor de la matriz
                }
            }
        }
    
        return matrixDeclarationNode;
    }
    
    
}
