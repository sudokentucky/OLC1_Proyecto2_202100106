//Define un tipo de dato que puede ser un entorno, una instruccion, una expresion, etc

export type Result ={
    value: any, //valor de la expresion
    DataType: DataType //tipo de dato de la expresion
}

//clase que define un tipo de dato
export enum DataType{
    ENTERO,     //0
    DECIMAL,    //1
    BOOLEANO,   //2
    CHAR,       //3
    STRING,     //4
    NULO        //5

}