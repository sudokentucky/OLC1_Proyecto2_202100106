import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
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
        console.log(`[DEBUG] Intentando ejecutar el método '${this.id}'`);

        // Buscar el método en el entorno
        const metodo= environment.getFuncion(this.id);
        if (!metodo) {
            Errors.addError("Semántico", `El método ${this.id} no está definido.`, this.linea, this.columna);
            console.log(`[ERROR] Método '${this.id}' no encontrado en el entorno`);
            return;
        }
        console.log(`[DEBUG] Método '${this.id}' encontrado`);

        // Crear un nuevo entorno para el método con el entorno actual como padre
        const exceEnv = environment.createSubEnvironment(`Ejecutar ${this.id}`);
        console.log(`[DEBUG] Entorno creado para el método '${this.id}'`);

        // Ejecutar el cuerpo del método
        console.log(`[DEBUG] Ejecutando el cuerpo del método '${this.id}'`);
        metodo.instructs.execute(exceEnv);
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
