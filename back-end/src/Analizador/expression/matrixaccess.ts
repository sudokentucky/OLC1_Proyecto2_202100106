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

        // Debes especificar el tipo genérico de Arreglo, en este caso supongo que la matriz es de tipo number
        if (!variable || !(variable.getValor() instanceof Arreglo)) {
            throw new Errors("Semántico", `El identificador '${this.id}' no es una matriz`, this.linea, this.columna);
        }

        const arreglo = variable.getValor() as Arreglo<any>; // Especifica el tipo genérico, aquí 'number'
        const rowIdx = this.row.execute(environment).value;
        const colIdx = this.colExpr.execute(environment).value;

        try {
            // Usar el método getValor de la clase Arreglo para acceder de forma segura
            const value = arreglo.getValor(rowIdx, colIdx);
            return { value: value, DataType: variable.DataType };
        } catch (error) {
            if (error instanceof Error) {
                throw new Errors("Semántico", error.message, this.linea, this.columna);
            } else {
                throw new Errors("Semántico", "Error desconocido accediendo a la matriz", this.linea, this.columna);
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
