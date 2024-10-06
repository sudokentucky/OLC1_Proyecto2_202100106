import { Environment } from "../Environment/environment";
import { Result, DataType } from "../expression/types";
import Errors from "../Error/error";
import { Function } from "../Instructions/Function"; // Importamos la clase Function para manejar la ejecución
import { Expression } from "../abstract/expression";
import { DotGenerator } from "../Tree/DotGenerator";
/**
 * Clase `Call` que representa la llamada a una función o método dentro del entorno de ejecución.
 */
export class Call extends Expression {
    constructor(
        public id: string,              // Identificador de la función o método
        public args: Result[],          // Argumentos que se pasan a la función
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
        // Buscar la función en el entorno
        const funcion: Function | null = environment.getFuncion(this.id);

        if (funcion == null) {
            Errors.addError("Semántico", `La función ${this.id} no existe`, this.linea, this.columna);
            // En lugar de retornar `null`, retornamos un `Result` con valor `null` y tipo `NULO`
            return { value: null, DataType: DataType.NULO };
        }

        // Crear un subentorno para la ejecución de la función
        const subEntorno = new Environment(environment);
        console.log("Subentorno creado para la función", this.id);

        // Verificar que los argumentos coincidan con los parámetros
        if (this.args.length > funcion.parametros.length) {
            Errors.addError("Semántico", `Se pasaron más argumentos de los esperados en la función ${this.id}`, this.linea, this.columna);
            // Retornar un valor nulo de tipo `NULO` en caso de error
            return { value: null, DataType: DataType.NULO };
        }

        // Asignar los parámetros al subentorno
        for (let i = 0; i < funcion.parametros.length; i++) {
            const param = funcion.parametros[i];
            const valor = this.args[i] != null ? this.args[i].value : param.defaultValue;

            if (valor === undefined) {
                Errors.addError("Semántico", `Falta el argumento para el parámetro ${param.id} en la función ${this.id}`, this.linea, this.columna);
                return { value: null, DataType: DataType.NULO };
            }

            // Guardar el parámetro en el subentorno
            subEntorno.SaveVariable(param.id, { value: valor, DataType: param.tipo }, param.tipo, this.linea, this.columna, false);
        }

        // Ejecutar el cuerpo de la función en el subentorno
        const resultado = funcion.statement.execute(subEntorno);

        // Verificar si el resultado es válido y devolver el valor retornado
        if (resultado && 'value' in resultado && 'DataType' in resultado) {
            console.log(`Función ${this.id} ejecutada correctamente. Retornando valor:`, resultado.value, "de tipo", resultado.DataType);
            return resultado;
        }

        // Si no hay valor de retorno explícito, retornar un `Result` de tipo `NULO`
        return { value: null, DataType: DataType.NULO };
    }

    /**
     * Genera el nodo DOT para la llamada a la función.
     * 
     * @param ast - Referencia al AST que contiene el contador de nodos.
     * @returns string - Representación en formato DOT del nodo de la llamada a la función.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo para la llamada a la función con el identificador de la función
        const functionCallNode = dotGenerator.addNode(`Llamada a Función: ${this.id}`);
    
        // Generar nodos para los argumentos y conectarlos al nodo de la función
        this.args.forEach((arg, index) => {
            // Crear el nodo para cada argumento
            const argNode = dotGenerator.addNode(`Arg${index + 1}: ${arg.value}`);
            
            // Conectar el nodo de la función con el nodo del argumento
            dotGenerator.addEdge(functionCallNode, argNode);
        });
    
        return functionCallNode;
    }
    
}
