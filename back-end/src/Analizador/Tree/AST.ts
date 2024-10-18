import { Environment } from "../Environment/environment"; 
import { Instruction } from "../abstract/instruction";
import { DotGenerator } from './DotGenerator'; // Importa tu DotGenerator
import { Funct } from "../Instructions/Function";
let consola: string[] = [];

export class AST {

    private globalEnv: Environment | null = null; 
    private dotGenerator: DotGenerator; // Instancia de DotGenerator

    constructor(private instructions: Instruction[]) {
        this.dotGenerator = new DotGenerator(); // Inicializa el DotGenerator
    }

    interpreter(): string[] {
        this.globalEnv = new Environment(null, 'Global'); // Crea el entorno global
        consola = []; // Reinicia la consola
    
        // Fase 1: Registrar todas las funciones (y otras instrucciones necesarias) en el entorno global
        for (const instruction of this.instructions) {
            try {
                if (instruction instanceof Funct) { // Si es una definición de función
                    instruction.execute(this.globalEnv); // Registrar la función
                }
            } catch (error) {
                console.error(`Error al registrar función: ${error}`);
            }
        }
    
        // Fase 2: Ejecutar el resto de las instrucciones
        for (const instruction of this.instructions) {
            try {
                if (!(instruction instanceof Funct)) { // Evitar volver a registrar funciones
                    instruction.execute(this.globalEnv); // Ejecutar las otras instrucciones
                }
            } catch (error) {
                console.error(error); // Captura y muestra errores
            }
        }
    
        return consola; // Retorna la consola con los resultados de la ejecución
    }
    
    // Método para generar el código DOT usando DotGenerator
    public generateDot(): string {
        // Reinicia el estado del generador de nodos
        this.dotGenerator.reset();
        // Nodo raíz "INSTRUCCIONES"
        const rootNode = this.dotGenerator.addNode("INSTRUCCIONES");

        // Recorremos todas las instrucciones y generamos sus nodos
        for (const instruction of this.instructions) {
            const instructionNode = instruction.generateNode(this.dotGenerator);  // Pasa el DotGenerator a las instrucciones
            this.dotGenerator.addEdge(rootNode, instructionNode); // Conectamos el nodo raíz con las instrucciones
        }

        return this.dotGenerator.generateDot(); // Genera y retorna el DOT final
    }

    // Método para obtener el entorno global después de la ejecución del AST.
    getGlobalEnvironment(): Environment | null {
        return this.globalEnv;
    }
}

/**
 * Función que agrega un mensaje a la consola.
 * Esta función se utiliza para simular la salida de la consola donde se registran los mensajes generados durante la ejecución del programa.
 */
export function setConsole(value: any) {
    consola.push(value); 
}
