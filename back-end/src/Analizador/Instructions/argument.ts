import { Environment } from "../Environment/environment";
import Errors from "../Error/error";
import { DotGenerator } from "../Tree/DotGenerator";
import { Expression } from "../abstract/expression";
import { Instruction } from "../abstract/instruction";

export class Argument extends Instruction{
    public callEnv:Environment|null;
    constructor(
        public id:string, 
        private expression: 
        Expression, 
        line: number, 
        column: number){
        super(line, column);
        this.callEnv = null;

    }

    public execute(entorno: Environment) {
        const variable = this.callEnv!.GetVariable(this.id);
        if(variable == undefined)
          throw new  Errors("Semantico", "Variable no encontrada", this.linea, this.columna);
        const exp = this.expression.execute(entorno);

        if(variable?.DataType != exp.DataType)
            throw new Errors("Semantico", "Tipo de dato incorrecto", this.linea, this.columna);
        variable?.setValor(exp);

    }

    public generateNode(dotGenerator: DotGenerator): string {
        const argNode = dotGenerator.addNode(`Argumento: ${this.id}`);
        if (this.expression) {
            const expNode = this.expression.generateNode(dotGenerator);
            dotGenerator.addEdge(argNode, expNode);
        }
        return argNode;
    }

    public setEnv(v:Environment){
        this.callEnv = v;
    }
}


/*

funcion void suma (n: int = 0){
    return n;
}

main(){
print(suma(n = 1)); // 5

}
*/
