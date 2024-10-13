import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { Funct } from "./Function";
import { Declaration } from "../abstract/declaration";
import { DotGenerator } from "../Tree/DotGenerator";

/**
 * Clase `Execute` que representa la ejecución de un método específico.
 * Se utiliza como punto de inicio del programa, llamando al método indicado con parámetros.
 */
export class Execute extends Instruction {
    constructor(
        private id: string,                      // Identificador del método a ejecutar
        private parametros: { id: string, value: any }[], // Parámetros opcionales como una lista de {id, value}
        line: number,
        column: number
    ) {
        super(line, column);
    }

    /**
     * Método `execute` que busca y ejecuta el método en el entorno actual.
     * 
     * @param environment - El entorno de ejecución donde se buscará el método.
     */
    public execute(environment: Environment) {
        // Buscar el método en el entorno
        const metodo: Funct | null = environment.getFuncion(this.id);
        if (!metodo) {
            Errors.addError("Semántico", `El método ${this.id} no está definido.`, this.linea, this.columna);
            return;
        }

        // Crear un nuevo entorno para el método con el entorno actual como padre
        const methodEnv = new Environment(environment, `Método ${this.id}`);

        // Verificar que la cantidad de argumentos coincida con los parámetros del método
        const totalParametros = metodo.parametros.length;
        const totalParametrosLlamada = this.parametros.length;

        if (totalParametrosLlamada > totalParametros) {
            Errors.addError(
                "Semántico",
                `El método ${this.id} esperaba ${totalParametros} parámetros, pero se recibieron ${totalParametrosLlamada}.`,
                this.linea,
                this.columna
            );
            return;
        }

        // Declarar y reasignar parámetros utilizando la clase `Declaration`
        for (let i = 0; i < totalParametros; i++) {
            const parametro = metodo.parametros[i];
            const argumento = this.parametros.find(arg => arg.id === parametro.id)?.value ?? parametro.defaultValue;

            if (argumento === undefined) {
                Errors.addError(
                    "Semántico",
                    `El parámetro ${parametro.id} no tiene un valor asignado en la ejecución del método ${this.id}.`,
                    this.linea,
                    this.columna
                );
                return;
            }

            // Declaración del parámetro en el entorno del método
            const declaration = new Declaration(
                parametro.tipo,        // Tipo del parámetro
                [parametro.id],        // Nombre del parámetro
                argumento,             // Valor del argumento pasado
                false,                 // No es constante
                this.linea,            // Línea de la declaración
                this.columna           // Columna de la declaración
            );
            declaration.execute(methodEnv);
        }

        // Ejecutar el cuerpo del método
        metodo.statement.execute(methodEnv);
    }

    /**
     * Método para generar el nodo en formato DOT para visualización.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        const ejecutarNode = dotGenerator.addNode(`Ejecutar: ${this.id}`);
        
        if (this.parametros) {
            this.parametros.forEach((param) => {
                const paramNode = dotGenerator.addNode(`Param: ${param.id}, Valor: ${param.value}`);
                dotGenerator.addEdge(ejecutarNode, paramNode);
            });
        }

        return ejecutarNode;
    }
}
