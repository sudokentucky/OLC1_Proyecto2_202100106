%{
    //en dist se guarda el resultado de la compilación
    const Errors = require("../build/Analizador/Error/error").default;
    //AST
    const {AST} = require("../build/Analizador/Tree/AST");
    //Tipos de datos
    const {DataType} = require("../build/Analizador/expression/types");
    //Básicos
    const {Basic} = require("../build/Analizador/expression/basic");
    //Aritméticos
    const {Arithmetic,ArithmeticOption} = require("../build/Analizador/expression/arithmetic");  
    //Relacionales  
    const {Relational,RelationalOption} = require("../build/Analizador/expression/relational");
    //Lógicos
    const {Logical,LogicalOption} = require("../build/Analizador/expression/logical");
    //Ternario
    const {Ternary} = require("../build/Analizador/expression/ternary");
    //Acceso a variables
    const {Access} = require("../build/Analizador/expression/access");
    const {Declaration} = require("../build/Analizador/abstract/declaration");
    //Asignación
    const {Assignment} = require("../build/Analizador/Instructions/assignment");
    //Casting
    const {Cast} = require("../build/Analizador/Instructions/cast");
    //Incremento y decremento
    const {Increment} = require("../build/Analizador/Instructions/increment");
    const {Decrement} = require("../build/Analizador/Instructions/decrement");
    //Impresiones
    const {Echo} = require("../build/Analizador/Instructions/echo");
    //Arrays
    const {VectorAssignment} = require("../build/Analizador/Instructions/vectorassignment");
    const {MatrixAssignment} = require("../build/Analizador/Instructions/matrixassignment");
    const {VectorAccess} = require("../build/Analizador/expression/vectoraccess");
    const {MatrixAccess} = require("../build/Analizador/expression/matrixaccess");
    const {VectorDeclaration} = require("../build/Analizador/Instructions/vectordeclaration");
    const {MatrixDeclaration} = require("../build/Analizador/Instructions/matrixdeclaration");
    /*Sentencias de control*/
    const {If, IfElse, IfElseIf} = require("../build/Analizador/Instructions/if");
    const {Switch} = require("../build/Analizador/Instructions/switch");
    const {Case} = require("../build/Analizador/Instructions/case");
    const {Default} = require("../build/Analizador/Instructions/default");
    /*Sentencias Ciclicas*/
    const {While} = require("../build/Analizador/Instructions/while");
    const {For} = require("../build/Analizador/Instructions/for");
    const {DoUntil} = require("../build/Analizador/Instructions/dountil");
    const {Loop} = require("../build/Analizador/Instructions/loop");
    /*Sentencias de transferencia*/
    const {Return} = require("../build/Analizador/Instructions/return");
    const {Continue,Break} = require("../build/Analizador/Instructions/transfer");
%}
//Referencia a el lexer
%lex 
%options case-insensitive 

%%
// Comentarios de una linea y multilinea
\/\*[\s\S]*?\*\/        { console.log("Comentario multilínea ignorado"); } /* ignore comments */
\/\/.*(?:\r?\n|$)       { console.log("Comentario de una línea ignorado"); } /* ignore comments */


// System symbols
"{"                     { console.log("Token LLAVE_IZQ"); return 'LLAVE_IZQ'; }
"}"                     { console.log("Token LLAVE_DER"); return 'LLAVE_DER'; }
"("                     { console.log("Token PARENTESIS_IZQ"); return 'PARENTESIS_IZQ'; }
")"                     { console.log("Token PARENTESIS_DER"); return 'PARENTESIS_DER'; }
"["                     { console.log("Token CORCHETE_IZQ"); return 'CORCHETE_IZQ'; }
"]"                     { console.log("Token CORCHETE_DER"); return 'CORCHETE_DER'; }
";"                     { console.log("Token PUNTO_Y_COMA"); return 'PUNTO_Y_COMA'; }
","                     { console.log("Token COMA"); return 'COMA'; }
"."                     { console.log("Token PUNTO"); return 'PUNTO'; }
":"                     { console.log("Token DOS_PUNTOS"); return 'DOS_PUNTOS'; }
// Palabras reservadas
"new"                   { console.log("Token NEW"); return 'NEW'; }
"void"                  { console.log("Token VOID"); return 'VOID'; }
//Cadenas
(\"(\\.|[^\\"])*\") {/* yytext = yytext.substring(1, yytext.length - 2)*/; console.log("Token CADENA:", yytext); return 'CADENA'; }

// Caracter
[']\\\\[']|[']\\\"[']|[']\\\'[']|[']\\n[']|[']\\t[']|[']\\r[']|['].?['] 
                        { yytext = yytext.substr(1, yyleng-2); console.log("Token CARACTER:", yytext); return 'CARACTER'; }
// Operadores relacionales
"=="                    { console.log("Token IGUAL"); return 'IGUAL'; }
"!="                    { console.log("Token DIFERENTE"); return 'DIFERENTE'; }
"<"                     { console.log("Token MENOR_QUE"); return 'MENOR_QUE'; }
">"                     { console.log("Token MAYOR_QUE"); return 'MAYOR_QUE'; }
"<="                    { console.log("Token MENOR_IGUAL_QUE"); return 'MENOR_IGUAL_QUE'; }
">="                    { console.log("Token MAYOR_IGUAL_QUE"); return 'MAYOR_IGUAL_QUE'; }

// Tipos de datos
"true"                 { console.log("Token TRUE"); return 'TRUE'; }
"false"                { console.log("Token FALSE"); return 'FALSE'; }
"int"                   { console.log("Token INT"); return 'INT'; }
"double"                { console.log("Token DOUBLE"); return 'DOUBLE'; }
"bool"                  { console.log("Token BOOL"); return 'BOOL'; }
"char"                  { console.log("Token CHAR"); return 'CHAR'; }
"string"                { console.log("Token STRING"); return 'STRING'; }
"null"                  { console.log("Token NULL"); return 'NULL'; }
"="                     { console.log("Token ASIGNACION"); return 'ASIGNACION'; }
// Incremento y decremento
"++"                    { console.log("Token INCREMENTO"); return 'INCREMENTO'; }
"--"                    { console.log("Token DECREMENTO"); return 'DECREMENTO'; }
// Operadores aritméticos
"+"                     { console.log("Token SUMA"); return 'SUMA'; }
"-"                     { console.log("Token RESTA"); return 'RESTA'; }
"*"                     { console.log("Token MULTIPLICACION"); return 'MULTIPLICACION'; }
"/"                     { console.log("Token DIVISION"); return 'DIVISION'; }
"^"                     { console.log("Token POTENCIA"); return 'POTENCIA'; }
"$"                     { console.log("Token RAIZ"); return 'RAIZ'; }
"%"                     { console.log("Token MODULO"); return 'MODULO'; }

// Operadores lógicos
"&&"                    { console.log("Token AND"); return 'AND'; }
"||"                    { console.log("Token OR"); return 'OR'; }
"!"                     { console.log("Token NOT"); return 'NOT'; }

// Declaración de variables
// Variables mutables
"Let"                   { console.log("Token LET"); return 'LET'; }
// Variables inmutables
"const"                 { console.log("Token CONST"); return 'CONST'; }

// Casting
"cast"                  { console.log("Token CAST"); return 'CAST'; }
"as"                    { console.log("Token AS"); return 'AS'; }


// Vector
"vector"                { console.log("Token VECTOR"); return 'VECTOR'; }

// Sentencias de control
"if"                    { console.log("Token IF"); return 'IF'; }
"else"                  { console.log("Token ELSE"); return 'ELSE'; }
"switch"                { console.log("Token SWITCH"); return 'SWITCH'; }
"case"                  { console.log("Token CASE"); return 'CASE'; }
"default"               { console.log("Token DEFAULT"); return 'DEFAULT'; }

// Sentencias cíclicas
"while"                 { console.log("Token WHILE"); return 'WHILE'; }
"for"                   { console.log("Token FOR"); return 'FOR'; }
"do"                    { console.log("Token DO"); return 'DO'; }
"until"                 { console.log("Token UNTIL"); return 'UNTIL'; }
"loop"                  { console.log("Token LOOP"); return 'LOOP'; }

// Sentencias de transferencia
"break"                 { console.log("Token BREAK"); return 'BREAK'; }
"continue"              { console.log("Token CONTINUE"); return 'CONTINUE'; }
"return"                { console.log("Token RETURN"); return 'RETURN'; }

// Funciones
"function"              { console.log("Token FUNCTION"); return 'FUNCTION'; }

// Método
"echo"                  { console.log("Token ECHO"); return 'ECHO'; }
"is"                    { console.log("Token IS"); return 'IS'; }
// Funciones nativas
"lower"                 { console.log("Token LOWERCASE"); return 'LOWERCASE'; }
"upper"                 { console.log("Token UPPERCASE"); return 'UPPERCASE'; }
"round"                 { console.log("Token ROUND"); return 'ROUND'; }
"length"                { console.log("Token LENGTH"); return 'LENGTH'; }
"truncate"              { console.log("Token TRUNCATE"); return 'TRUNCATE'; }
"toString"              { console.log("Token TOSTRING"); return 'TOSTRING'; }
"toCharArray"           { console.log("Token TOCHARARRAY"); return 'TOCHARARRAY'; }
"reverse"               { console.log("Token REVERSE"); return 'REVERSE'; }
"max"                   { console.log("Token MAX"); return 'MAX'; }
"min"                   { console.log("Token MIN"); return 'MIN'; }
"sum"                   { console.log("Token SUM"); return 'SUM'; }
"average"               { console.log("Token AVERAGE"); return 'AVERAGE'; }

// Función ejecutar
"ejecutar"              { console.log("Token EJECUTAR"); return 'EJECUTAR'; }

// Números y cadenas
[0-9]+("."[0-9]+)\b     { console.log("Token DECIMAL:", yytext); return 'DECIMAL'; }
[0-9]+\b                { console.log("Token ENTERO:", yytext); return 'ENTERO'; }
([a-zA-z])[a-zA-Z0-9_]* { console.log("Token ID:", yytext); return 'ID'; }
// Espacios en blanco (espacio, tab, newline, etc.)
\s+               { console.log("Nueva línea ignorada"); } /* ignore whitespace */

//Errores léxicos
. {
    console.log(`Error léxico: Caracter no válido '${yytext}' en línea ${yylloc.first_line}, columna ${yylloc.first_column}`);
    Errors.addError("Léxico", `Caracter no válido '${yytext}'`, yylloc.first_line, yylloc.first_column);  // Agregar el error a la lista
}

//Fin de la cadena
<<EOF>>                { return "EOF"; }
//Fin de el analisis lexico
/lex

//Precedencia de los operadores
%left 'OR' 
%left 'AND' 
%left 'NOT'
%left 'IGUAL', 'DIFERENTE', 'MENOR_QUE','MENOR_IGUAL_QUE', 'MAYOR_QUE',  'MAYOR_IGUAL_QUE'  // Nivel 4 - Izquierda (Relacionales)
%left 'SUMA' 'RESTA'  
%left 'MULTIPLICACION' 'DIVISION' 'MODULO'  
%left 'POTENCIA' 'RAIZ' 
%right 'UNARIO' 
%right 'DOS_PUNTOS' 'IF'


// simbolo inicial
%start ini
// Definición de la gramática
%%


// Reglas de la gramática
ini : instrucciones  EOF { return  new AST($1); } //Inicio de la gramática
;
instrucciones : instrucciones instruccion          {  $1.push($2); $$ = $1;}
              | instruccion                        { $$ = [$1];}
              
;


instruccion
                : print PUNTO_Y_COMA            {$$ = $1;}
                | declaracion PUNTO_Y_COMA      {$$ = $1;}
                | asignacion PUNTO_Y_COMA        {$$ = $1;}
                | array PUNTO_Y_COMA             {$$ = $1;}
                | update PUNTO Y COMA                        {$$ = $1;}
                | if_statement                  {$$ = $1;}
                | case_statement                {$$ = $1;}
                | break PUNTO_Y_COMA             {$$ = $1;}
                | continue PUNTO_Y_COMA          {$$ = $1;}
                | return PUNTO_Y_COMA            {$$ = $1;}
                | while_statement               {$$ = $1;}
                | for_statement                 {$$ = $1;}
                | do_until_statement            {$$ = $1;}
                | loop_statement                {$$ = $1;}

                ;
                


//Retorno de valores con $$
update
        //Incremento
        : expresion INCREMENTO  { $$ = new Increment($1.id, @1.first_line, @1.first_column); }
        //Decremento
        | expresion DECREMENTO  { $$ = new Decrement($1.id, @1.first_line, @1.first_column); }
        | asignacion            { $$ = $1; }
        ;

expresion 
    : RESTA expresion %prec UNARIO { $$ = new Arithmetic(new Basic("0", DataType.ENTERO, @1.first_line, @1.first_column), $2, ArithmeticOption.RESTA,@1.first_line, @1.first_column); }
    | expresion SUMA expresion    { $$ = new Arithmetic($1, $3, ArithmeticOption.SUMA, @1.first_line, @1.first_column); }
    | expresion RESTA expresion   { $$ = new Arithmetic($1, $3, ArithmeticOption.RESTA, @1.first_line, @1.first_column); }
    | expresion MULTIPLICACION expresion { $$ = new Arithmetic($1, $3, ArithmeticOption.MULTIPLICACION, @1.first_line, @1.first_column); }
    | expresion DIVISION expresion { $$ = new Arithmetic($1, $3, ArithmeticOption.DIVISION, @1.first_line, @1.first_column); }
    | expresion POTENCIA expresion { $$ = new Arithmetic($1, $3, ArithmeticOption.POTENCIA, @1.first_line, @1.first_column); }
    | expresion RAIZ expresion { $$ = new Arithmetic($1, $3, ArithmeticOption.RAIZ, @1.first_line, @1.first_column); }
    | expresion MODULO expresion { $$ = new Arithmetic($1, $3, ArithmeticOption.MODULO, @1.first_line, @1.first_column); }
    | relacional                   { $$ = $1 }
    | logicos                      { $$ = $1 }
    | ternario                      { $$ = $1 } 
    | ENTERO                       { 
                                    console.log("Expresión entera:", $1);
                                    $$ = new Basic($1, DataType.ENTERO, @1.first_line, @1.first_column); }
    | DECIMAL                      { $$ = new Basic($1, DataType.DECIMAL, @1.first_line, @1.first_column); }
    | TRUE                         { $$ = new Basic($1, DataType.BOOLEANO, @1.first_line, @1.first_column); }
    | FALSE                        { $$ = new Basic($1, DataType.BOOLEANO, @1.first_line, @1.first_column); }
    | CADENA                       { $$ = new Basic($1, DataType.STRING, @1.first_line, @1.first_column); }
    | CARACTER                    { $$ = new Basic($1, DataType.CHAR, @1.first_line, @1.first_column); }
    | NULL                         { $$ = new Basic($1, DataType.NULL, @1.first_line, @1.first_column); }
    | ID                           { $$ = new Access($1, @1.first_line, @1.first_column); }
    | PARENTESIS_IZQ expresion PARENTESIS_DER { $$ = $2 }
    | CAST PARENTESIS_IZQ expresion AS tipo_datos PARENTESIS_DER { $$ = new Cast($3, $5, @1.first_line, @1.first_column); }
    // Acceso a vector unidimensional: <ID>[<EXPRESION>]
    | ID CORCHETE_IZQ expresion CORCHETE_DER {
        console.log(`Acceso a vector unidimensional ${$1} en posición [${$3}]`);
        $$ = new VectorAccess($1, $3, @1.first_line, @1.first_column);  // Acceso a vector unidimensional
    }
    // Acceso a vector bidimensional: <ID>[<EXPRESION>][<EXPRESION>]
    | ID CORCHETE_IZQ expresion CORCHETE_DER CORCHETE_IZQ expresion CORCHETE_DER {
        console.log(`Acceso a matriz ${$1} en posición [${$3}][${$6}]`);
        $$ = new MatrixAccess($1, $3, $6, @1.first_line, @1.first_column);  // Acceso a matriz bidimensional
    }
;



relacional  : expresion IGUAL expresion {$$ = new Relational($1,$3,RelationalOption.IGUALDAD,@1.first_line, @1.first_column);}
            | expresion DIFERENTE expresion {$$ = new Relational($1,$3,RelationalOption.DISTINTO,@1.first_line, @1.first_column);}
            | expresion MENOR_QUE expresion {$$ = new Relational($1,$3,RelationalOption.MENOR,@1.first_line, @1.first_column);}
            | expresion MAYOR_QUE expresion {$$ = new Relational($1,$3,RelationalOption.MAYOR,@1.first_line, @1.first_column);}
            | expresion MENOR_IGUAL_QUE expresion {$$ = new Relational($1,$3,RelationalOption.MAYORIGUAL,@1.first_line, @1.first_column);}
            | expresion MAYOR_IGUAL_QUE expresion {$$ = new Relational($1,$3,RelationalOption.MENORIGUAL,@1.first_line, @1.first_column);}
;


ternario : IF PARENTESIS_IZQ expresion PARENTESIS_DER expresion DOS_PUNTOS expresion 
            { $$ = new Ternary($3, $5, $7, @1.first_line, @1.first_column); }
;

logicos    : expresion AND expresion {$$ = new Logical($1,$3,LogicalOption.AND,@1.first_line,@1.first_column);}
            | expresion OR expresion {$$ = new Logical($1,$3,LogicalOption.OR,@1.first_line,@1.first_column);}
            | NOT expresion {$$ = new Logical($2,null,LogicalOption.NOT,@1.first_line,@1.first_column);}
;

print 
    : ECHO expresion { 
        console.log("Print con CADENA:", $2);
        $$ = new Echo($2, @1.first_line, @1.first_column); 
        console.log("Print:", $$);
    }
;

tipo_datos
        : INT                       {$$ = DataType.ENTERO;}
        | DOUBLE                    {$$ = DataType.DECIMAL;}
        | BOOL                      {$$ = DataType.BOOLEANO;}
        | STRING                    {$$ = DataType.STRING;}
        | CHAR                      {$$ = DataType.CHAR;}
;

declaracion//Declaración de variables
    : LET id_list DOS_PUNTOS tipo_datos  { //Declaración de variable mutable sin asignación
        console.log("Declaración de variable mutable sin asignación:", $2);
        console.log("Tipo de dato:", $4);
        $$ = new Declaration($4, $2, null, false, @1.first_line, @1.first_column); // isConst = false
    }
    | LET id_list DOS_PUNTOS tipo_datos ASIGNACION expresion  { //Declaración de variable mutable con asignación
        console.log("Declaración de variable mutable con asignación:", $2);
        console.log("Tipo de dato:", $4);
        console.log("Expresión asignada:", $6);
        $$ = new Declaration($4, $2, $6, false, @1.first_line, @1.first_column); // isConst = false
    }
    |CONST id_list DOS_PUNTOS tipo_datos ASIGNACION expresion  { //Declaración de constante con asignación
        console.log("Declaración de constante con asignación:", $2);
        console.log("Tipo de dato:", $4);
        console.log("Expresión asignada:", $6);
        $$ = new Declaration($4, $2, $6, true, @1.first_line, @1.first_column); // isConst = true
    }
    
;

array 
    /*Vectores en 1 dimension*/
    // Tipo 1: let <ID> : <TIPO> [ ] = new vector <TIPO> [ <EXPRESION> ]
    : LET id_list DOS_PUNTOS tipo_datos CORCHETE_IZQ CORCHETE_DER ASIGNACION NEW VECTOR tipo_datos CORCHETE_IZQ expresion CORCHETE_DER {
        console.log(`Declaración de vector unidimensional ${$2} de tipo ${$4} con tamaño especificado`);
        console.log("Expresión asignada:", $12);
        $$ = new VectorDeclaration($4, $2, $12, null, @1.first_line, @1.first_column);  
    }// Tipo 2: let <ID> : <TIPO> [ ] = [ <LISTA_VALORES> ]
    | LET id_list DOS_PUNTOS tipo_datos CORCHETE_IZQ CORCHETE_DER ASIGNACION CORCHETE_IZQ content CORCHETE_DER {
        console.log(`Declaración de vector unidimensional ${$2} de tipo ${$4} con valores predefinidos`);
        console.log ("Valores asignados:", $9);
        $$ = new VectorDeclaration($4, $2, null, $9, @1.first_line, @1.first_column);  // Pasamos la lista de valores en lugar del tamaño
    }
    /*Vectores en 2 dimensiones*/
    // Tipo 1: let <ID> :<TIPO> [ ] [ ]= new vector <TIPO> [ <EXPRESION> ] [ <EXPRESION> ]
    | LET id_list DOS_PUNTOS tipo_datos CORCHETE_IZQ CORCHETE_DER CORCHETE_IZQ CORCHETE_DER ASIGNACION NEW VECTOR tipo_datos CORCHETE_IZQ expresion CORCHETE_DER CORCHETE_IZQ expresion CORCHETE_DER {
        console.log(`Declaración de matriz bidimensional ${$2} de tipo ${$4} con tamaños especificados`);
        $$ = new MatrixDeclaration($4, $2, $14, $17, null, @1.first_line, @1.first_column);  // Matriz bidimensional
    }
    // Tipo 2: let <ID> : <TIPO> [ ] [ ] = [ <LISTA_VALORES2> ]
    | LET id_list DOS_PUNTOS tipo_datos CORCHETE_IZQ CORCHETE_DER CORCHETE_IZQ CORCHETE_DER ASIGNACION CORCHETE_IZQ content2 CORCHETE_DER {
        console.log(`Declaración de matriz bidimensional ${$2} de tipo ${$4} con valores predefinidos`);
        console.log("Valores asignados:", $11);
        $$ = new MatrixDeclaration($4, $2, null, null, $11, @1.first_line, @1.first_column);  // Matriz bidimensional con valores
    }
;


content //Retorna una lista de expresiones
    : expresion { $$ = [$1]; }  // Inicializa $$ como un array con el primer valor
    | content COMA expresion { $1.push($3); $$ = $1; }  // Continúa agregando elementos
;


content2 // Contenido de un vector de dos dimensiones
    : content2 COMA CORCHETE_IZQ content CORCHETE_DER { 
        console.log("Agregando nueva fila a la matriz:", $4);
        $1.push($4);  // Añadir una nueva lista (fila) a las filas existentes
        $$ = $1;  // Actualizar la lista total de filas
    }
    | CORCHETE_IZQ content CORCHETE_DER { 
        console.log("Inicializando la primera fila de la matriz:", $2);
        $$ = [$2];  // Crear una nueva lista con la primera fila
    }
;


id_list
    // Lista de identificadores o cadenas con un solo elemento (ID o CADENA)
    : ID { 
        console.log("Creando lista de identificadores con un solo elemento ID:", $1);
        $$ = [$1]; 
    }
    // Lista de identificadores o cadenas con más de un elemento
    | id_list COMA ID { 
        console.log("Acumulando identificador ID:", $3, "en la lista:", $1);
        $1.push($3);
        $$ = $1; 
    }
;


asignacion 
    : ID ASIGNACION expresion { // Asignación de valor a una variable
        console.log(`Asignando valor a la variable ${$1}`);
        $$ = new Assignment($1, $3, @1.first_line, @1.first_column);
    }
    // Asignación a vector unidimensional: <ID> [ <EXPRESION> ] = <EXPRESION>
    | ID CORCHETE_IZQ expresion CORCHETE_DER ASIGNACION expresion {
        console.log(`Asignando valor al vector unidimensional ${$1} en posición [${$3}]`);
        $$ = new VectorAssignment($1, $3, $6, @1.first_line, @1.first_column);  // Asignación a vector unidimensional
    }
    // Asignación a vector bidimensional: <ID> [ <EXPRESION> ] [ <EXPRESION> ] = <EXPRESION>
    | ID CORCHETE_IZQ expresion CORCHETE_DER CORCHETE_IZQ expresion CORCHETE_DER ASIGNACION expresion {
        console.log(`Asignando valor a la matriz ${$1} en posición [${$3}][${$6}]`);
        $$ = new MatrixAssignment($1, $3, $6, $9, @1.first_line, @1.first_column);  // Asignación a matriz bidimensional
    }
;

if_statement // Sentencias de control if
    // if (expresion) { instrucciones }
    : IF PARENTESIS_IZQ expresion PARENTESIS_DER LLAVE_IZQ instrucciones LLAVE_DER {
        $$ = new If($3, $6, @1.first_line, @1.first_column);
    }
    //if (expresion) { instrucciones } else { instrucciones }
    | IF PARENTESIS_IZQ expresion PARENTESIS_DER LLAVE_IZQ instrucciones LLAVE_DER ELSE LLAVE_IZQ instrucciones LLAVE_DER {
        $$ = new IfElse($3, $6, $10, @1.first_line, @1.first_column);
    }
    //if (expresion) { instrucciones } else if (expresion) { instrucciones } else { instrucciones }
    | IF PARENTESIS_IZQ expresion PARENTESIS_DER LLAVE_IZQ instrucciones LLAVE_DER else_if_blocks ELSE LLAVE_IZQ instrucciones LLAVE_DER {
        $$ = new IfElseIf($3, $6, $8, $12, @1.first_line, @1.first_column);
    }
    ;

else_if_blocks // Bloques de else if
    // else if (expresion) { instrucciones } else if (expresion) { instrucciones }
    : else_if_blocks ELSE IF PARENTESIS_IZQ expresion PARENTESIS_DER LLAVE_IZQ instrucciones LLAVE_DER {
        $$ = $1;
        $$.push({ condition: $5, instructions: $8 });
    }
    // else if (expresion) { instrucciones }
    | ELSE IF PARENTESIS_IZQ expresion PARENTESIS_DER LLAVE_IZQ instrucciones LLAVE_DER {
        $$ = [{ condition: $4, instructions: $7 }];
    }
    ;

case_statement // Sentencias de control switch
    // switch (expresion) {(list_of_cases) (default)}
    : SWITCH PARENTESIS_IZQ expresion PARENTESIS_DER LLAVE_IZQ lista_casos default LLAVE_DER {
        $$ = new Switch($3, $6, $7, @1.first_line, @1.first_column);
    }
    // switch (expresion) {(list_of_cases)}
    | SWITCH PARENTESIS_IZQ expresion PARENTESIS_DER LLAVE_IZQ lista_casos LLAVE_DER {
        $$ = new Switch($3, $6, null, @1.first_line, @1.first_column);
    }
    // switch (expresion) {default}
    | SWITCH PARENTESIS_IZQ expresion PARENTESIS_DER LLAVE_IZQ default LLAVE_DER {
        $$ = new Switch($3, [], $6, @1.first_line, @1.first_column);
    }
;

lista_casos
    : lista_casos caso { $1.push($2); $$ = $1; }
    | caso { $$ = [$1]; }
;

caso
    : CASE expresion DOS_PUNTOS instrucciones {
        $$ = new Case($2, $4, @1.first_line, @1.first_column);
    }
;

default
    : DEFAULT DOS_PUNTOS instrucciones {
        $$ = new Default($3, @1.first_line, @1.first_column);
    }
;

break
    : BREAK { $$ = new Break(@1.first_line, @1.first_column); }
;

continue
    : CONTINUE { $$ = new Continue(@1.first_line, @1.first_column); }
;

return
    : RETURN expresion { $$ = new Return($2, @1.first_line, @1.first_column); }
    | RETURN { $$ = new Return(null, @1.first_line, @1.first_column); }
;

while_statement // Sentencias cíclicas while
    : WHILE PARENTESIS_IZQ expresion PARENTESIS_DER LLAVE_IZQ instrucciones LLAVE_DER {
        $$ = new While($3, $6, @1.first_line, @1.first_column);
    }
;

for_statement // Sentencias cíclicas for
    : FOR PARENTESIS_IZQ instruccion  expresion PUNTO_Y_COMA update PARENTESIS_DER LLAVE_IZQ instrucciones LLAVE_DER {
        $$ = new For($3, $4, $6, $9, @1.first_line, @1.first_column);
    }
;

do_until_statement // Sentencias cíclicas do until
    : DO LLAVE_IZQ instrucciones LLAVE_DER UNTIL PARENTESIS_IZQ expresion PARENTESIS_DER PUNTO_Y_COMA{
        $$ = new DoUntil($7, $3, @1.first_line, @1.first_column);
    }
;

loop_statement // Sentencias cíclicas loop
    : LOOP LLAVE_IZQ instrucciones LLAVE_DER {
        $$ = new Loop($3, @1.first_line, @1.first_column);
    }
;
