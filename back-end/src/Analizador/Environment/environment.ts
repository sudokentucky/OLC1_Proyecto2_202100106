import { Result, DataType } from "../expression/types"; // Tipos de datos y resultado de las expresiones
import { Symbol } from "./symbol"; // Clase que define los símbolos (variables) almacenados en el entorno
import { Funct } from "../Instructions/Function";
import Errors from "../Error/error";

/**
 * Clase que define el entorno de ejecución.
 * El entorno de ejecución almacena variables, funciones y su valor asociado en un mapa.
 * También permite gestionar la relación entre diferentes entornos a través del concepto de "entorno padre".
 */
export class Environment {
    public variables: Map<string, Symbol>; // Mapa que almacena las variables (nombre -> símbolo)
    public funciones: Map<string, Funct>; // Mapa que almacena las funciones
    public subEntornos: Environment[]; // Lista de subentornos para jerarquías complejas
    public name: string; // Nombre del entorno (opcional)

    /**
     * Constructor de la clase `Environment`.
     * Inicializa el entorno de ejecución, permitiendo la creación de entornos anidados a través de un entorno padre.
     * 
     * @param entornoPadre - El entorno padre, o `null` si no tiene uno (entorno global).
     */
    constructor(public previous: Environment | null, name:string) {
        this.variables = new Map<string, Symbol>(); // Inicializa el mapa de variables vacío
        this.funciones = new Map<string, Funct>(); // Inicializa el mapa de funciones vacío
        this.subEntornos = []; // Inicializa la lista de subentornos vacía
        this.name=name;
        console.log(`Entorno creado. Padre: ${previous ? 'Sí' : 'No'}`);
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
    public SaveVariable(id: string, valor: Result, tipoDato: DataType, linea: number, columna: number, isConst: boolean) {
        console.log(`Intentando guardar variable ${id} con valor: ${valor.value} y tipo: ${DataType[tipoDato]} en la línea ${linea}, columna ${columna}`);

        if (this.variables.has(id)) {
            const existingSymbol = this.variables.get(id);
            if (existingSymbol) {
                if (existingSymbol.esConstante()) {
                    const mensaje = `No se puede reasignar una constante (${id})`;
                    console.error(mensaje);
                    Errors.addError("Semántico", mensaje, linea, columna);
                    return;
                }

                if (existingSymbol.DataType !== tipoDato) {
                    const mensaje = `No se puede asignar un valor de tipo ${DataType[tipoDato]} a una variable de tipo ${DataType[existingSymbol.DataType]}`;
                    console.error(mensaje);
                    Errors.addError("Semántico", mensaje, linea, columna);
                    return;
                }
            }
        }

        const simbolo = new Symbol(id, valor.value, tipoDato, linea, columna, isConst);
        this.variables.set(id, simbolo);
        console.log(`Variable ${id} guardada correctamente en el entorno.`);
        console.log('nombre del entorno: ' + id);
        console.log (`Entorno actual: ${this.variables.size} variables, ${this.funciones.size} funciones, ${this.subEntornos.length} subentornos`);
    }
    

/**
 * Método para actualizar el valor de una variable existente en el entorno actual.
 * Si la variable no existe en el entorno actual, muestra un error.
 * 
 * @param id - El nombre de la variable a actualizar.
 * @param valor - El nuevo valor empaquetado en un objeto `Result` que se asignará.
 * @throws Error - Si la variable no existe en el entorno actual.
 */
public UpdateVariable(id: string, valor: Result) {
    console.log(`Intentando actualizar la variable ${id} con valor: ${valor.value}`);
    
    if (this.variables.has(id)) {
        const variable = this.variables.get(id);

        if (variable?.esConstante()) {
            const mensaje = `No se puede reasignar una constante (${id})`;
            console.error(mensaje);
            Errors.addError("Semántico", mensaje, variable.getLinea(), variable.getColumna());
            return;
        }

        console.log(`Variable ${id} encontrada en el entorno actual. Actualizando valor a ${valor.value}`);
        variable?.setValor(valor);
    } else {
        const mensaje = `La variable ${id} no existe en el entorno actual`;
        console.error(mensaje);
        Errors.addError("Semántico", mensaje, 0, 0);
    }
}


    /**
     * Método para obtener una variable por su identificador.
     * Si la variable no existe en el entorno actual, busca recursivamente en los entornos padres.
     * Esto es util para reasignar un valor en un subentorno.
     * @param id - El nombre de la variable que se desea obtener.
     * @returns Symbol | undefined - El símbolo asociado a la variable o undefined si no se encuentra.
     * @throws Error - Si la variable no se encuentra en ningún entorno.
     */
    
/**
 * Metodo para obtener una variable por su identificador.
 *Esta variable solo se busca en el entorno actual, no se busca en los entornos padres.
 */
 public GetVariable(id: string): Symbol|null|undefined {
    let ActualEnv: Environment | null = this
    while (ActualEnv != null) {
        if (ActualEnv.variables.has(id)) {
            return ActualEnv.variables.get(id)
        }
        ActualEnv = ActualEnv.previous
    }

    return null
}

/**
 * Método para obtener una variable solo en el entorno actual (sin buscar en entornos padres).
 * Esto previene que una función pueda ser sobreescrita por una variable del mismo nombre en un entorno superior.
 * @param id - El nombre de la variable que se desea obtener.
 * @returns Symbol | undefined - El símbolo asociado a la variable o undefined si no se encuentra en el entorno actual.
 */
public getVariableInCurrentEnv(id: string): Symbol | undefined {
    if (this.variables.has(id)) {
        return this.variables.get(id);
    }
    return undefined;
}

    /**
     * Método para guardar una función en el entorno actual.
     * @param id - El nombre de la función.
     * @param funcion - La función a guardar.
     */
    guardarFuncion(id: string, funcion: Funct) {
        this.funciones.set(id, funcion);
        console.log(`Función ${id} guardada en el entorno.`);
    }
    /**
     * Método para obtener una función por su identificador.
     * @param id - El nombre de la función que se desea obtener.
     * @returns Function | null - La función encontrada o null si no existe.
     */
    getFuncion(id: string): Funct | null {
        console.log(`Buscando la función ${id} en los entornos...`);
        let entorno: Environment | null = this;

        while (entorno != null) {
            if (entorno.funciones.has(id)) {
                console.log(`Función ${id} encontrada en el entorno actual.`);
                return entorno.funciones.get(id) || null;
            }
            entorno = entorno.previous;
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
        while (entorno?.previous != null) {
            entorno = entorno.previous;
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
        console.log(`Entorno actual: ${this.variables.size} variables, ${this.funciones.size} funciones, ${this.subEntornos.length} subentornos`);    }

/**
 * Método para obtener todos los símbolos (variables y funciones) del entorno y sus subentornos.
 * Recorre el entorno actual y los subentornos de forma recursiva.
 * 
 * @returns Un array de objetos, cada uno representando un símbolo con su respectiva información.
 */
public getSymbols(): any[] {
    let tablaSimbolos: any[] = [];

    // Recoger los símbolos del entorno actual (variables)
    for (let [id, simbolo] of this.variables.entries()) {
        tablaSimbolos.push({
            ID: id,
            Tipo: simbolo.getTipo(), // Método que retorna el tipo del símbolo
            Entorno: this.name, // Usamos el nombre del entorno actual
            Valor: simbolo.getValor(), // Método que retorna el valor actual del símbolo
            Línea: simbolo.getLinea(), // Método que retorna la línea de la declaración
            Columna: simbolo.getColumna() // Método que retorna la columna de la declaración
        });
    }

    // Recoger las funciones del entorno actual
    for (let [id, funcion] of this.funciones.entries()) {
        tablaSimbolos.push({
            ID: id,
            Tipo: "Función",
            Entorno: this.name, // Usamos el nombre del entorno actual
            Valor: "Función", // Indicamos que es una función, no un valor directo
            Línea: funcion.linea, // Asumimos que la función tiene una propiedad 'linea'
            Columna: funcion.columna // Asumimos que la función tiene una propiedad 'columna'
        });
    }

    // Recorrer y agregar los símbolos de los subentornos
    for (let i = 0; i < this.subEntornos.length; i++) {
        const subEntorno = this.subEntornos[i];
        tablaSimbolos = tablaSimbolos.concat(subEntorno.getSymbols());
    }

    return tablaSimbolos;
}

    
}
