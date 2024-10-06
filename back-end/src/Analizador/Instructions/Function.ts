import { Environment } from "../Environment/environment"; // Importamos el entorno
import { Instruction } from "../abstract/instruction";    // Clase base para las instrucciones
import { Statement } from "./statement";                 // Bloque de código que ejecutará la función
import { DataType } from "../expression/types";          // Para manejar tipos y resultados
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";
/**
 * Clase `Function` que representa una función dentro del entorno de ejecución.
 * 
 * Esta clase define una función que puede ser llamada en cualquier momento. La función contiene un
 * bloque de código (`Statement`) que se ejecutará cuando la función sea invocada. Además, la función
 * puede tener una lista de parámetros que se pasan cuando se invoca.
 */
export class Function extends Instruction {
    constructor(
        public id: string,                   // Identificador de la función
        public tipoRetorno: DataType,         // Tipo de retorno de la función
        public statement: Statement,          // Bloque de código (cuerpo de la función)
        public parametros: {                 // Parámetros de la función con tipos
            id: string, 
            tipo: DataType, 
            defaultValue?: any
        }[], 
        line: number, 
        column: number
    ) {
        super(line, column); // Llamada al constructor de la clase base Instruction
    }

    /**
     * Método `execute` que guarda la función en el entorno actual.
     * 
     * Este método añade la función al entorno, lo que permite que sea accesible y ejecutable
     * en el futuro. La función se guarda asociada a su identificador (`id`), permitiendo su
     * invocación posterior mediante su nombre.
     * 
     * @param environment - El entorno de ejecución actual (`Environment`) donde se almacenará la función.
     */
    public execute(environment: Environment) {
        // Verificar si ya existe una función con el mismo nombre en el entorno
        if (environment.getFuncion(this.id)) {
            Errors.addError("Semántico", `La función ${this.id} ya está definida`, this.linea, this.columna);
            return;
        }
        
        // Guarda la función en el entorno actual, asociándola a su identificador `id`.
        environment.guardarFuncion(this.id, this);
        console.log(`Función ${this.id} guardada correctamente en el entorno.`);
    }

    /**
     * Método `generateNode` que genera el nodo en formato DOT para Graphviz.
     * 
     * @param ast - Referencia al AST que contiene el contador de nodos.
     * @returns string - Representación en formato DOT del nodo de la función.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // 1. Crear nodo para la función con su identificador
        const functionNode = dotGenerator.addNode(`Función: ${this.id}`);
        
        // 2. Crear nodos para los parámetros de la función
        this.parametros.forEach((param) => {
            // Crear un nodo para cada parámetro con su tipo
            const paramNode = dotGenerator.addNode(`Parámetro: ${param.id} (${param.tipo})`);
            
            // Conectar el nodo de la función con el nodo del parámetro
            dotGenerator.addEdge(functionNode, paramNode);
        });
    
        // 3. Generar el nodo para el bloque de código (statement)
        const statementNode = this.statement.generateNode(dotGenerator);
        
        // Conectar el nodo de la función con el bloque de código
        dotGenerator.addEdge(functionNode, statementNode);
    
        // Retornar el nodo principal de la función
        return functionNode;
    }
    
}
