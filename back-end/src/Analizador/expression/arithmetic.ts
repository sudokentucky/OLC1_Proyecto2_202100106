import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import { Result, DataType } from "./types";
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";

// Enum que define las operaciones aritméticas
export enum ArithmeticOption {
    SUMA,
    RESTA,
    MULTIPLICACION,
    DIVISION,
    POTENCIA,
    RAIZ,
    MODULO,
    NEG // Negación unaria
}

// Especificaciones de las operaciones (Matrices de Dominancia)
const DominanteSuma = [
    [DataType.ENTERO, DataType.DECIMAL, DataType.ENTERO, DataType.ENTERO, DataType.STRING],
    [DataType.DECIMAL, DataType.DECIMAL, DataType.DECIMAL, DataType.DECIMAL, DataType.STRING],
    [DataType.ENTERO, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.STRING],
    [DataType.ENTERO, DataType.DECIMAL, DataType.NULO, DataType.STRING, DataType.STRING],
    [DataType.STRING, DataType.STRING, DataType.STRING, DataType.STRING, DataType.STRING],
];
const DominanteResta = [
    [DataType.ENTERO, DataType.DECIMAL, DataType.ENTERO, DataType.ENTERO, DataType.NULO],
    [DataType.DECIMAL, DataType.DECIMAL, DataType.DECIMAL, DataType.DECIMAL, DataType.NULO],
    [DataType.ENTERO, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.ENTERO, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
];
const DominanteProducto = [
    [DataType.ENTERO, DataType.DECIMAL, DataType.ENTERO, DataType.NULO, DataType.NULO],
    [DataType.DECIMAL, DataType.DECIMAL, DataType.DECIMAL, DataType.NULO, DataType.NULO],
    [DataType.ENTERO, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
];
const DominanteDivision = [
    [DataType.DECIMAL, DataType.DECIMAL, DataType.DECIMAL, DataType.NULO, DataType.NULO],
    [DataType.DECIMAL, DataType.DECIMAL, DataType.DECIMAL, DataType.NULO, DataType.NULO],
    [DataType.ENTERO, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
];
const DominantePotencia = [
    [DataType.ENTERO, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.DECIMAL, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
];
const DominanteRaiz = [
    [DataType.DECIMAL, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.DECIMAL, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
];
const DominanteModulo = [
    [DataType.ENTERO, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.DECIMAL, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
];
const DominanteNeg = [
    [DataType.ENTERO, DataType.ENTERO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.DECIMAL, DataType.DECIMAL, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
    [DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO, DataType.NULO],
];

// Clase que define una expresión aritmética
export class Arithmetic extends Expression {
    constructor(private left: Expression, private right: Expression | null, private operator: ArithmeticOption, line: number, column: number) {
        super(line, column);
    }

    public execute(entorno: Environment): Result {
        const leftValue = this.left.execute(entorno); 
        const rightValue = this.right ? this.right.execute(entorno) : null; 
    
        // Depuración: Mostrar los valores antes de realizar la operación
        console.log(`Operación: ${ArithmeticOption[this.operator]}`);
        console.log(`Operando izquierdo: ${leftValue.value} (Tipo: ${DataType[leftValue.DataType]})`);
        if (rightValue) {
            console.log(`Operando derecho: ${rightValue.value} (Tipo: ${DataType[rightValue.DataType]})`);
        }
    
        switch (this.operator) {
            case ArithmeticOption.SUMA:
                this.ensureRightValue(rightValue, "SUMA");
                return this.performOperation(leftValue, rightValue!, DominanteSuma, "+");
            case ArithmeticOption.RESTA:
                this.ensureRightValue(rightValue, "RESTA");
                return this.performOperation(leftValue, rightValue!, DominanteResta, "-");
            case ArithmeticOption.MULTIPLICACION:
                this.ensureRightValue(rightValue, "MULTIPLICACION");
                return this.performOperation(leftValue, rightValue!, DominanteProducto, "*");
            case ArithmeticOption.DIVISION:
                this.ensureRightValue(rightValue, "DIVISION");
                if (rightValue!.value == 0) {
                    Errors.addError("Semántico", `Error: División por cero en la línea ${this.linea}, columna ${this.columna}`, this.linea, this.columna);
                    throw new Error(`Error Semántico: División por cero en la línea ${this.linea}, columna ${this.columna}`);
                }
                return this.performOperation(leftValue, rightValue!, DominanteDivision, "/");
            case ArithmeticOption.POTENCIA:
                this.ensureRightValue(rightValue, "POTENCIA");
                return this.performOperation(leftValue, rightValue!, DominantePotencia, "^");
            case ArithmeticOption.RAIZ:
                this.ensureRightValue(rightValue, "RAIZ");
                if (rightValue!.value <= 0) {
                    Errors.addError("Semántico", `Índice de raíz debe ser mayor a 0 en la línea ${this.linea}, columna ${this.columna}`, this.linea, this.columna);
                    throw new Error(`Error Semántico: Índice de raíz debe ser mayor a 0 en la línea ${this.linea}, columna ${this.columna}`);
                }
                return this.performOperation(leftValue, rightValue!, DominanteRaiz, "√");
            case ArithmeticOption.MODULO:
                this.ensureRightValue(rightValue, "MODULO");
                if (rightValue!.value == 0) {
                    Errors.addError("Semántico", `Error: División por cero en MODULO en la línea ${this.linea}, columna ${this.columna}`, this.linea, this.columna);
                    throw new Error(`Error Semántico: División por cero en MODULO en la línea ${this.linea}, columna ${this.columna}`);
                }
                return this.performOperation(leftValue, rightValue!, DominanteModulo, "%");
            case ArithmeticOption.NEG:
                return this.performOperation(leftValue, null, DominanteNeg, "-");
            default:
                Errors.addError("Sintáctico", `Operador aritmético no reconocido en la línea ${this.linea}, columna ${this.columna}`, this.linea, this.columna);
                throw new Error(`Error Sintáctico: Operador aritmético no reconocido en la línea ${this.linea}, columna ${this.columna}`);
        }
    }
    
    // Método para asegurar que el operando derecho no sea nulo
    private ensureRightValue(rightValue: Result | null, operator: string): void {
        if (!rightValue) {
            Errors.addError("Sintáctico", `Falta el operando derecho para ${operator} en la línea ${this.linea}, columna ${this.columna}`, this.linea, this.columna);
            throw new Error(`Error Sintáctico: Falta el operando derecho para ${operator} en la línea ${this.linea}, columna ${this.columna}`);
        }
    }
    
    // Método que realiza la operación aritmética
    private performOperation(leftValue: Result, rightValue: Result | null, dominanceMatrix: DataType[][], operator: string): Result {
        const DominateType = dominanceMatrix[leftValue.DataType][rightValue !== null ? rightValue.DataType : 0];
    
        if (DominateType === undefined || DominateType === DataType.NULO) {
            const rightDataType = rightValue ? DataType[rightValue.DataType] : 'NULO';
            Errors.addError(
                "Semántico", 
                `Operación '${operator}' no permitida entre ${DataType[leftValue.DataType]} y ${rightDataType} en la línea ${this.linea}, columna ${this.columna}`,
                this.linea,
                this.columna
            );
            throw new Error(`Error Semántico: Operación '${operator}' no permitida entre ${DataType[leftValue.DataType]} y ${rightDataType} en la línea ${this.linea}, columna ${this.columna}`);
        }
    
        const result = this.applyOperator(leftValue.value, rightValue ? rightValue.value : 0, operator);
        console.log(`Resultado de la operación (${leftValue.value} ${operator} ${rightValue?.value}): ${result}`);
    
        switch (DominateType) {
            case DataType.ENTERO:
                return { value: result, DataType: DataType.ENTERO };
            case DataType.DECIMAL:
                return { value: result, DataType: DataType.DECIMAL };
            case DataType.STRING:
                return { value: leftValue.value.toString() + (rightValue ? rightValue.value.toString() : ""), DataType: DataType.STRING };
            default:
                Errors.addError("Semántico", `Operación no soportada para el tipo de datos en la línea ${this.linea}, columna ${this.columna}`, this.linea, this.columna);
                throw new Error(`Error Semántico: Operación no soportada para el tipo de datos en la línea ${this.linea}, columna ${this.columna}`);
        }
    }
    
    // Aplica el operador aritmético sin usar eval
    private applyOperator(left: number, right: number, operator: string): number {
        // Depuración: Mostrar los operandos y el operador
        console.log(`Aplicando operador: ${left} ${operator} ${right}`);
    
        switch (operator) {
            case "+": return left + right;
            case "-": return left - right;
            case "*": return left * right;
            case "/": return left / right;
            case "^": return Math.pow(left, right); // Potencia
            case "%": return left % right;
            case "√": return Math.pow(left, 1 / right);  // Raíz
            default:
                Errors.addError("Semántico", `Operador ${operator} no soportado en la línea ${this.linea}, columna ${this.columna}`, this.linea, this.columna);
                throw new Error(`Error Semántico: Operador ${operator} no soportado en la línea ${this.linea}, columna ${this.columna}`);
        }
    }
    
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para el operando izquierdo
        const leftNode = this.left.generateNode(dotGenerator);
        
        // Generar el nodo para el operando derecho si existe
        const rightNode = this.right ? this.right.generateNode(dotGenerator) : null;
    
        // Etiqueta del nodo para la operación aritmética
        const operatorLabel = `Arithmetic: ${ArithmeticOption[this.operator]}`;
    
        // Crear el nodo para la operación aritmética
        const operationNode = dotGenerator.addNode(operatorLabel);
    
        // Conectar el nodo de la operación con el operando izquierdo
        dotGenerator.addEdge(operationNode, leftNode);
    
        // Conectar el nodo de la operación con el operando derecho si existe
        if (rightNode) {
            dotGenerator.addEdge(operationNode, rightNode);
        }
    
        return operationNode;
    }
    
    
}
