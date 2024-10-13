import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { Funct } from "../Instructions/Function";
import { Declaration } from "../abstract/declaration";
import { Assignment } from "./assignment";
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
        
        // Buscar el método en el entorno
        const metodo: Funct | null = environment.getFuncion(this.id);
        if (!metodo) {
            Errors.addError(
                "Semántico",
                `El método ${this.id} no está definido.`,
                this.linea,
                this.columna
            );
            return;
        }

        // Crear un nuevo entorno para el método con el entorno actual como padre
        const methodEnvironment = new Environment(environment, `Método ${this.id}`);
        // Agregar el entorno del método como un subentorno del entorno actual
        environment.agregarSubEntorno(methodEnvironment);
        // Verificar que la cantidad de argumentos sea válida, considerando valores por defecto
        const totalParametros = metodo.parametros.length;
        const totalParametrosLlamada = this.args.length;

        if (totalParametrosLlamada > totalParametros) {
            Errors.addError(
                "Semántico",
                `El método ${this.id} esperaba ${totalParametros} parámetros, pero se recibieron ${totalParametrosLlamada}.`,
                this.linea,
                this.columna
            );
            return;
        }

        // Declarar y reasignar parámetros
        for (let i = 0; i < totalParametros; i++) {
            const parametro = metodo.parametros[i];
            const argumento = this.args.find(arg => arg.id === parametro.id)?.value ?? parametro.defaultValue;

            if (argumento === undefined) {
                Errors.addError(
                    "Semántico",
                    `El parámetro ${parametro.id} no tiene un valor asignado en la llamada al método ${this.id}.`,
                    this.linea,
                    this.columna
                );
                return;
            }

            // Verificar si la variable ya existe en el entorno y usar Assignment o Declaration
            if (methodEnvironment.getVariableInCurrentEnv(parametro.id)) {
                const assignment = new Assignment(parametro.id, argumento, this.linea, this.columna);
                assignment.execute(methodEnvironment);
            } else {
                const declaration = new Declaration(
                    parametro.tipo,
                    [parametro.id],
                    argumento,
                    false,
                    this.linea,
                    this.columna
                );
                declaration.execute(methodEnvironment);
            }
        }

        // Ejecutar el cuerpo del método (sin preocuparse por un valor de retorno)
        metodo.statement.execute(methodEnvironment);
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
