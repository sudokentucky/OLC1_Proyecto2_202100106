import { setConsole } from "../Tree/AST";
import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";
import { DataType } from "../expression/types";
import { DotGenerator } from "../Tree/DotGenerator";
export class Echo extends Instruction {
    constructor(private expression: Expression, line: number, column: number) {
        super(line, column);
    }

    /**
     * Ejecuta la instrucción de impresión.
     * Evalúa la expresión y manda su valor a la consola.
     * Si el valor es null o undefined, imprime "null" en la consola.
     * @param environment - El entorno actual donde se ejecuta la instrucción.
     */
    public execute(environment: Environment) {
        try {
            // Ejecutar la expresión y obtener el resultado
            const value = this.expression.execute(environment);

            // Asegurarse de que el valor evaluado no es null o undefined
            if (value && value.value != null) {
                let result: string;

                // Verificar el tipo de dato y formatear según corresponda
                switch (value.DataType) {
                    case DataType.STRING:
                        // Limpiar la cadena para eliminar comillas y caracteres escapados
                        result = value.value
                            .replace(/\\\"/g, '"')   // Reemplazar comillas escapadas
                            .replace(/\\n/g, '\n')   // Nueva línea
                            .replace(/\\t/g, '\t')   // Tabulación
                            .replace(/\\r/g, '\r')   // Retorno de carro
                            .replace(/\\\\/g, '\\')  // Barra invertida
                            .replace(/^\"|\"$/g, ''); // Eliminar comillas al principio y al final
                        break;

                    default:
                        // Para tipos numéricos o booleanos, simplemente convertimos a string
                        result = value.value.toString();
                        break;
                }

                // Eliminar espacios innecesarios al inicio y al final
                result = result.trim();

                // Enviar el valor limpio a la consola
                console.log(result);
                setConsole(result);

            } else {
                // Si no hay valor, imprimir "null"
                setConsole("null");
            }
        } catch (error) {
            // Captura cualquier error durante la evaluación de la expresión o la impresión
            setConsole("Error al ejecutar la instrucción Print: " + error);
        }
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión que se va a imprimir
        const expressionNode = this.expression.generateNode(dotGenerator);
    
        // Crear el nodo principal para la instrucción `Echo`
        const echoNode = dotGenerator.addNode("Echo");
    
        // Conectar el nodo de `Echo` con el nodo de la expresión
        dotGenerator.addEdge(echoNode, expressionNode);
    
        return echoNode;
    }
    

}
