import { Environment } from "../Environment/environment";
import { Result, DataType } from "../expression/types";
import Errors from "../Error/error";
import { Declaration } from "../abstract/declaration";
import { Expression } from "../abstract/expression";
import { DotGenerator } from "../Tree/DotGenerator";

export class Call extends Expression {
    constructor(
        public id: string,              
        public args: { id: string, value: any }[],  // Argumentos que se pasan a la función como una lista de {id, value}
        line: number, 
        column: number
    ) {
        super(line, column); 
    }

    public execute(environment: Environment): Result {
        console.log(`[DEBUG] Iniciando llamada a la función: ${this.id}`);
        
        // Buscar la función en el entorno
        let funcion = environment.getFuncion(this.id);
        if (!funcion) {
            Errors.addError(
                "Semántico",
                `La función ${this.id} no está definida ni en el entorno local ni en el global.`,
                this.linea,
                this.columna
            );
            return { value: null, DataType: DataType.NULO };
        }

        // Obtener los parámetros de la función
        const parametros = funcion.getParametros();
        const totalParametros = parametros.length;
        const totalParametrosLlamada = this.args.length;

        // Verificar que la cantidad de argumentos no exceda el número de parámetros
        if (totalParametrosLlamada > totalParametros) {
            Errors.addError(
                "Semántico",
                `La función ${this.id} esperaba ${totalParametros} parámetros, pero se recibieron ${totalParametrosLlamada}.`,
                this.linea,
                this.columna
            );
            return { value: null, DataType: DataType.NULO };
        }

        // Crear un nuevo entorno para la función con el entorno actual como padre
        const functionEnvironment = new Environment(environment, `Función ${this.id}`);
        environment.agregarSubEntorno(functionEnvironment);

        // Asignar los parámetros en el nuevo entorno sin importar el orden
        for (let parametro of parametros) {
            // Buscar el argumento correspondiente por su id
            const argumento = this.args.find(arg => arg.id === parametro.id)?.value;

            // Si no se pasó el argumento, usar el valor por defecto
            const argumentoEvaluado = argumento !== undefined ? argumento : parametro.value;

            // Si el parámetro no tiene valor asignado (ni argumento ni valor por defecto), lanzar un error
            if (argumentoEvaluado === undefined) {
                Errors.addError(
                    "Semántico",
                    `El parámetro ${parametro.id} no tiene un valor asignado en la llamada a la función ${this.id}.`,
                    this.linea,
                    this.columna
                );
                return { value: null, DataType: DataType.NULO };
            }

            // Evaluar el argumento si es una expresión
            const valorEvaluado = argumentoEvaluado.evaluate
                ? argumentoEvaluado.evaluate(functionEnvironment)
                : argumentoEvaluado;

            // Declarar el parámetro en el nuevo entorno
            const declaration = new Declaration(
                parametro.tipo,
                [parametro.id], // Lista de identificadores (en este caso, un solo parámetro)
                valorEvaluado,
                this.linea,
                this.columna
            );
            declaration.execute(functionEnvironment); // Ejecutamos la declaración en el nuevo entorno
        }

        // Obtener y ejecutar el bloque de instrucciones de la función
        const instrucciones = funcion.getInstrucciones();
        const result = instrucciones.execute(functionEnvironment);

        // Devolver el resultado de la ejecución de la función (o un valor nulo si no hay retorno explícito)
        return result ? result : { value: null, DataType: DataType.NULO };
    }

    public generateNode(dotGenerator: DotGenerator): string {
        const functionCallNode = dotGenerator.addNode(`Llamada a Función: ${this.id}`);
        this.args.forEach((arg) => {
            let argNode: string;
            if (typeof arg.value.generateNode === 'function') {
                argNode = arg.value.generateNode(dotGenerator);
            } else {
                argNode = dotGenerator.addNode(`Basic: ${arg.value} (${DataType[arg.value.DataType]})`);
            }
            dotGenerator.addEdge(functionCallNode, argNode);
        });
        return functionCallNode;
    }
}
