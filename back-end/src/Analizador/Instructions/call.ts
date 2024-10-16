import { Environment } from "../Environment/environment";
import { Result, DataType } from "../expression/types";
import Errors from "../Error/error";
import { Declaration } from "../abstract/declaration";
import { Expression } from "../abstract/expression";
import { DotGenerator } from "../Tree/DotGenerator";

export class Call extends Expression {
    constructor(
        public id: string,              
        public args: { id: string, value: any }[],  
        line: number, 
        column: number
    ) {
        super(line, column); 
    }

    public execute(environment: Environment): Result {
        console.log(`[DEBUG] Iniciando llamada a la función: ${this.id}`);
        
        // Intentar buscar la función en el entorno local o en los padres
        let funcion = environment.getFuncion(this.id);
        
        // Si no se encuentra la función, intentamos buscarla en el entorno global
        if (!funcion) {
                Errors.addError(
                    "Semántico",
                    `La función ${this.id} no está definida ni en el entorno local ni en el global.`,
                    this.linea,
                    this.columna
                );
                return { value: null, DataType: DataType.NULO };
        
        }


        // Obtener los parámetros de la función usando el método getParametros
        const parametros = funcion.getParametros();
        const totalParametros = parametros.length;
        const totalParametrosLlamada = this.args.length;

        // Verificar que la cantidad de argumentos sea válida
        if (totalParametrosLlamada > totalParametros) {
            throw new Error(`La función ${this.id} esperaba ${totalParametros} parámetros, pero se recibieron ${totalParametrosLlamada}.`);
        }
        // Crear un nuevo entorno para la función con el entorno actual como padre
        const functionEnvironment = environment.createSubEnvironment(`Función ${this.id}`);

        // Declarar y reasignar parámetros
        for (let i = 0; i < totalParametros; i++) {
            const parametro = parametros[i];
            const argumento = this.args[i] ? this.args[i].value : parametro.value;

            if (argumento === undefined) {
                throw new Error(`El parámetro ${parametro.id} no tiene un valor asignado en la llamada a la función ${this.id}.`);
            }

                //Si el argumento es una expresión, se debe evaluar
                const declaration = new Declaration(
                    parametro.tipo,
                    [parametro.id],
                    argumento,
                    this.linea,
                    this.columna
                );
                declaration.execute(functionEnvironment);
            
        }

        // Obtener el bloque de código de la función usando getInstrucciones
        const instrucciones = funcion.getInstrucciones();

        // Ejecutar el cuerpo de la función
        const result = instrucciones.execute(functionEnvironment);
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
