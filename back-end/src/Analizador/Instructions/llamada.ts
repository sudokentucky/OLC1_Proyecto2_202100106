/*import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { Argument } from "./argument";
import { Instruction } from "../abstract/instruction";

export class Llamada extends Instruction {
    constructor(public id: string, public argumentos: Argument[], line: number, column: number) {
        super(line, column);
    }

    public execute(entorno: Environment) {
        const global = entorno.getGlobal();  // Obtiene el entorno global
        const funcion = global.getFuncion(this.id); // Obtiene la función por su identificador

        // Si no se encuentra la función, arrojar un error
        if (!funcion) {
            throw new Errors('Semántico', `No se encontró la función ${this.id}`, this.linea, this.columna);
        }

        // Crear un nuevo entorno para la ejecución de la función
        const nuevoEntorno = new Environment(entorno, this.id);

        // Verificación: cantidad de argumentos coincide con cantidad de parámetros
        if (this.argumentos.length !== funcion.parametros.length) {
            throw new Errors(
                'Semántico',
                `Cantidad de argumentos no coincide con la cantidad de parámetros en la función ${this.id}`,
                this.linea,
                this.columna
            );
        }

        // Asignar los argumentos a los parámetros de la función
        for (let i = 0; i < this.argumentos.length; i++) {
            const argumento = this.argumentos[i];
            const parametro = funcion.parametros[i];

            // Evaluamos el valor del argumento
            const resultadoArgumento = argumento.execute(entorno);

            // Guardamos el valor del argumento en el nuevo entorno bajo el nombre del parámetro
            nuevoEntorno.saveVariable(parametro.id, resultadoArgumento, parametro.DataType, this.linea, this.columna);
        }

        // Ejecutar el bloque de instrucciones de la función dentro del nuevo entorno
        const retorno = funcion.getInstrucciones().execute(nuevoEntorno);

        // Si la función retorna un valor, devolverlo
        if (retorno?.valor) {
            return retorno;
        }
    }
}
*/