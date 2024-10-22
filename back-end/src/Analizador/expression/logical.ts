import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import { Result, DataType } from "./types";
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";

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
            // Si no es booleano, agrega un error semántico y lanza una excepción
            Errors.addError(
                "Semántico", 
                `Tipo de dato no booleano en expresión lógica izquierda (esperado BOOLEANO, recibido ${DataType[leftValue.DataType]})`, 
                this.linea, 
                this.columna
            );
            throw new Error(`Error Semántico: Tipo de dato no booleano en expresión lógica izquierda en la línea ${this.linea}, columna ${this.columna}`);
        }
    
        // Manejo del operador NOT, que es un operador unario (solo evalúa una expresión)
        if (this.operator == LogicalOption.NOT) {
            return { value: !leftValue.value, DataType: DataType.BOOLEANO };
        }
    
        // Para operadores AND y OR, necesitamos verificar la expresión derecha
        if (this.right === null) {
            // Si falta la expresión derecha, agrega un error semántico y lanza una excepción
            Errors.addError(
                "Semántico", 
                "Operador AND/OR necesita dos operandos", 
                this.linea, 
                this.columna
            );
            throw new Error(`Error Semántico: Operador AND/OR necesita dos operandos en la línea ${this.linea}, columna ${this.columna}`);
        }
    
        // Ejecuta la expresión derecha
        const rightValue = this.right.execute(entorno);
    
        // Verifica que el tipo de dato de la expresión derecha sea booleano
        if (rightValue.DataType != DataType.BOOLEANO) {
            // Si no es booleano, agrega un error semántico y lanza una excepción
            Errors.addError(
                "Semántico", 
                `Tipo de dato no booleano en expresión lógica derecha (esperado BOOLEANO, recibido ${DataType[rightValue.DataType]})`, 
                this.linea, 
                this.columna
            );
            throw new Error(`Error Semántico: Tipo de dato no booleano en expresión lógica derecha en la línea ${this.linea}, columna ${this.columna}`);
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
                // Si el operador lógico no es reconocido, agrega un error semántico y lanza una excepción
                Errors.addError(
                    "Semántico", 
                    `Operador lógico no reconocido: ${this.operator}`, 
                    this.linea, 
                    this.columna
                );
                throw new Error(`Error Semántico: Operador lógico no reconocido en la línea ${this.linea}, columna ${this.columna}`);
        }
    }
    
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar el nodo para el operando izquierdo
        const leftNode = this.left.generateNode(dotGenerator);
        
        // Generar el nodo para el operando derecho si existe (AND, OR)
        const rightNode = this.right ? this.right.generateNode(dotGenerator) : null;
        
        // Etiqueta del nodo para la operación lógica
        const operatorLabel = `Logical: ${LogicalOption[this.operator]}`;
        
        // Crear el nodo para la operación lógica
        const logicalNode = dotGenerator.addNode(operatorLabel);
        
        // Conectar el nodo de la operación lógica con el operando izquierdo
        dotGenerator.addEdge(logicalNode, leftNode);
    
        // Conectar el nodo de la operación lógica con el operando derecho si existe
        if (rightNode) {
            dotGenerator.addEdge(logicalNode, rightNode);
        }
    
        return logicalNode;
    }
    
    
}
