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
     * Método para guardar una variable en el entorno esta variable no es constante
     * Si la variable ya existe y el tipo coincide, actualiza su valor.
     * Si no existe, la agrega al mapa de variables.
     * 
     * @param id - El nombre de la variable.
     * @param valor - El valor resultante que se va a almacenar, empaquetado en un objeto `Result`.
     * @param tipoDato - El tipo de dato de la variable.
     * @param esConst - Indica si la variable es constante. en este caso es false
     * @param linea - La línea de código donde se declara la variable.
     * @param columna - La columna de código donde se declara la variable.
     * @throws Error - Si la variable ya existe y el tipo no coincide.
     */
    public saveVariable(
        id: string, 
        valor: Result, 
        tipoDato: DataType, 
        linea: number, 
        columna: number
    ) {
        // Si la variable ya existe y no es constante, actualizamos su valor.
        if (this.variables.has(id)) {
            const variable = this.variables.get(id);  
            // Actualizamos el valor de la variable mutable
            variable?.setValor(valor);
            console.log(`Variable mutable ${id} actualizada en el entorno.`);
        } else {
            // Si no existe, la creamos usando el método estático para variables mutables
            const nuevaVariable = Symbol.crearVariableMutable(id, valor.value, tipoDato, linea, columna);
            this.variables.set(id, nuevaVariable);
            console.log(`Variable mutable ${id} creada en el entorno.`);
        }
    }
    
    
    
/**
 * Metodo para guardar una variable esta siendo Constante
 * No se puede reasignar una constante
 * @param id - El nombre de la variable.
 * @param valor - El valor resultante que se va a almacenar, empaquetado en un objeto `Result`.
 * @param tipoDato - El tipo de dato de la variable.
 * @param esConst - Indica si la variable es constante. en este caso es true
 * @param linea - La línea de código donde se declara la variable.
 * @param columna - La columna de código donde se declara la variable.
 */
public saveConstVar(
    id: string, 
    valor: Result, 
    tipoDato: DataType, 
    linea: number, 
    columna: number
) {
    // Si la variable ya existe, no se puede volver a declarar
    if (this.variables.has(id)) {
        const mensaje = `La constante ${id} ya ha sido declarada.`;
        console.error(mensaje);
        Errors.addError("Semántico", mensaje, linea, columna);
        return;
    }

    // Creamos la nueva constante usando el método estático para constantes
    const nuevaConstante = Symbol.crearVariableConstante(id, valor.value, tipoDato, linea, columna);
    this.variables.set(id, nuevaConstante);
    console.log(`Constante ${id} creada en el entorno.`);
}

/**
 * Método para actualizar el valor de una variable existente en el entorno actual.
 * Si la variable no existe en el entorno actual, muestra un error.
 * 
 * @param id - El nombre de la variable a actualizar.
 * @param valor - El nuevo valor empaquetado en un objeto `Result` que se asignará.
 * @throws Error - Si la variable no existe en el entorno actual.
 */
public UpdateVariable(id: string, valor: Result, line: number, column: number) {
    console.log(`Intentando actualizar la variable ${id} con valor: ${valor.value}`);
    
    if (this.variables.has(id)) {
        const variable = this.variables.get(id);
        console.log(`Variable ${id} encontrada en el entorno actual. Actualizando valor a ${valor.value}`);
        variable?.setValor(valor);
    } else {
        const mensaje = `La variable ${id} no existe en el entorno actual`;
        console.error(mensaje);
        Errors.addError("Semántico", mensaje, line, column);
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
        } //Si la variable no se encuentra en el entorno actual, se busca en el entorno padre
        ActualEnv = ActualEnv.previous //Se cambia al entorno padre
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
   public guardarFuncion(id: string, funcion: Funct, linea: number, columna: number) {
        if (this.funciones.has(id)) {
            const mensaje = `La función ${id} ya existe en el entorno actual`;
            console.error(mensaje);
            Errors.addError("Semántico", mensaje, linea, columna);
            return;
        }
        this.funciones.set(id, funcion);
        console.log(`Función ${id} guardada en el entorno.`);
    }
    /**
     * Método para obtener una función por su identificador.
     * @param id - El nombre de la función que se desea obtener.
     * @returns Function | null - La función encontrada o null si no existe.
     */
    public getFuncion(id: string): Funct | null | undefined {
        let entoroActual: Environment | null = this;
        while (entoroActual != null) {
          if (entoroActual.funciones.has(id)) {
            return entoroActual.funciones.get(id);
          }
          entoroActual = entoroActual.previous;
        }
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
    public agregarSubEntorno(entorno: Environment) {
        this.subEntornos.push(entorno);
        console.log(`Subentorno añadido al entorno actual.`);
        console.log(`Entorno actual: ${this.variables.size} variables, ${this.funciones.size} funciones, ${this.subEntornos.length} subentornos`);    }
    
    public createSubEnvironment(nombre: string): Environment {
        const subEnvironment = new Environment(this, nombre);
        this.agregarSubEntorno(subEnvironment);
            return subEnvironment;
        }
        
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
