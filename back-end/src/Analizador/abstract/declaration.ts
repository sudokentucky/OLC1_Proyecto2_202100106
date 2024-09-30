import { Environment } from "../Environment/environment"; // El entorno donde se almacenan las variables
import { Expression } from "./expression"; // Clase que representa una expresión
import { DataType, Result } from "../expression/types"; // Tipos de datos utilizados y resultado de la expresión
import { Instruction } from "./instruction"; // Clase base de la cual heredan todas las instrucciones
import Errors from "../Error/error";

/**
 * Clase que representa la declaración de variables, tanto mutables como inmutables.
 * Permite la declaración de una o varias variables a la vez, con o sin expresión inicial.
 */
export class Declaration extends Instruction {
    constructor(
        private DataType: DataType,  // Tipo de dato de la variable
        private ids: string[],       // Lista de nombres de variables a declarar
        private exp: Expression | null, // Expresión que se evaluará para asignar su valor a la variable
        private isConst: boolean,    // Indica si la variable es constante (const)
        line: number,
        column: number
    ) {
        super(line, column);
    }

    /**
     * Método que ejecuta la declaración de variables.
     * Llama a la lógica correspondiente según si la variable es constante o mutable.
     */
    public execute(environment: Environment) {
        console.log(`Iniciando declaración de variables en línea ${this.linea}, columna ${this.columna}`);
        
        if (this.isConst) {
            this.declareConst(environment);
        } else {
            this.declareMutable(environment);
        }
    }

    /**
     * Lógica para declarar variables constantes (inmutables).
     */
    private declareConst(environment: Environment) {
        let expResult: Result | null = this.evaluateExpression(environment);
    
        // Validación adicional para constantes: deben estar inicializadas
        if (!this.exp) {
            const errorMsg = `La constante debe ser inicializada.`;
            console.error(errorMsg);
            Errors.addError("Semántico", errorMsg, this.linea, this.columna);
            return;
        }
    
        for (const id of this.ids) {
            const existingVar = environment.GetVariable(id);
    
            if (existingVar !== null) {
                const errorMsg = `La variable ${id} ya ha sido declarada previamente como constante.`;
                console.error(errorMsg);
                Errors.addError("Semántico", errorMsg, this.linea, this.columna);
                return;
            }
    
            // Guardar la constante
            console.log(`Guardando constante ${id} en el entorno.`);
            environment.SaveVariable(id, expResult, this.DataType, this.linea, this.columna, true); // Pasamos true para indicar que es constante
        }
    
        console.log("Declaración de constante completada.\n");
    }
    

    /**
     * Lógica para declarar variables mutables.
     */
    private declareMutable(environment: Environment) {
        let expResult: Result | null = this.evaluateExpression(environment);
    
        for (const id of this.ids) {
            const existingVar = environment.GetVariable(id);
    
            if (existingVar !== null) {
                Errors.addError(
                    "Semántico",
                    `La variable ${id} ya existe en el entorno.`,
                    this.linea,
                    this.columna
                );
            }
    
            // Guardar la variable mutable
            console.log(`Guardando variable mutable ${id} en el entorno.`);
            environment.SaveVariable(id, expResult, this.DataType, this.linea, this.columna, false); // Pasamos false para indicar que no es constante
        }
    
        console.log("Declaración de variable mutable completada.\n");
    }
    

    /**
     * Evalúa la expresión de inicialización si existe, o asigna un valor por defecto según el tipo.
     */
    private evaluateExpression(environment: Environment): Result {
        let expResult: Result;

        if (this.exp) {
            console.log("Evaluando expresión...");
            expResult = this.exp.execute(environment);

            console.log(`Resultado de la expresión: ${expResult.value}, Tipo: ${DataType[expResult.DataType]}`);

            // Verificación de coincidencia de tipos
            if (expResult.DataType !== this.DataType) {
                Errors.addError(
                    "Semántico",
                    `Tipo de dato incorrecto en la asignación. Se esperaba ${DataType[this.DataType]}, pero se recibió ${DataType[expResult.DataType]}.`,
                    this.linea,
                    this.columna
                );
            }
        } else {
            // Si no hay expresión, asignamos un valor por defecto basado en el tipo de dato
            expResult = this.getDefaultValueForType();
            console.log(`No se proporcionó expresión. Asignando valor por defecto: ${expResult.value} (Tipo: ${DataType[expResult.DataType]})`);
        }

        return expResult;
    }

    /**
     * Obtiene el valor por defecto según el tipo de dato.
     */
    private getDefaultValueForType(): Result {
        switch (this.DataType) {
            case DataType.ENTERO:
                return { value: 0, DataType: DataType.ENTERO };
            case DataType.DECIMAL:
                return { value: 0.0, DataType: DataType.DECIMAL };
            case DataType.BOOLEANO:
                return { value: false, DataType: DataType.BOOLEANO };
            case DataType.CHAR:
                return { value: '\0', DataType: DataType.CHAR };
            case DataType.STRING:
                return { value: "", DataType: DataType.STRING };
            case DataType.NULO:
            default:
                return { value: null, DataType: DataType.NULO };
        }
    }
}
