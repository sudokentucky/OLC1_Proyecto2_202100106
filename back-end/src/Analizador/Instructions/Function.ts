import { Environment } from "../Environment/environment"; // Importamos el entorno
import { Instruction } from "../abstract/instruction";    // Clase base para las instrucciones
import { Statement } from "./statement";                 // Bloque de código que ejecutará la función o método
import { DataType } from "../expression/types";          // Para manejar tipos y resultados
import { DotGenerator } from "../Tree/DotGenerator";

/**
 * Clase `Function` que representa tanto funciones como métodos dentro del entorno de ejecución.
 * 
 * Los métodos se diferencian de las funciones en que no retornan ningún valor, representado por `void`.
 */
export class Funct extends Instruction {
    constructor(
        public id: string,                   // Identificador de la función o método
        public tipoRetorno: DataType,         // Tipo de retorno: si es método, debe ser VOID o NULO
        public instructs: Statement,          // Bloque de código (cuerpo de la función o método)
        public parametros: {                 // Parámetros de la función o método con tipos
            id: string, 
            tipo: DataType, 
            value: any
        }[], 
        line: number, 
        column: number
    ) {
        super(line, column); // Llamada al constructor de la clase base Instruction
    }

    /**
     * Método `execute` que guarda la función o método en el entorno actual.
     * 
     * Este método añade la función o método al entorno, lo que permite que sea accesible y ejecutable
     * en el futuro. La función o método se guarda asociada a su identificador (`id`).
     * 
     * @param environment - El entorno de ejecución actual (`Environment`) donde se almacenará la función o método.
     */
    public execute(environment: Environment) {
        const globalEnv = environment.getGlobal();
        // Guardar la función o método en el entorno global
        globalEnv.guardarFuncion(this.id, this, this.linea, this.columna);
        console.log(`Función o método ${this.id} guardado correctamente en el entorno.`);
    }

    /**
     * Método `getParametros` que devuelve los parámetros de la función o método.
     * 
     * @returns {Array} - Lista de parámetros con sus tipos y valores.
     */
    public getParametros() {
        return this.parametros;
    }

    /**
     * Método `getInstrucciones` que devuelve el bloque de instrucciones (cuerpo) de la función o método.
     * 
     * @returns {Statement} - El bloque de código asociado a la función.
     */
    public getInstrucciones(): Statement {
        return this.instructs;
    }
    
    /**
     * Método `generateNode` que genera el nodo en formato DOT para Graphviz.
     * 
     * @param dotGenerator - Referencia al AST que contiene el contador de nodos.
     * @returns string - Representación en formato DOT del nodo de la función o método.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // 1. Crear nodo para la función o método con su identificador
        const nodeType = this.tipoRetorno === DataType.NULO ? "Método" : "Función";
        const functionNode = dotGenerator.addNode(`${nodeType}: ${this.id}`);
        
        // 2. Crear nodos para los parámetros de la función o método
        this.parametros.forEach((param) => {
            // Crear un nodo para cada parámetro con su tipo
            const paramNode = dotGenerator.addNode(`Parámetro: ${param.id} (${param.tipo})`);
            
            // Conectar el nodo de la función o método con el nodo del parámetro
            dotGenerator.addEdge(functionNode, paramNode);
        });
    
        // 3. Generar el nodo para el bloque de código (statement)
        const statementNode = this.instructs.generateNode(dotGenerator);
        
        // Conectar el nodo de la función o método con el bloque de código
        dotGenerator.addEdge(functionNode, statementNode);
    
        // Retornar el nodo principal de la función o método
        return functionNode;
    }
}
