import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression";
import {Result, DataType} from "./types";
import { DotGenerator } from "../Tree/DotGenerator";
import Errors from "../Error/error";
//Clase que define una expresion relacional
export enum RelationalOption{
    IGUALDAD,
    DISTINTO,
    MAYOR,
    MENOR,
    MAYORIGUAL,
    MENORIGUAL
}
//Matriz de tipos de datos para las operaciones relacionales
const DominanteRelacional = [
    [DataType.BOOLEANO,DataType.BOOLEANO,DataType.NULO,DataType.BOOLEANO,DataType.NULO,DataType.BOOLEANO], //Entero
    [DataType.BOOLEANO,DataType.BOOLEANO,DataType.NULO,DataType.BOOLEANO,DataType.NULO,DataType.BOOLEANO], //Decimal
    [DataType.NULO,DataType.NULO,DataType.BOOLEANO,DataType.NULO,DataType.NULO,DataType.BOOLEANO],//Booleano
    [DataType.BOOLEANO,DataType.BOOLEANO,DataType.NULO,DataType.BOOLEANO,DataType.NULO,DataType.BOOLEANO],//Caracter
    [DataType.NULO,DataType.NULO,DataType.NULO,DataType.NULO,DataType.BOOLEANO,DataType.BOOLEANO], //Cadena
    [DataType.BOOLEANO,DataType.BOOLEANO,DataType.BOOLEANO,DataType.BOOLEANO,DataType.BOOLEANO,DataType.BOOLEANO], //Nulo
]

export class Relational extends Expression{
    constructor(private left: Expression, private right: Expression, private operator: RelationalOption, line: number, column: number){
        super(line, column)
    }
    public execute(entorno: Environment): Result {
        const leftValue = this.left.execute(entorno); // obtiene el valor de la izquierda
        const rightValue = this.right.execute(entorno); // obtiene el valor de la derecha
    
        const DominateType = DominanteRelacional[leftValue.DataType][rightValue.DataType];
    
        // Si la combinación de tipos no está permitida, guardamos un error y lanzamos una excepción
        if (DominateType == DataType.NULO || DominateType == undefined) {
            Errors.addError(
                "Semántico", 
                `Tipos incompatibles para operación relacional entre ${DataType[leftValue.DataType]} y ${DataType[rightValue.DataType]}`, 
                this.linea, 
                this.columna
            );
            throw new Error(`Error Semántico: Tipos incompatibles para operación relacional en la línea ${this.linea}, columna ${this.columna}`);
        }
    
        switch (this.operator) {
            case RelationalOption.IGUALDAD:
                return {
                    value: leftValue.value == rightValue.value,
                    DataType: DataType.BOOLEANO
                };
    
            case RelationalOption.DISTINTO:
                return {
                    value: leftValue.value != rightValue.value,
                    DataType: DataType.BOOLEANO
                };
    
            case RelationalOption.MAYOR:
                if (typeof leftValue.value === 'number' && typeof rightValue.value === 'number') {
                    return {
                        value: leftValue.value > rightValue.value,
                        DataType: DataType.BOOLEANO
                    };
                } else {
                    Errors.addError(
                        "Semántico", 
                        `Operador > no aplicable a tipos ${DataType[leftValue.DataType]} y ${DataType[rightValue.DataType]}`, 
                        this.linea, 
                        this.columna
                    );
                    throw new Error(`Error Semántico: Operador > no aplicable a estos tipos en la línea ${this.linea}, columna ${this.columna}`);
                }
    
            case RelationalOption.MENOR:
                if (typeof leftValue.value === 'number' && typeof rightValue.value === 'number') {
                    return {
                        value: leftValue.value < rightValue.value,
                        DataType: DataType.BOOLEANO
                    };
                } else {
                    Errors.addError(
                        "Semántico", 
                        `Operador < no aplicable a tipos ${DataType[leftValue.DataType]} y ${DataType[rightValue.DataType]}`, 
                        this.linea, 
                        this.columna
                    );
                    throw new Error(`Error Semántico: Operador < no aplicable a estos tipos en la línea ${this.linea}, columna ${this.columna}`);
                }
    
            case RelationalOption.MAYORIGUAL:
                if (typeof leftValue.value === 'number' && typeof rightValue.value === 'number') {
                    return {
                        value: leftValue.value >= rightValue.value,
                        DataType: DataType.BOOLEANO
                    };
                } else {
                    Errors.addError(
                        "Semántico", 
                        `Operador >= no aplicable a tipos ${DataType[leftValue.DataType]} y ${DataType[rightValue.DataType]}`, 
                        this.linea, 
                        this.columna
                    );
                    throw new Error(`Error Semántico: Operador >= no aplicable a estos tipos en la línea ${this.linea}, columna ${this.columna}`);
                }
    
            case RelationalOption.MENORIGUAL:
                if (typeof leftValue.value === 'number' && typeof rightValue.value === 'number') {
                    return {
                        value: leftValue.value <= rightValue.value,
                        DataType: DataType.BOOLEANO
                    };
                } else {
                    Errors.addError(
                        "Semántico", 
                        `Operador <= no aplicable a tipos ${DataType[leftValue.DataType]} y ${DataType[rightValue.DataType]}`, 
                        this.linea, 
                        this.columna
                    );
                    throw new Error(`Error Semántico: Operador <= no aplicable a estos tipos en la línea ${this.linea}, columna ${this.columna}`);
                }
    
            default:
                Errors.addError(
                    "Semántico", 
                    `Operador relacional no reconocido: ${this.operator}`, 
                    this.linea, 
                    this.columna
                );
                throw new Error(`Error Semántico: Operador relacional no reconocido en la línea ${this.linea}, columna ${this.columna}`);
        }
    }
    
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar nodos para las expresiones izquierda y derecha
        const leftNode = this.left.generateNode(dotGenerator);
        const rightNode = this.right.generateNode(dotGenerator);
        
        // Etiqueta del nodo para la operación relacional
        const operatorLabel = `Relational: ${RelationalOption[this.operator]}`;
        
        // Crear el nodo principal para la operación relacional
        const relationalNode = dotGenerator.addNode(operatorLabel);
    
        // Conectar el nodo de la operación relacional con los operandos izquierdo y derecho
        dotGenerator.addEdge(relationalNode, leftNode);
        dotGenerator.addEdge(relationalNode, rightNode);
    
        return relationalNode;
    }
    
}