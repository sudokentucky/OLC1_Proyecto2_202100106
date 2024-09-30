import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import { Result, DataType } from "./types";
import Errors from "../Error/error";

export class Ternary extends Expression {
    constructor(private condition: Expression, private trueExpression: Expression, private falseExpression: Expression, line: number, column: number) {
        super(line, column);
    }

    /**
     * Método que ejecuta la expresión ternaria.
     * Evalúa la condición, si es verdadera devuelve el resultado de la expresión verdadera,
     * de lo contrario, devuelve el resultado de la expresión falsa.
     * 
     * @param entorno - El entorno donde se ejecutan las expresiones (valores de las variables).
     * @returns Result - El resultado de la expresión verdadera o falsa.
     * @throws Errors - Si la condición no es booleana.
     */
    public execute(entorno: Environment): Result {
        // Evalúa la condición
        const conditionValue = this.condition.execute(entorno);

        // Verifica que la condición sea de tipo booleano
        if (conditionValue.DataType !== DataType.BOOLEANO) {
            throw new Errors(
                "Semántico", 
                `La condición del operador ternario debe ser booleana, pero se encontró ${conditionValue.DataType}`,
                this.linea, 
                this.columna
            );
        }

        // Si la condición es verdadera, se evalúa y devuelve la expresión verdadera
        if (conditionValue.value === true) {
            return this.trueExpression.execute(entorno);
        } else {
            // Si la condición es falsa, se evalúa y devuelve la expresión falsa
            return this.falseExpression.execute(entorno);
        }
    }
}
