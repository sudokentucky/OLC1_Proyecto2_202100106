import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import { Result, DataType } from "../expression/types";
import Errors from "../Error/error";

export class Cast extends Expression {
    private expression: Expression;
    private targetType: DataType;

    constructor(expression: Expression, targetType: DataType, line: number, column: number) {
        super(line, column);
        this.expression = expression;
        this.targetType = targetType;
    }

    public execute(environment: Environment): Result {
        const exprValue = this.expression.execute(environment); // Evalúa la expresión

        // Log para depuración
        console.log(`Casteando valor: ${exprValue.value} de tipo ${DataType[exprValue.DataType]} a tipo ${DataType[this.targetType]}`);

        // Validamos las combinaciones de tipos permitidos para el casteo
        switch (exprValue.DataType) {
            case DataType.ENTERO:
                return this.castFromInt(exprValue);

            case DataType.DECIMAL:
                return this.castFromDouble(exprValue);

            case DataType.CHAR:
                return this.castFromChar(exprValue);

            default:
                throw new Errors("Semántico", `No se puede castear desde el tipo ${DataType[exprValue.DataType]} al tipo ${DataType[this.targetType]}`, this.linea, this.columna);
        }
    }

     /**
     * Realiza el casteo desde un valor de tipo entero.
     */
     private castFromInt(exprValue: Result): Result {
        switch (this.targetType) {
            case DataType.DECIMAL:
                // Convertir de entero a decimal (double)
                return { value: parseFloat(exprValue.value.toString()), DataType: DataType.DECIMAL };

            case DataType.STRING:
                // Convertir de entero a string
                return { value: exprValue.value.toString(), DataType: DataType.STRING };

            case DataType.CHAR:
                // Convertir de entero a char usando el código ASCII
                return { value: String.fromCharCode(exprValue.value), DataType: DataType.CHAR };

            default:
                throw new Errors("Semántico", `No se puede castear un int al tipo ${DataType[this.targetType]}`, this.linea, this.columna);
        }
    }

    /**
     * Realiza el casteo desde un valor de tipo double.
     */
    private castFromDouble(exprValue: Result): Result {
        switch (this.targetType) {
            case DataType.ENTERO:
                // Convertir de decimal a entero
                return { value: Math.floor(exprValue.value), DataType: DataType.ENTERO };

            case DataType.STRING:
                // Convertir de decimal a string
                return { value: exprValue.value.toString(), DataType: DataType.STRING };

            default:
                throw new Errors("Semántico", `No se puede castear un double al tipo ${DataType[this.targetType]}`, this.linea, this.columna);
        }
    }

    /**
     * Realiza el casteo desde un valor de tipo char.
     */
    private castFromChar(exprValue: Result): Result {
        const charCode = exprValue.value.charCodeAt(0);  // Obtener el código ASCII del char

        switch (this.targetType) {
            case DataType.ENTERO:
                // Convertir de char a entero (código ASCII)
                return { value: charCode, DataType: DataType.ENTERO };

            case DataType.DECIMAL:
                // Convertir de char a decimal (double) basado en el código ASCII
                return { value: parseFloat(charCode.toString()), DataType: DataType.DECIMAL };

            default:
                throw new Errors("Semántico", `No se puede castear un char al tipo ${DataType[this.targetType]}`, this.linea, this.columna);
        }
    }
}