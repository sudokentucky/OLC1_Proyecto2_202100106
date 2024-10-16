import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import { Result } from "./types";
import Errors from "../Error/error";
import { Logical } from "./logical"; // Importamos la clase lógica
import { Relational } from "./relational"; // Importamos la clase relacional
import { DotGenerator } from "../Tree/DotGenerator";

export class Ternary extends Expression {
    constructor(
        private condition: Expression, 
        private trueExpression: Expression, 
        private falseExpression: Expression, 
        line: number, 
        column: number
    ) {
        super(line, column);
    }

    /**
     * Método que ejecuta la expresión ternaria.
     * Evalúa la condición, si es una expresión lógica o relacional, ejecuta y
     * devuelve el resultado de la expresión verdadera o falsa.
     * 
     * @param entorno - El entorno donde se ejecutan las expresiones (valores de las variables).
     * @returns Result - El resultado de la expresión verdadera o falsa.
     * @throws Errors - Si la condición no es booleana.
     */
    public execute(entorno: Environment): Result {
        // Evalúa la condición
        const conditionValue = this.condition.execute(entorno);

        // Verifica si la condición es una instancia de Relational o Logical
        if (!(this.condition instanceof Relational || this.condition instanceof Logical)) {
            throw new Errors(
                "Semántico", 
                `La condición del operador ternario debe ser una expresión relacional o lógica`,
                this.linea, 
                this.columna
            );
        }
        console.log(`[DEBUG] Condición de la expresión ternaria: ${conditionValue.value}`);

        // Verificamos si la condición tiene un valor booleano
        if (conditionValue.value === true) {
            console.log("la condicion es verdadera");
            const resultTrue = this.trueExpression.execute(entorno);
            console.log("[DEBUG] Resultado de la expresión verdadera: ", resultTrue);
            return { value: resultTrue.value, DataType: resultTrue.DataType };
        } else {
            console.log("la condicion es falsa");
            const resultFalse = this.falseExpression.execute(entorno);
            console.log(`[DEBUG] Resultado de la expresión falsa: ${resultFalse}`);
            return { value: resultFalse.value, DataType: resultFalse.DataType };
        }
    }

    public generateNode(dotGenerator: DotGenerator): string {
        // Generar nodos para la condición, la expresión verdadera y la expresión falsa
        const conditionNode = this.condition.generateNode(dotGenerator);
        const trueExpressionNode = this.trueExpression.generateNode(dotGenerator);
        const falseExpressionNode = this.falseExpression.generateNode(dotGenerator);
        
        // Crear el nodo para la operación ternaria
        const ternaryNode = dotGenerator.addNode("Ternary");
    
        // Conectar el nodo ternario con la condición, la expresión verdadera y la falsa
        dotGenerator.addEdge(ternaryNode, conditionNode);
        dotGenerator.addEdge(ternaryNode, trueExpressionNode);
        dotGenerator.addEdge(ternaryNode, falseExpressionNode);
    
        return ternaryNode;
    }
}
