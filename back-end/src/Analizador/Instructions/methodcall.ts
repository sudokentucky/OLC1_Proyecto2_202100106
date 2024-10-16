import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { Declaration } from "../abstract/declaration";
import { Instruction } from "../abstract/instruction";
import { DotGenerator } from "../Tree/DotGenerator";

/**
 * Clase `MethodCall` que representa la llamada a un método dentro del entorno de ejecución.
 * Extiende `Instruction` ya que un método es considerado una instrucción (no produce un valor).
 */
export class MethodCall extends Instruction {
    constructor(
        public id: string,              // Identificador del método
        public args: { id: string, value: any }[],  // Argumentos que se pasan al método como una lista de {id, value}
        line: number, 
        column: number
    ) {
        super(line, column); // Llamada al constructor de la clase base Instruction
    }

    /**
     * Ejecuta la llamada al método dentro de un entorno.
     * 
     * @param environment - El entorno donde se buscará y ejecutará el método.
     */
    public execute(environment: Environment): void {
        console.log(`[DEBUG] Iniciando llamada al método: ${this.id}`);
        console.log(`[DEBUG] Argumentos de la llamada:`, this.args);
        
        // Buscar el método en el entorno local o en los entornos padres
        let metodo = environment.getFuncion(this.id);
            if (!metodo) {
                Errors.addError(
                    "Semántico",
                    `El método ${this.id} no está definido ni en el entorno local ni en el global.`,
                    this.linea,
                    this.columna
                );
                return;
            }
        // Obtener los parámetros del método utilizando el método getParametros()
        const parametros = metodo.getParametros();
        const totalParametros = parametros.length;
        const totalParametrosLlamada = this.args.length;

        // Verificar que la cantidad de argumentos sea válida, considerando valores por defecto
        if (totalParametrosLlamada > totalParametros) {
            Errors.addError(
                "Semántico",
                `El método ${this.id} esperaba ${totalParametros} parámetros, pero se recibieron ${totalParametrosLlamada}.`,
                this.linea,
                this.columna
            );
            return;
        }

        // Crear un nuevo entorno para el método con el entorno actual como padre
        const methodEnvironment = environment.createSubEnvironment(`Metodo ${this.id}`);


        // Declarar y asignar parámetros directamente en el nuevo entorno
        for (let i = 0; i < totalParametros; i++) {
            const parametro = parametros[i];
            const argumento = this.args.find(arg => arg.id === parametro.id)?.value ?? parametro.value;

            if (argumento === undefined) {
                Errors.addError(
                    "Semántico",
                    `El parámetro ${parametro.id} no tiene un valor asignado en la llamada al método ${this.id}.`,
                    this.linea,
                    this.columna
                );
                return;
            }

            // Declaramos el parámetro en el nuevo entorno
            const declaration = new Declaration(
                parametro.tipo,
                [parametro.id], // Lista de identificadores (en este caso, un solo parámetro)
                argumento,
                this.linea,
                this.columna
            );
            declaration.execute(methodEnvironment); // Ejecutamos la declaración en el nuevo entorno
        }

        // Obtener el bloque de instrucciones del método utilizando el método getInstrucciones()
        const instrucciones = metodo.getInstrucciones();

        // Ejecutar el cuerpo del método en el nuevo entorno
        instrucciones.execute(methodEnvironment);
    }

    /**
     * Genera el nodo DOT para la llamada al método.
     * 
     * @param dotGenerator - Referencia al generador de nodos para la visualización.
     * @returns string - Representación en formato DOT del nodo de la llamada al método.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo para la llamada al método con el identificador del método
        const methodCallNode = dotGenerator.addNode(`Llamada a Método: ${this.id}`);
    
        // Generar nodos para los argumentos y conectarlos al nodo del método
        this.args.forEach((arg, index) => {
            const argNode = dotGenerator.addNode(`Arg${index + 1}: ${arg.value}`);
            dotGenerator.addEdge(methodCallNode, argNode);
        });
    
        return methodCallNode;
    }
}
