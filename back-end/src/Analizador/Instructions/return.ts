import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { Result, DataType } from "../expression/types";
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
        //Si el valor de la expresion no es nulo, ejecutar la expresion
        if (this.expression != null){
            const value = this.expression.execute(environment);
            //Retornar el valor de la expresion
            console.log("Return con expresion");
            return { value: value.value, DataType: value.DataType };
        }else{
            //Si no hay expresion, retornar un nulo, con tipo return
            console.log("Return sin expresion");
            return { value: null, DataType: DataType.RETURN };
        }

        }
    
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
