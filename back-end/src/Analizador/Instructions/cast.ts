import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import { Result, DataType } from "../expression/types";
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";
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
                Errors.addError(
                    "Semántico", 
                    `No se puede castear desde el tipo ${DataType[exprValue.DataType]} al tipo ${DataType[this.targetType]}`, 
                    this.linea, 
                    this.columna
                );
                throw new Error(`Error Semántico: No se puede castear desde el tipo ${DataType[exprValue.DataType]} al tipo ${DataType[this.targetType]} en la línea ${this.linea}, columna ${this.columna}`);
        }
    }
    
    /**
     * Realiza el casteo desde un valor de tipo entero.
     */
    private castFromInt(exprValue: Result): Result {
        switch (this.targetType) {
            case DataType.DECIMAL:
                return { value: parseFloat(exprValue.value.toString()), DataType: DataType.DECIMAL };
    
            case DataType.STRING:
                return { value: exprValue.value.toString(), DataType: DataType.STRING };
    
            case DataType.CHAR:
                return { value: String.fromCharCode(exprValue.value), DataType: DataType.CHAR };
    
            default:
                Errors.addError(
                    "Semántico", 
                    `No se puede castear un int al tipo ${DataType[this.targetType]}`, 
                    this.linea, 
                    this.columna
                );
                throw new Error(`Error Semántico: No se puede castear un int al tipo ${DataType[this.targetType]} en la línea ${this.linea}, columna ${this.columna}`);
        }
    }
    
    /**
     * Realiza el casteo desde un valor de tipo double.
     */
    private castFromDouble(exprValue: Result): Result {
        switch (this.targetType) {
            case DataType.ENTERO:
                return { value: Math.floor(exprValue.value), DataType: DataType.ENTERO };
    
            case DataType.STRING:
                return { value: exprValue.value.toString(), DataType: DataType.STRING };
    
            default:
                Errors.addError(
                    "Semántico", 
                    `No se puede castear un double al tipo ${DataType[this.targetType]}`, 
                    this.linea, 
                    this.columna
                );
                throw new Error(`Error Semántico: No se puede castear un double al tipo ${DataType[this.targetType]} en la línea ${this.linea}, columna ${this.columna}`);
        }
    }
    
    /**
     * Realiza el casteo desde un valor de tipo char.
     */
    private castFromChar(exprValue: Result): Result {
        const charCode = exprValue.value.charCodeAt(0);  // Obtener el código ASCII del char
    
        switch (this.targetType) {
            case DataType.ENTERO:
                return { value: charCode, DataType: DataType.ENTERO };
    
            case DataType.DECIMAL:
                return { value: parseFloat(charCode.toString()), DataType: DataType.DECIMAL };
    
            default:
                Errors.addError(
                    "Semántico", 
                    `No se puede castear un char al tipo ${DataType[this.targetType]}`, 
                    this.linea, 
                    this.columna
                );
                throw new Error(`Error Semántico: No se puede castear un char al tipo ${DataType[this.targetType]} en la línea ${this.linea}, columna ${this.columna}`);
        }
    }
    
    /**
     * Genera el nodo DOT para la operación de casteo.
     * 
     * @param ast - Referencia al AST que contiene el contador de nodos.
     * @returns string - Representación en formato DOT del nodo del casteo.
     */
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para la expresión que se está casteando
        const expressionNode = this.expression.generateNode(dotGenerator);
    
        // Crear el nodo principal del casteo con el tipo de destino
        const castNode = dotGenerator.addNode(`Casteo a: ${DataType[this.targetType]}`);
    
        // Conectar el nodo del casteo con el nodo de la expresión
        dotGenerator.addEdge(castNode, expressionNode);
    
        return castNode;
    }
    
    
}
