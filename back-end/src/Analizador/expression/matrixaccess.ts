import { Expression } from "../abstract/expression";
import { Environment } from "../Environment/environment";
import { Result } from "./types";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array"; // Asegúrate de que este sea el path correcto
import { DotGenerator } from "../Tree/DotGenerator";
export class MatrixAccess extends Expression {
    private id: string;
    private row: Expression;
    private colExpr: Expression;

    constructor(id: string, row: Expression, colExpr: Expression, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.row = row;
        this.colExpr = colExpr;
    }

    public execute(environment: Environment): Result {
        const variable = environment.GetVariable(this.id);
    
        // Verifica si la variable existe y si es de tipo matriz (Arreglo)
        if (!variable || !(variable.getValor() instanceof Arreglo)) {
            Errors.addError(
                "Semántico", 
                `El identificador '${this.id}' no es una matriz o no existe`, 
                this.linea, 
                this.columna
            );
            throw new Error(`Error Semántico: El identificador '${this.id}' no es una matriz o no existe en la línea ${this.linea}, columna ${this.columna}`);
        }
    
        const arreglo = variable.getValor() as Arreglo<any>; // Especifica el tipo genérico, aquí 'number'
        const rowIdx = this.row.execute(environment).value;
        const colIdx = this.colExpr.execute(environment).value;
    
        // Verifica que los índices sean números válidos
        if (typeof rowIdx !== 'number' || typeof colIdx !== 'number') {
            Errors.addError(
                "Semántico", 
                `Los índices para acceder a la matriz deben ser números (recibido: fila=${typeof rowIdx}, columna=${typeof colIdx})`, 
                this.linea, 
                this.columna
            );
            throw new Error(`Error Semántico: Los índices para acceder a la matriz deben ser números en la línea ${this.linea}, columna ${this.columna}`);
        }
    
        try {
            // Usar el método getValor de la clase Arreglo para acceder de forma segura
            const value = arreglo.getValor(rowIdx, colIdx);
            return { value: value, DataType: variable.DataType };
        } catch (error) {
            if (error instanceof Error) {
                Errors.addError(
                    "Semántico", 
                    `Error accediendo a la matriz: ${error.message}`, 
                    this.linea, 
                    this.columna
                );
                throw new Error(`Error Semántico: ${error.message} en la línea ${this.linea}, columna ${this.columna}`);
            } else {
                Errors.addError(
                    "Semántico", 
                    "Error desconocido accediendo a la matriz", 
                    this.linea, 
                    this.columna
                );
                throw new Error(`Error Semántico: Error desconocido accediendo a la matriz en la línea ${this.linea}, columna ${this.columna}`);
            }
        }
    }
    
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar los nodos para las expresiones de fila y columna
        const rowNode = this.row.generateNode(dotGenerator);
        const colNode = this.colExpr.generateNode(dotGenerator);
        
        // Crear el nodo para el acceso a la matriz con su identificador
        const matrixAccessNode = dotGenerator.addNode(`MatrixAccess: ${this.id}`);
    
        // Conectar el nodo de MatrixAccess con los nodos de fila y columna
        dotGenerator.addEdge(matrixAccessNode, rowNode);
        dotGenerator.addEdge(matrixAccessNode, colNode);
    
        return matrixAccessNode;
    }
    
    
}
