import { Result, DataType } from "../expression/types"; // Tipos de datos y resultado de las expresiones
import { Symbol } from "./symbol"; // Clase que define los símbolos (variables) almacenados en el entorno
import { Function } from "../Instructions/Function";
import Errors from "../Error/error";

/**
 * Clase que define el entorno de ejecución.
 * El entorno de ejecución almacena variables, funciones y su valor asociado en un mapa.
 * También permite gestionar la relación entre diferentes entornos a través del concepto de "entorno padre".
 */
export class Environment {
    public variables: Map<string, Symbol>; // Mapa que almacena las variables (nombre -> símbolo)
    public funciones: Map<string, Function>; // Mapa que almacena las funciones
    public subEntornos: Environment[]; // Lista de subentornos para jerarquías complejas
    public entornoPadre: Environment | null; // Referencia al entorno padre (para manejar entornos anidados)

    /**
     * Constructor de la clase `Environment`.
     * Inicializa el entorno de ejecución, permitiendo la creación de entornos anidados a través de un entorno padre.
     * 
     * @param entornoPadre - El entorno padre, o `null` si no tiene uno (entorno global).
     */
    constructor(entornoPadre: Environment | null) {
        this.entornoPadre = entornoPadre;  // Asigna el entorno padre
        this.variables = new Map<string, Symbol>(); // Inicializa el mapa de variables vacío
        this.funciones = new Map<string, Function>(); // Inicializa el mapa de funciones vacío
        this.subEntornos = []; // Inicializa la lista de subentornos vacía
        console.log(`Entorno creado. Padre: ${entornoPadre ? 'Sí' : 'No'}`);
    }

    /**
     * Método para guardar una variable en el entorno.
     * Si la variable ya existe y el tipo coincide, actualiza su valor.
     * Si no existe, la agrega al mapa de variables.
     * 
     * @param id - El nombre de la variable.
     * @param valor - El valor resultante que se va a almacenar, empaquetado en un objeto `Result`.
     * @param tipoDato - El tipo de dato de la variable.
     * @param linea - La línea de código donde se declara la variable.
     * @param columna - La columna de código donde se declara la variable.
     * @throws Error - Si la variable ya existe y el tipo no coincide.
     */
    SaveVariable(id: string, valor: Result, tipoDato: DataType, linea: number, columna: number, isConst: boolean) {
        console.log(`Intentando guardar variable ${id} con valor: ${valor.value} y tipo: ${DataType[tipoDato]} en la línea ${linea}, columna ${columna}`);
    
        // Verifica si la variable ya existe en el entorno actual
        if (this.variables.has(id)) {
            const existingSymbol = this.variables.get(id);
            if (existingSymbol) {
                if (existingSymbol.esConstante()) {
                    console.error(`Error: No se puede reasignar una constante (${id})`);
                    Errors.addError("Semántico", `No se puede reasignar una constante (${id})`, linea, columna);
                    return;
                }
    
                if (existingSymbol.DataType !== tipoDato) {
                    console.error(`Error: No se puede asignar un valor de tipo ${DataType[tipoDato]} a una variable de tipo ${DataType[existingSymbol.DataType]}`);
                    Errors.addError("Semántico", `No se puede asignar un valor de tipo ${DataType[tipoDato]} a una variable de tipo ${DataType[existingSymbol.DataType]}`, linea, columna);
                    return;
                }
            }
        }
    
        // Si no existe o es del mismo tipo, crea o actualiza el símbolo
        const simbolo = new Symbol(id, valor.value, tipoDato, linea, columna, isConst);
        this.variables.set(id, simbolo);
        console.log(`Variable ${id} guardada correctamente en el entorno.`);
    }
    

    /**
     * Método para actualizar el valor de una variable existente en el entorno.
     * Si la variable no existe en el entorno actual, busca recursivamente en los entornos padres.
     * 
     * @param id - El nombre de la variable a actualizar.
     * @param valor - El nuevo valor empaquetado en un objeto `Result` que se asignará.
     * @throws Error - Si la variable no existe.
     */
    UpdateVariable(id: string, valor: Result) {
        console.log(`Intentando actualizar la variable ${id} con valor: ${valor.value}`);
        let entorno: Environment | null = this;
    
        // Recorre los entornos buscando la variable
        while (entorno) {
            if (entorno.variables.has(id)) {
                const variable = entorno.variables.get(id);
    
                // Verificamos si la variable es constante
                if (variable?.esConstante()) {
                    console.error(`Error: No se puede reasignar una constante (${id})`);
                    Errors.addError("Semántico", `No se puede reasignar una constante (${id})`, variable.getLinea(), variable.getColumna());
                    return; // Salimos sin hacer la actualización
                }
    
                console.log(`Variable ${id} encontrada. Actualizando valor a ${valor.value}`);
                variable?.setValor(valor); // Actualiza el valor si no es constante
                return;
            }
            entorno = entorno.entornoPadre; // Sigue buscando en el entorno padre
        }
    
        console.error(`Error: La variable ${id} no existe en el entorno`);
        Errors.addError("Semántico", `La variable ${id} no existe en el entorno`, 0, 0);
    }
    

    /**
     * Método para obtener una variable por su identificador.
     * Si la variable no existe en el entorno actual, busca recursivamente en los entornos padres.
     * 
     * @param id - El nombre de la variable que se desea obtener.
     * @returns Symbol | undefined - El símbolo asociado a la variable o undefined si no se encuentra.
     * @throws Error - Si la variable no se encuentra en ningún entorno.
     */
    GetVariable(id: string): Symbol | null | undefined {
        console.log(`Buscando la variable ${id} en los entornos...`);
        let entorno: Environment | null = this;
    
        // Busca la variable en el entorno actual o en los entornos padres
        while (entorno != null) {
            if (entorno.variables.has(id)) {
                console.log(`Variable ${id} encontrada en el entorno actual.`);
                return entorno.variables.get(id); // Devuelve la variable si se encuentra
            }
            console.log(`Variable ${id} no encontrada en este entorno. Buscando en el entorno padre...`);
            entorno = entorno.entornoPadre;
        }
    
        console.error(`La variable ${id} no existe en ningún entorno.`);
        return null; // Retorna null si no se encuentra la variable
    }
    

    /**
     * Método para guardar una función en el entorno actual.
     * @param id - El nombre de la función.
     * @param funcion - La función a guardar.
     */
    guardarFuncion(id: string, funcion: Function) {
        this.funciones.set(id, funcion);
        console.log(`Función ${id} guardada en el entorno.`);
    }

    /**
     * Método para obtener una función por su identificador.
     * Si la función no existe en el entorno actual, busca recursivamente en los entornos padres.
     * @param id - El nombre de la función que se desea obtener.
     * @returns Function | null - La función encontrada o null si no existe.
     */
    getFuncion(id: string): Function | null {
        console.log(`Buscando la función ${id} en los entornos...`);
        let entorno: Environment | null = this;

        while (entorno != null) {
            if (entorno.funciones.has(id)) {
                console.log(`Función ${id} encontrada en el entorno actual.`);
                return entorno.funciones.get(id) || null;
            }
            entorno = entorno.entornoPadre;
        }

        console.error(`Error: La función ${id} no existe en ningún entorno.`);
        return null;
    }

    /**
     * Método para obtener el entorno global.
     * @returns Environment - El entorno global.
     */
    getGlobal(): Environment {
        let entorno: Environment | null = this;
        while (entorno?.entornoPadre != null) {
            entorno = entorno.entornoPadre;
        }
        return entorno;
    }

    /**
     * Método para agregar un subentorno al entorno actual.
     * @param entorno - El subentorno a agregar.
     */
    agregarSubEntorno(entorno: Environment) {
        this.subEntornos.push(entorno);
        console.log(`Subentorno añadido al entorno actual.`);
    }

    /**
     * Método para obtener todos los símbolos (variables) del entorno y sus subentornos.
     * Recorre el entorno actual y los subentornos de forma recursiva.
     * @returns Un diccionario con todos los símbolos y sus respectivos valores y tipos.
     */
    public getSymbols(entornoNombre: string = "Global"): any[] {
        let tablaSimbolos: any[] = [];

        // Agregar símbolos del entorno actual
        for (let [id, simbolo] of this.variables.entries()) {
            tablaSimbolos.push({
                ID: id,
                Tipo: simbolo.getTipo(),
                Entorno: entornoNombre,
                Valor: simbolo.getValor(),
                Línea: simbolo.getLinea(),
                Columna: simbolo.getColumna()
            });
        }

        // Recorrer los entornos padres (si los hay)
        if (this.entornoPadre) {
            tablaSimbolos = tablaSimbolos.concat(this.entornoPadre.getSymbols("Padre"));
        }

        return tablaSimbolos;
    }
}
