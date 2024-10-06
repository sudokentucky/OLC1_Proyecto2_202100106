import { Instruction } from "../abstract/instruction";
import { Environment } from "../Environment/environment";
import { Expression } from "../abstract/expression"; // Clase base para expresiones
import { Result, DataType } from "../expression/types";
import Errors from "../Error/error";
import { Arreglo } from "../Environment/array"; // Importamos la clase Arreglo
import { DotGenerator } from "../Tree/DotGenerator";

export class MatrixAssignment extends Instruction {
    private id: string;
    private row: Expression;
    private colExpr: Expression;  // Expresión para la columna
    private value: Expression;    // Valor a asignar

    constructor(id: string, row: Expression, colExpr: Expression, value: Expression, line: number, column: number) {
        super(line, column); // Llamamos al constructor de Instruction
        this.id = id;
        this.row = row;
        this.colExpr = colExpr;
        this.value = value;
    }

    public execute(environment: Environment): Result {
        // Buscar la matriz en el entorno
        const variable = environment.GetVariable(this.id);

        // Validar que la variable sea una instancia de la clase Arreglo (matriz)
        if (!variable || !(variable.getValor() instanceof Arreglo)) {
            throw new Errors("Semántico", `El identificador '${this.id}' no es una matriz`, this.linea, this.columna);
        }

        // Obtenemos el arreglo que representa la matriz
        const matrix = variable.getValor() as Arreglo<any>;

        // Evaluar las expresiones de fila y columna
        const rowIdx = this.row.execute(environment).value;
        const colIdx = this.colExpr.execute(environment).value;

        // Validar que ambos índices sean números
        if (typeof rowIdx !== 'number' || typeof colIdx !== 'number') {
            throw new Errors("Semántico", `Los índices deben ser números.`, this.linea, this.columna);
        }

        // Evaluar el valor a asignar
        const valueResult: Result = this.value.execute(environment);

        // Verificar que el tipo del valor coincida con el tipo de la matriz
        if (variable.DataType !== valueResult.DataType) {
            throw new Errors("Semántico", `El tipo de dato del valor no coincide con el tipo de la matriz '${this.id}'.`, this.linea, this.columna);
        }

        // Intentamos asignar el valor a la posición [rowIdx][colIdx] en la matriz
        try {
            matrix.setValor(rowIdx, valueResult.value, colIdx);
            console.log(`Asignación exitosa en la matriz '${this.id}' en la posición [${rowIdx}][${colIdx}] con valor: ${valueResult.value}`);
        } catch (error) {
            if (error instanceof Error) {
                throw new Errors("Semántico", error.message, this.linea, this.columna);
            } else {
                throw new Errors("Semántico", "Ocurrió un error desconocido al asignar el valor a la matriz", this.linea, this.columna);
            }
        }

        return { value: null, DataType: DataType.NULO }; // La asignación no devuelve un valor útil
    }
    public generateNode(dotGenerator: DotGenerator): string {
        // Generar nodos para las expresiones de fila, columna y valor
        const rowNode = this.row.generateNode(dotGenerator);
        const colNode = this.colExpr.generateNode(dotGenerator);
        const valueNode = this.value.generateNode(dotGenerator);
        
        // Crear el nodo principal para la asignación de la matriz con su identificador
        const matrixAssignmentNode = dotGenerator.addNode(`MatrixAssignment: ${this.id}`);
    
        // Conectar el nodo de asignación de matriz con los nodos de fila, columna y valor
        dotGenerator.addEdge(matrixAssignmentNode, rowNode);
        dotGenerator.addEdge(matrixAssignmentNode, colNode);
        dotGenerator.addEdge(matrixAssignmentNode, valueNode);
    
        return matrixAssignmentNode;
    }
    
    
}
