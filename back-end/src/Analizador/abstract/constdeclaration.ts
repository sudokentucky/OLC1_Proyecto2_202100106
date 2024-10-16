import { Environment } from "../Environment/environment"; // El entorno donde se almacenan las variables
import { Expression } from "./expression"; // Clase que representa una expresión
import { DataType, Result } from "../expression/types"; // Tipos de datos utilizados y resultado de la expresión
import { Instruction } from "./instruction"; // Clase base de la cual heredan todas las instrucciones
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";

/**
 * Clase que representa la declaración de variables constantes.
 * Permite la declaración de una o varias variables a la vez, con o sin expresión inicial.
 */
export class ConstantDeclaration extends Instruction {
    constructor(
        private DataType: DataType,  // Tipo de dato de la variable
        private ids: string[],       // Lista de nombres de variables a declarar
        private exp: Expression | null, // Expresión que se evaluará para asignar su valor a la variable
        line: number,
        column: number
    ) {
        super(line, column);
    }

    /**
     * Método que ejecuta la declaración de variables constantes.
     */
    public execute(environment: Environment) {
        // Si hay una expresión, evaluamos su valor, de lo contrario, usamos un valor por defecto.
        let expResult: Result = this.evaluateExpression(environment);

        for (let id of this.ids) {
            // Verificamos si la variable ya existe en el entorno
            if (environment.getVariableInCurrentEnv(id)) {
                Errors.addError(
                    "Semántico",
                    `La constante '${id}' ya ha sido declarada en este entorno.`,
                    this.linea,
                    this.columna
                );
                continue;
            }

            // Guardamos la constante utilizando el método del entorno
            environment.saveConstVar(id, expResult, this.DataType, this.linea, this.columna);
        }
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
                // Retornamos un valor por defecto si hay un error de tipo
                expResult = this.getDefaultValueForType();
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
                return { value: true, DataType: DataType.BOOLEANO };
            case DataType.CHAR:
                return { value: '\0', DataType: DataType.CHAR };
            case DataType.STRING:
                return { value: "", DataType: DataType.STRING };
            case DataType.NULO:
            default:
                return { value: null, DataType: DataType.NULO };
        }
    }

    // Implementación del método generateNode usando DotGenerator
    public generateNode(dotGenerator: DotGenerator): string {
        // Crear el nodo para la declaración
        const declarationNode = dotGenerator.addNode(`ConstDeclaration: ${this.DataType}`);

        // Crear el nodo para el identificador
        const idNode = dotGenerator.addNode(`ID: ${this.ids}`);
        dotGenerator.addEdge(declarationNode, idNode);

        // Si hay una expresión, crear el nodo para el valor
        if (this.exp) {
            const valueNode = this.exp.generateNode(dotGenerator);
            dotGenerator.addEdge(declarationNode, valueNode);
        }

        return declarationNode;
    }
}
