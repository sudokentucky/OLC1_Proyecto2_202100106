import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import { Result, DataType } from "./types";
import Errors from "../Error/error";


export enum LogicalOption {
    AND,  // &&
    OR,   // ||
    NOT   /* ! */
}

export class Logical extends Expression {
    constructor(private left: Expression, private right: Expression | null, private operator: LogicalOption, line: number, column: number) {
        super(line, column);
    }

    /**
     * Método que ejecuta la expresión lógica.
     * Evalúa la expresión según el operador lógico seleccionado (AND, OR, NOT).
     * @param entorno - El entorno donde se ejecuta la expresión (valores de las variables).
     * @returns Result - El valor booleano de la operación lógica junto con su tipo de dato.
     * @throws Errors - Si los tipos de datos no son booleanos o si el operador es inválido.
     */
    public execute(entorno: Environment): Result {
        // Ejecuta la expresión izquierda
        const leftValue = this.left.execute(entorno);

        // Verifica que el tipo de dato de la expresión izquierda sea booleano
        if (leftValue.DataType != DataType.BOOLEANO) {
            // Si no es booleano, lanza un error semántico
            throw new Errors(
                "Semántico", 
                `Tipo de dato no booleano en expresión lógica izquierda (esperado BOOLEANO, recibido ${leftValue.DataType})`, 
                this.linea, 
                this.columna
            );
        }

        // Manejo del operador NOT, que es un operador unario (solo evalúa una expresión)
        if (this.operator == LogicalOption.NOT) {
            return { value: !leftValue.value, DataType: DataType.BOOLEANO };
        }

        // Para operadores AND y OR, necesitamos verificar la expresión derecha
        if (this.right === null) {
            // Error semántico si falta la expresión derecha
            throw new Errors(
                "Semántico", 
                "Operador AND/OR necesita dos operandos", 
                this.linea, 
                this.columna
            );
        }

        // Ejecuta la expresión derecha
        const rightValue = this.right.execute(entorno);

        // Verifica que el tipo de dato de la expresión derecha sea booleano
        if (rightValue.DataType != DataType.BOOLEANO) {
            // Si no es booleano, lanza un error semántico
            throw new Errors(
                "Semántico", 
                `Tipo de dato no booleano en expresión lógica derecha (esperado BOOLEANO, recibido ${rightValue.DataType})`, 
                this.linea, 
                this.columna
            );
        }

        // Manejo de operadores lógicos binarios (AND y OR)
        switch (this.operator) {
            case LogicalOption.AND:
                // && (AND): ambas expresiones deben ser verdaderas para devolver true
                return { value: leftValue.value && rightValue.value, DataType: DataType.BOOLEANO };

            case LogicalOption.OR:
                // || (OR): al menos una expresión debe ser verdadera para devolver true
                return { value: leftValue.value || rightValue.value, DataType: DataType.BOOLEANO };

            default:
                // Si el operador lógico no es reconocido, lanza un error semántico
                throw new Errors(
                    "Semántico", 
                    `Operador lógico no reconocido: ${this.operator}`, 
                    this.linea, 
                    this.columna
                );
        }
    }
}
