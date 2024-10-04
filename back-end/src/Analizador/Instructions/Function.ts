import { Environment } from "../Environment/environment"; // Importamos el entorno
import { Instruction } from "../abstract/instruction";    // Clase base para las instrucciones
import { Statement } from "./statement";                 // Bloque de código que ejecutará la función
import { DataType, Result } from "../expression/types";  // Para manejar tipos y resultados
import { Return } from "./return";                       // Clase para manejar valores de retorno
import Errors from "../Error/error";

/**
 * Clase `Function` que representa una función dentro del entorno de ejecución.
 * 
 * Esta clase define una función que puede ser llamada en cualquier momento. La función contiene un
 * bloque de código (`Statement`) que se ejecutará cuando la función sea invocada. Además, la función
 * puede tener una lista de parámetros que se pasan cuando se invoca.
 */
export class Function extends Instruction {
    constructor(
        public id: string,                   // Identificador de la función
        public tipoRetorno: DataType,         // Tipo de retorno de la función
        public statement: Statement,          // Bloque de código (cuerpo de la función)
        public parametros: {                 // Parámetros de la función con tipos
            id: string, 
            tipo: DataType, 
            defaultValue?: any
        }[], 
        line: number, 
        column: number
    ) {
        super(line, column); // Llamada al constructor de la clase base Instruction
    }

    /**
     * Método `execute` que guarda la función en el entorno actual.
     * 
     * Este método añade la función al entorno, lo que permite que sea accesible y ejecutable
     * en el futuro. La función se guarda asociada a su identificador (`id`), permitiendo su
     * invocación posterior mediante su nombre.
     * 
     * @param environment - El entorno de ejecución actual (`Environment`) donde se almacenará la función.
     */
    public execute(environment: Environment) {
        // Guarda la función en el entorno actual, asociándola a su identificador `id`.
        environment.guardarFuncion(this.id, this);
    }

    /**
     * Método para ejecutar una función ya definida.
     * @param environment - El entorno actual en el que se ejecuta la función.
     * @param args - Los argumentos pasados al llamar a la función.
     * @returns Un resultado (Result) o null si no hay retorno.
     */
    public call(environment: Environment, args: Result[]): Result | null {
        // Crear un nuevo entorno para la función (subentorno)
        const subEntorno = new Environment(environment);
        console.log("Subentorno creado para la función", this.id);

        // Verificar que los argumentos coincidan con los parámetros
        if (args.length > this.parametros.length) {
            Errors.addError("Semántico", `Se pasaron más argumentos de los esperados en la función ${this.id}`, this.linea, this.columna);
            return null;
        }

        // Asignar los parámetros al nuevo entorno
        for (let i = 0; i < this.parametros.length; i++) {
            const param = this.parametros[i];
            const valor = args[i] != null ? args[i].value : param.defaultValue;

            if (valor === undefined) {
                Errors.addError("Semántico", `Falta el argumento para el parámetro ${param.id} en la función ${this.id}`, this.linea, this.columna);
                return null;
            }

            // Guardar el parámetro en el subentorno
            console.log("Variable", param.id, "con valor", valor, "y tipo", param.tipo, "guardada en el subentorno", subEntorno);
            subEntorno.SaveVariable(param.id, { value: valor, DataType: param.tipo }, param.tipo, this.linea, this.columna, false);
        }

        // Ejecutar el cuerpo de la función (código en `statement`)
        const resultado = this.statement.execute(subEntorno);

        // Verificar si el resultado es una instancia de `Return`
        if (resultado instanceof Return) {
            const returnValue = resultado.execute(subEntorno);

            // Si la función tiene un retorno esperado, verificar el tipo
            if (returnValue.value && returnValue.value.type !== this.tipoRetorno) {
                Errors.addError("Semántico", `El tipo de retorno en la función ${this.id} no coincide con el tipo esperado`, this.linea, this.columna);
                return null;
            }

            return returnValue.value || null;
        }

        // Si no se encuentra una instrucción de retorno explícito
        Errors.addError("Semántico", `La función ${this.id} no retornó ningún valor`, this.linea, this.columna);
        return null;
    }
}
