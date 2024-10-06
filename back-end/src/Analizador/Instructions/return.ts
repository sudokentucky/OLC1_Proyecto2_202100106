import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { Result, DataType } from "../expression/types";
import Errors from "../Error/error"; // Manejador de errores
import { DotGenerator } from "../Tree/DotGenerator";
/**
 * Clase `Return` que maneja las expresiones de retorno en una función o método.
 */
export class Return extends Instruction {
    private expression: Expression | null; // Expresión opcional para retornar un valor

    constructor(expression: Expression | null, line: number, column: number) {
        super(line, column);
        this.expression = expression;
    }

    /**
     * Método que ejecuta la instrucción de retorno.
     * 
     * @param environment - El entorno de ejecución actual donde se evaluará la expresión.
     * @returns Un `Result` con el valor de la expresión, o `null` si no hay expresión.
     */
    public execute(environment: Environment): Result | null {
        let value: Result | null = null;

        // Si existe una expresión, la evaluamos
        if (this.expression) {
            try {
                console.log("Evaluando la expresion en el retorno");
                value = this.expression.execute(environment);

                // Verificar si el valor es nulo o indefinido
                if (value === null || value === undefined) {
                    console.log("La expresión en el retorno no produjo un valor");
                    Errors.addError("Semántico", `La expresión en el retorno no produjo un valor`, this.linea, this.columna);
                    return null;
                }

                // Aquí puedes agregar la validación de tipo, por ejemplo, si la función espera retornar un entero:
                // if (expectedReturnType !== value.DataType) {
                //     Errors.addError("Semántico", `El tipo de retorno no coincide con el tipo esperado: ${expectedReturnType}`, this.linea, this.columna);
                //     return null;
                // }

            } catch (error) {
                Errors.addError("Semántico", `Error al evaluar la expresión en el retorno: ${error}`, this.linea, this.columna);
                return null;
            }
        } else {
            // Si no hay expresión, retornar un valor nulo
            return { value: null, DataType: DataType.NULO };
        }

        // Retornar el resultado de la expresión evaluada
        console.log("Retornando valor:", value, "de tipo", value.DataType);
        return {value: value.value, DataType: value.DataType};};
        
        public generateNode(dotGenerator: DotGenerator): string {
            // Si hay una expresión de retorno, generar el nodo para esa expresión
            if (this.expression) {
                const expressionNode = this.expression.generateNode(dotGenerator);
                
                // Crear el nodo de retorno y conectarlo con la expresión
                const returnNode = dotGenerator.addNode("Return");
                dotGenerator.addEdge(returnNode, expressionNode);
                
                return returnNode;
            }
            
            // Si no hay expresión, simplemente generar el nodo de retorno
            return dotGenerator.addNode("Return");
        }
        
        
    }
