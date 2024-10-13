import { Environment } from "../Environment/environment"; // Importa la clase Environment para manejar el entorno de ejecución
import { Instruction } from "../abstract/instruction";    // Importa la clase abstracta Instruction, de la que heredan las instrucciones
import { Return } from "./return";
import { DotGenerator } from "../Tree/DotGenerator";
import { Break, Continue } from "./transfer";

/**
 * Clase `Statement` que representa un bloque de instrucciones.
 * 
 * Esta clase permite ejecutar una lista de instrucciones en un entorno dado. No crea un nuevo entorno,
 * sino que reutiliza el que se le pasa como parámetro. Esta funcionalidad es útil para la ejecución de
 * bloques de código como funciones, ciclos, o bloques condicionales, donde el entorno de variables y
 * funciones debe permanecer constante.
 */
export class Statement extends Instruction {
    /**
     * Constructor de la clase `Statement`.
     * 
     * @param code - Un arreglo de instrucciones (`Instruction[]`) que representa el conjunto de instrucciones que se ejecutarán secuencialmente.
     * @param line - La línea del código donde se define el bloque, útil para la depuración y manejo de errores.
     * @param column - La columna del código donde se define el bloque.
     */
    constructor(private code: Instruction[], line: number, column: number) {
        // Llama al constructor de la clase base (Instruction) para asignar las propiedades `line` y `column`.
        super(line, column);
    }

    /**
     * Método `execute` que ejecuta todas las instrucciones dentro del bloque.
     * 
     * Este método recorre todas las instrucciones en el bloque y las ejecuta en el entorno actual,
     * reutilizando el entorno que se le pasa como parámetro. Si alguna de las instrucciones devuelve
     * un resultado no nulo, la ejecución del bloque se detiene y se devuelve dicho resultado.
     * 
     * @param environment - El entorno de ejecución actual (de tipo `Environment`), donde se encuentran las variables y funciones accesibles.
     * @returns El resultado de una instrucción si ésta devuelve un valor, o `undefined` si ninguna instrucción lo hace.
     */
    public execute(environment: Environment) {
        // Recorre cada instrucción en el arreglo `code` y las ejecuta secuencialmente.
        for (const inst of this.code) {
            try {
                // Ejecuta la instrucción `inst` utilizando el entorno existente `environment`.
                const result = inst.execute(environment);
    
                // Si la instrucción es una instancia de Return, detenemos la ejecución y retornamos el resultado.
                if (inst instanceof Return) {
                    return result;
                }
    
                // Verificar si la instrucción es Break o Continue
                if (inst instanceof Break || inst instanceof Continue) {
                    // Si encontramos un Break o Continue, devolvemos su propia instancia
                    return inst;
                }
    
                // Si el resultado no es `undefined` y su tipo corresponde a un `Return`, también lo retornamos.
                if (result !== undefined && result.type === "RETURN") {
                    return result;
                }
            } catch (error) {
                // En caso de que ocurra un error durante la ejecución de alguna instrucción, se captura y se imprime el error.
                console.error("Error ejecutando la instrucción:", error);
            }
        }
    
        // Si ninguna instrucción devuelve un resultado, se retorna `undefined`.
        return undefined;
    }
    

    /**
     * Método `generateNode` que genera el nodo para el generador de grafos DOT.
     * 
     * @param dotGenerator - Instancia de `DotGenerator` que permite crear nodos y aristas para representar el árbol.
     * @returns El nombre del nodo creado para este bloque de instrucciones.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo principal para el bloque de instrucciones `Statement`
        const statementNode = dotGenerator.addNode("Statement");
    
        // Generar y conectar los nodos para cada instrucción en el bloque
        for (const instruction of this.code) {
            const instructionNode = instruction.generateNode(dotGenerator);
            dotGenerator.addEdge(statementNode, instructionNode);
        }
    
        return statementNode;
    }
}
