import { Instruction } from "../abstract/instruction";
import { Expression } from "../abstract/expression"; // Clase base para expresiones
import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { Result, DataType } from "../expression/types";
import { Arreglo } from "../Environment/array"; // Importamos la clase Arreglo

export class VectorAssignment extends Instruction {
    private id: string;       // Nombre del vector
    private index1: Expression; // Primer índice (en caso de vector unidimensional)
    private value: Expression; // Expresión cuyo resultado será asignado

    constructor(id: string, index1: Expression, value: Expression, linea: number, columna: number) {
        super(linea, columna);
        this.id = id;
        this.index1 = index1;
        this.value = value;
    }

    // Implementación del método execute de Instruction
    public execute(environment: Environment) {
        console.log(`[VectorAssignment] Iniciando asignación en vector '${this.id}' en línea ${this.linea}, columna ${this.columna}.`);

        // Buscar el vector en el entorno
        const variable = environment.GetVariable(this.id);
        if (!variable) {
            console.error(`[VectorAssignment] Error: El vector '${this.id}' no ha sido declarado.`);
            throw new Errors("Semántico", `El vector ${this.id} no ha sido declarado.`, this.linea, this.columna);
        }

        const vector = variable.getValor();
        console.log(`[VectorAssignment] Variable '${this.id}' encontrada. Valor actual:`, vector);

        // Verificar que la variable es un Arreglo
        if (!(vector instanceof Arreglo)) {
            console.error(`[VectorAssignment] Error: El identificador '${this.id}' no es un vector.`);
            throw new Errors("Semántico", `El identificador ${this.id} no es un vector.`, this.linea, this.columna);
        }

        // Evaluar el índice
        const idx1Result: Result = this.index1.execute(environment);
        const idx1 = idx1Result.value;

        if (typeof idx1 !== 'number') {
            console.error(`[VectorAssignment] Error: El índice '${idx1}' no es un número válido.`);
            throw new Errors("Semántico", `El índice '${idx1}' no es un número válido para el vector '${this.id}'.`, this.linea, this.columna);
        }

        console.log(`[VectorAssignment] Índice evaluado: ${idx1}. Verificando límites...`);

        // Verificar que el índice esté dentro de los límites del vector
        if (idx1 < 0 || idx1 >= vector.getDimensiones()[0]) {
            console.error(`[VectorAssignment] Error: El índice '${idx1}' está fuera de los límites del vector '${this.id}'.`);
            throw new Errors("Semántico", `El índice ${idx1} está fuera de los límites del vector '${this.id}'.`, this.linea, this.columna);
        }

        // Evaluar el valor a asignar
        const expResult: Result = this.value.execute(environment);
        console.log(`[VectorAssignment] Valor evaluado para asignación:`, expResult.value);

        // Verificar que los tipos coincidan entre el tipo de la variable y la expresión asignada
        if (variable.DataType !== expResult.DataType) {
            console.error(`[VectorAssignment] Error: El tipo '${DataType[expResult.DataType]}' no coincide con el tipo del vector '${this.id}' que es '${DataType[variable.DataType]}'.`);
            throw new Errors("Semántico", `El tipo del valor no coincide con el tipo del vector ${this.id}.`, this.linea, this.columna);
        }

        // Asignar el nuevo valor en la posición especificada
        try {
            vector.setValor(idx1, expResult.value);
            console.log(`[VectorAssignment] Asignación exitosa en el vector '${this.id}' en la posición [${idx1}] con valor: ${expResult.value}.`);
        } catch (error) {
            console.error(`[VectorAssignment] Error durante la asignación:`, error);
            throw new Errors("Semántico", `Error asignando el valor al vector '${this.id}' en la posición [${idx1}].`, this.linea, this.columna);
        }
    }
}
