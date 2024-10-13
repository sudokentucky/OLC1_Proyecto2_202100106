import { Environment } from "../Environment/environment";
import { Result, DataType } from "../expression/types";
import Errors from "../Error/error";
import { Funct } from "../Instructions/Function";
import { Declaration } from "../abstract/declaration";
import { Assignment } from "./assignment";
import { Expression } from "../abstract/expression";
import { DotGenerator } from "../Tree/DotGenerator";

/**
 * Clase `Call` que representa la llamada a una función o método dentro del entorno de ejecución.
 */
export class Call extends Expression {
    constructor(
        public id: string,              // Identificador de la función o método
        public args: { id: string, value: any }[],  // Argumentos que se pasan a la función como una lista de {id, value}
        line: number, 
        column: number
    ) {
        super(line, column); // Llamada al constructor de la clase base Expression
    }

    /**
     * Ejecuta la llamada a la función dentro de un entorno.
     * 
     * @param environment - El entorno donde se buscará y ejecutará la función.
     * @returns Un resultado (Result) con el valor de retorno, o un `Result` de tipo `NULO` si no hay valor de retorno.
     */
    public execute(environment: Environment): Result {
        console.log(`[DEBUG] Iniciando llamada a la función: ${this.id}`);
        
        // Buscar la función en el entorno
        const funcion: Funct | null = environment.getFuncion(this.id);
        if (!funcion) {
            Errors.addError(
                "Semántico",
                `La función ${  this.id} no está definida.`,
                this.linea,
                this.columna
            );
            return { value: null, DataType: DataType.NULO };
        }
    
        // Crear un nuevo entorno para la función con el entorno actual como padre
        const functionEnvironment = new Environment(environment, `Función ${this.id}`);
        //se agrega el entorno de la funcion como un subentorno del entorno actual
        environment.agregarSubEntorno(functionEnvironment);
    
        // Verificar que la cantidad de argumentos sea válida, considerando valores por defecto
        const totalParametros = funcion.parametros.length;
        const totalParametrosLlamada = this.args.length;
    
        if (totalParametrosLlamada > totalParametros) {
            throw new Error(`La función ${this.id} esperaba ${totalParametros} parámetros, pero se recibieron ${totalParametrosLlamada}.`);
        }
    
        // Declarar y reasignar parámetros
        for (let i = 0; i < totalParametros; i++) {
            const parametro = funcion.parametros[i];
            const argumento = this.args[i] ? this.args[i].value : parametro.defaultValue;
    
            if (argumento === undefined) {
                throw new Error(`El parámetro ${parametro.id} no tiene un valor asignado en la llamada a la función ${this.id}.`);
            }
    
            // Verificar si la variable ya existe en el entorno local
            if (functionEnvironment.getVariableInCurrentEnv(parametro.id)) {
                const assignment = new Assignment(parametro.id, argumento, this.linea, this.columna);
                assignment.execute(functionEnvironment);
            } else {
                const declaration = new Declaration(
                    parametro.tipo,
                    [parametro.id],
                    argumento,
                    false,
                    this.linea,
                    this.columna
                );
                declaration.execute(functionEnvironment);
            }
        }
    
        // Ejecutar el cuerpo de la función
        const result = funcion.statement.execute(functionEnvironment);
        return result ? result : { value: null, DataType: DataType.NULO };
    }

/**
 * Genera el nodo DOT para la llamada a la función.
 * 
 * @param dotGenerator - Referencia al generador de nodos para la visualización.
 * @returns string - Representación en formato DOT del nodo de la llamada a la función.
 */
public generateNode(dotGenerator: DotGenerator): string {
    // Crear el nodo para la llamada a la función con el identificador de la función
    const functionCallNode = dotGenerator.addNode(`Llamada a Función: ${this.id}`);
    
    // Generar nodos para los argumentos y conectarlos al nodo de la función
    this.args.forEach((arg) => {
        // Si el valor del argumento es una expresión (como un número, acceso a variable, etc.), generamos su nodo
        let argNode: string;

        if (typeof arg.value.generateNode === 'function') {
            // Si el argumento es una expresión compleja (que puede ser un AST en sí misma)
            argNode = arg.value.generateNode(dotGenerator);
        } else {
            // Si es un valor básico (literal como un número), lo tratamos como un valor básico
            argNode = dotGenerator.addNode(`Basic: ${arg.value} (${DataType[arg.value.DataType]})`);
        }

        // Conectar el nodo del argumento al nodo de la función
        dotGenerator.addEdge(functionCallNode, argNode);
    });

    return functionCallNode;
}

}