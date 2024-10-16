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
    const {ConstantDeclaration} = require("../build/Analizador/abstract/constdeclaration");
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
    const {ifSentence} = require("../build/Analizador/Instructions/if");
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
    /*Funcion*/
    const {Funct} = require("../build/Analizador/Instructions/Function");
    const {Statement} = require("../build/Analizador/Instructions/statement");
    const {Call} = require("../build/Analizador/Instructions/call");
    const {MethodCall} = require("../build/Analizador/Instructions/methodcall");
    /*Ejecutar*/
    const {Execute} = require("../build/Analizador/Instructions/execute");
    const {Length} = require("../build/Analizador/Instructions/length");
%}
//Referencia a el lexer
%lex 
%options case-insensitive 

%%
// Comentarios de una linea y multilinea
\/\*[\s\S]*?\*\/        { } /* ignore comments */
\/\/.*(?:\r?\n|$)       { } /* ignore comments */

// System symbols
"{"                     { return 'LLAVE_IZQ'; }
"}"                     { return 'LLAVE_DER'; }
"("                     { return 'PARENTESIS_IZQ'; }
")"                     { return 'PARENTESIS_DER'; }
"["                     { return 'CORCHETE_IZQ'; }
"]"                     { return 'CORCHETE_DER'; }
";"                     { return 'PUNTO_Y_COMA'; }
","                     { return 'COMA'; }
":"                     { return 'DOS_PUNTOS'; }

// Palabras reservadas
"new"                   { return 'NEW'; }
"void"                  { return 'VOID'; }

// Cadenas
(\"(\\.|[^\\"])*\")     { /* yytext = yytext.substring(1, yytext.length - 2); */ return 'CADENA'; }

// Caracter
[']\\\\[']|[']\\\"[']|[']\\\'[']|[']\\n[']|[']\\t[']|[']\\r[']|['].?['] 
                        { yytext = yytext.substr(1, yyleng - 2); return 'CARACTER'; }

// Operadores relacionales
"=="                    { return 'IGUAL'; }
"!="                    { return 'DIFERENTE'; }
"<="                    { return 'MENOR_IGUAL_QUE'; }
">="                    { return 'MAYOR_IGUAL_QUE'; }
"<"                     { return 'MENOR_QUE'; }
">"                     { return 'MAYOR_QUE'; }
"="                     { return 'ASIGNACION'; }

// Tipos de datos
"true"                  { return 'TRUE'; }
"false"                 { return 'FALSE'; }
"int"                   { return 'INT'; }
"double"                { return 'DOUBLE'; }
"bool"                  { return 'BOOL'; }
"char"                  { return 'CHAR'; }
"string"                { return 'STRING'; }
"null"                  { return 'NULL'; }

// Incremento y decremento
"++"                    { return 'INCREMENTO'; }
"--"                    { return 'DECREMENTO'; }

// Operadores aritméticos
"+"                     { return 'SUMA'; }
"-"                     { return 'RESTA'; }
"*"                     { return 'MULTIPLICACION'; }
"/"                     { return 'DIVISION'; }
"^"                     { return 'POTENCIA'; }
"$"                     { return 'RAIZ'; }
"%"                     { return 'MODULO'; }

// Operadores lógicos
"&&"                    { return 'AND'; }
"||"                    { return 'OR'; }
"!"                     { return 'NOT'; }

// Declaración de variables
"Let"                   { return 'LET'; }
"const"                 { return 'CONST'; }

// Casting
"cast"                  { return 'CAST'; }
"as"                    { return 'AS'; }

// Sentencias de control
"if"                    { return 'IF'; }
"else"                  { return 'ELSE'; }
"switch"                { return 'SWITCH'; }
"case"                  { return 'CASE'; }
"default"               { return 'DEFAULT'; }

// Sentencias cíclicas
"while"                 { return 'WHILE'; }
"for"                   { return 'FOR'; }
"do"                    { return 'DO'; }
"until"                 { return 'UNTIL'; }
"loop"                  { return 'LOOP'; }
"vector"                { return 'VECTOR'; }

// Sentencias de transferencia
"break"                 { return 'BREAK'; }
"continue"              { return 'CONTINUE'; }
"return"                { return 'RETURN'; }

// Funciones
"function"              { return 'FUNCTION'; }

// Método
"echo"                  { return 'ECHO'; }
"is"                    { return 'IS'; }

// Funciones nativas
"lower"                 { return 'LOWERCASE'; }
"upper"                 { return 'UPPERCASE'; }
"round"                 { return 'ROUND'; }
"len"                   { return 'LEN'; }
"truncate"              { return 'TRUNCATE'; }
"toString"              { return 'TOSTRING'; }
"toCharArray"           { return 'TOCHARARRAY'; }
"reverse"               { return 'REVERSE'; }
"max"                   { return 'MAX'; }
"min"                   { return 'MIN'; }
"sum"                   { return 'SUM'; }
"average"               { return 'AVERAGE'; }

// Función ejecutar
"ejecutar"              { return 'EJECUTAR'; }

// Números y cadenas
[0-9]+("."[0-9]+)\b     { return 'DECIMAL'; }
[0-9]+\b                { return 'ENTERO'; }
([a-zA-Z])[a-zA-Z0-9_]* { return 'ID'; }

// Espacios en blanco (espacio, tab, newline, etc.)
\s+                     { } /* ignore whitespace */

// Errores léxicos
. {
    Errors.addError("Léxico", `Caracter no válido '${yytext}'`, yylloc.first_line, yylloc.first_column);
}

//Fin de la cadena
<<EOF>>                { return "EOF"; }
//Fin de el analisis lexico
/lex

//Precedencia de los operadores
%left 'OR' 
%left 'AND' 
%right 'NOT'
%left 'IGUAL', 'DIFERENTE', 'MENOR_QUE','MENOR_IGUAL_QUE', 'MAYOR_QUE',  'MAYOR_IGUAL_QUE'  // Nivel 4 - Izquierda (Relacionales)
%left 'SUMA' 'RESTA'  
%left 'MULTIPLICACION' 'DIVISION' 'MODULO'  
%nonassoc 'POTENCIA' 'RAIZ' 
%right 'UNARIO' 
%left 'DOS_PUNTOS' 'IS'


// simbolo inicial
%start ini
// Definición de la gramática
%%


// Reglas de la gramática
ini : instrucciones  EOF { return  new AST($1); } //Inicio de la gramática
;
instrucciones : instrucciones instruccion          {$1.push($2); $$ = $1;}
              | instruccion                        {$$ = [$1];}
              
;


instruccion
                : print PUNTO_Y_COMA                        {$$ = $1;}
                | declaracion PUNTO_Y_COMA                  {$$ = $1;}
                | asignacion PUNTO_Y_COMA                   {$$ = $1;}
                | array PUNTO_Y_COMA                        {$$ = $1;}
                | update PUNTO_Y_COMA                        {$$ = $1;}
                | if_statement                              {$$ = $1;}
                | case_statement                            {$$ = $1;}
                | break PUNTO_Y_COMA                        {$$ = $1;}
                | continue PUNTO_Y_COMA                     {$$ = $1;}
                | return PUNTO_Y_COMA                       {$$ = $1;}
                | while_statement                           {$$ = $1;}
                | for_statement                             {$$ = $1;}
                | do_until_statement                        {$$ = $1;}
                | loop_statement                            {$$ = $1;}
                | declaracion_funcion                       {$$ = $1;}
                | llamada_metodo                            {$$ = $1;}
                | Execute PUNTO_Y_COMA                      {$$ = $1;}
                | len_statement PUNTO_Y_COMA                {$$ = $1;}
                ;
                


//Retorno de valores con $$
update
        //Incremento
        : expresion INCREMENTO  { $$ = new Increment($1.id, @1.first_line, @1.first_column); }
        //Decremento
        | expresion DECREMENTO  { $$ = new Decrement($1.id, @1.first_line, @1.first_column); }
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
    | ENTERO                       { $$ = new Basic($1, DataType.ENTERO, @1.first_line, @1.first_column); }
    | DECIMAL                      { $$ = new Basic($1, DataType.DECIMAL, @1.first_line, @1.first_column); }
    | TRUE                         { $$ = new Basic($1, DataType.BOOLEANO, @1.first_line, @1.first_column); }
    | FALSE                        { $$ = new Basic($1, DataType.BOOLEANO, @1.first_line, @1.first_column); }
    | CADENA                       { 
        /*Quitar comillas antes*/
        yytext = yytext.substring(1, yytext.length - 1);
        console.log("Expresion Basica", yytext,"Tipo String");
        $$ = new Basic(yytext, DataType.STRING, @1.first_line, @1.first_column); }
    | CARACTER                    { $$ = new Basic($1, DataType.CHAR, @1.first_line, @1.first_column); }
    | NULL                         { $$ = new Basic($1, DataType.NULL, @1.first_line, @1.first_column); }
    | ID                           { $$ = new Access($1, @1.first_line, @1.first_column); }
    | PARENTESIS_IZQ expresion PARENTESIS_DER { $$ = $2 }
    | CAST PARENTESIS_IZQ expresion AS tipo_datos PARENTESIS_DER { $$ = new Cast($3, $5, @1.first_line, @1.first_column); }
    // Acceso a vector unidimensional: <ID>[<EXPRESION>]
    | ID CORCHETE_IZQ expresion CORCHETE_DER {$$ = new VectorAccess($1, $3, @1.first_line, @1.first_column);  // Acceso a vector unidimensional
    }
    // Acceso a vector bidimensional: <ID>[<EXPRESION>][<EXPRESION>]
    | ID CORCHETE_IZQ expresion CORCHETE_DER CORCHETE_IZQ expresion CORCHETE_DER {
        $$ = new MatrixAccess($1, $3, $6, @1.first_line, @1.first_column);  // Acceso a matriz bidimensional
    }
    |ID PARENTESIS_IZQ parametros_llamada PARENTESIS_DER {
        $$ = new Call($1, $3, @1.first_line, @1.first_column);
    }
    | ID PARENTESIS_IZQ PARENTESIS_DER {
        $$ = new Call($1, [], @1.first_line, @1.first_column); // Llamada sin parámetros
    }
    |len_statement { $$ = $1; }
;

len_statement
            : LEN PARENTESIS_IZQ expresion PARENTESIS_DER{
                $$ = new Length($3, @1.first_line, @1.first_column);  
            }
            ;

relacional  : expresion IGUAL expresion {$$ = new Relational($1,$3,RelationalOption.IGUALDAD,@1.first_line, @1.first_column);}
            | expresion DIFERENTE expresion {$$ = new Relational($1,$3,RelationalOption.DISTINTO,@1.first_line, @1.first_column);}
            | expresion MENOR_QUE expresion {$$ = new Relational($1,$3,RelationalOption.MENOR,@1.first_line, @1.first_column);}
            | expresion MAYOR_QUE expresion {$$ = new Relational($1,$3,RelationalOption.MAYOR,@1.first_line, @1.first_column);}
            | expresion MENOR_IGUAL_QUE expresion {$$ = new Relational($1,$3,RelationalOption.MENORIGUAL,@1.first_line, @1.first_column);}
            | expresion MAYOR_IGUAL_QUE expresion {$$ = new Relational($1,$3,RelationalOption.MAYORIGUAL,@1.first_line, @1.first_column);}
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
        $$ = new Echo($2, @1.first_line, @1.first_column); 
    }
;

tipo_datos
        : INT                       {$$ = DataType.ENTERO;}
        | DOUBLE                    {$$ = DataType.DECIMAL;}
        | BOOL                      {$$ = DataType.BOOLEANO;}
        | STRING                    {$$ = DataType.STRING;}
        | CHAR                      {$$ = DataType.CHAR;}
        | VOID                     {$$ = DataType.VOID;}
;

declaracion//Declaración de variables
        : LET id_list DOS_PUNTOS tipo_datos  { //Declaración de variable mutable sin asignación
            $$ = new Declaration($4, $2, null, @1.first_line, @1.first_column); // isConst = false
        }
        | LET id_list DOS_PUNTOS tipo_datos ASIGNACION expresion  { //Declaración de variable mutable con asignación
            $$ = new Declaration($4, $2, $6, @1.first_line, @1.first_column); // isConst = false
        }
        |CONST id_list DOS_PUNTOS tipo_datos ASIGNACION expresion  { //Declaración de constante con asignación
            $$ = new ConstantDeclaration($4, $2, $6, @1.first_line, @1.first_column); // isConst = true
        }
        ;

array 
    /*Vectores en 1 dimension*/
    // Tipo 1: let <ID> : <TIPO> [ ] = new vector <TIPO> [ <EXPRESION> ]
    : LET id_list DOS_PUNTOS tipo_datos CORCHETE_IZQ CORCHETE_DER ASIGNACION NEW VECTOR tipo_datos CORCHETE_IZQ expresion CORCHETE_DER {
        $$ = new VectorDeclaration($4, $2, $12, null, @1.first_line, @1.first_column);  
    }// Tipo 2: let <ID> : <TIPO> [ ] = [ <LISTA_VALORES> ]
    | LET id_list DOS_PUNTOS tipo_datos CORCHETE_IZQ CORCHETE_DER ASIGNACION CORCHETE_IZQ content CORCHETE_DER {
        $$ = new VectorDeclaration($4, $2, null, $9, @1.first_line, @1.first_column);  // Pasamos la lista de valores en lugar del tamaño
    }
    /*Vectores en 2 dimensiones*/
    // Tipo 1: let <ID> :<TIPO> [ ] [ ]= new vector <TIPO> [ <EXPRESION> ] [ <EXPRESION> ]
    | LET id_list DOS_PUNTOS tipo_datos CORCHETE_IZQ CORCHETE_DER CORCHETE_IZQ CORCHETE_DER ASIGNACION NEW VECTOR tipo_datos CORCHETE_IZQ expresion CORCHETE_DER CORCHETE_IZQ expresion CORCHETE_DER {
        $$ = new MatrixDeclaration($4, $2, $14, $17, null, @1.first_line, @1.first_column);  // Matriz bidimensional
    }
    // Tipo 2: let <ID> : <TIPO> [ ] [ ] = [ <LISTA_VALORES2> ]
    | LET id_list DOS_PUNTOS tipo_datos CORCHETE_IZQ CORCHETE_DER CORCHETE_IZQ CORCHETE_DER ASIGNACION CORCHETE_IZQ content2 CORCHETE_DER {
        $$ = new MatrixDeclaration($4, $2, null, null, $11, @1.first_line, @1.first_column);  // Matriz bidimensional con valores
    }
;


content //Retorna una lista de expresiones
    : expresion { $$ = [$1]; }  // Inicializa $$ como un array con el primer valor
    | content COMA expresion { $1.push($3); $$ = $1; }  // Continúa agregando elementos
;


content2 // Contenido de un vector de dos dimensiones
    : content2 COMA CORCHETE_IZQ content CORCHETE_DER { 
        $1.push($4);  // Añadir una nueva lista (fila) a las filas existentes
        $$ = $1;  // Actualizar la lista total de filas
    }
    | CORCHETE_IZQ content CORCHETE_DER { 
        $$ = [$2];  // Crear una nueva lista con la primera fila
    }
;


id_list
    // Lista de identificadores o cadenas con un solo elemento (ID o CADENA)
    : ID { 
        $$ = [$1]; 
    }
    // Lista de identificadores o cadenas con más de un elemento
    | id_list COMA ID { 
        $1.push($3);
        $$ = $1; 
    }
;


asignacion 
    : ID ASIGNACION expresion { // Asignación de valor a una variable
        $$ = new Assignment($1, $3, @1.first_line, @1.first_column);
    }
    // Asignación a vector unidimensional: <ID> [ <EXPRESION> ] = <EXPRESION>
    | ID CORCHETE_IZQ expresion CORCHETE_DER ASIGNACION expresion {
        $$ = new VectorAssignment($1, $3, $6, @1.first_line, @1.first_column);  // Asignación a vector unidimensional
    }
    // Asignación a vector bidimensional: <ID> [ <EXPRESION> ] [ <EXPRESION> ] = <EXPRESION>
    | ID CORCHETE_IZQ expresion CORCHETE_DER CORCHETE_IZQ expresion CORCHETE_DER ASIGNACION expresion {
        $$ = new MatrixAssignment($1, $3, $6, $9, @1.first_line, @1.first_column);  // Asignación a matriz bidimensional
    }
;

if_statement    :  IF PARENTESIS_IZQ expresion PARENTESIS_DER statement { 
                $$ = new ifSentence($3,$5,null, @1.first_line, @1.first_column); }
                | IF PARENTESIS_IZQ expresion PARENTESIS_DER statement ELSE statement { 
                $$ = new ifSentence($3,$5,$7, @1.first_line, @1.first_column); }
                | IF PARENTESIS_IZQ expresion PARENTESIS_DER statement ELSE if_statement { 
                $$ = new ifSentence($3,$5,$7, @1.first_line, @1.first_column); }
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

while_statement
    : WHILE PARENTESIS_IZQ expresion PARENTESIS_DER statement {
        $$ = new While($3, $5, @1.first_line, @1.first_column);
    }
;

for_statement // Sentencias cíclicas for
    : FOR PARENTESIS_IZQ instruccion expresion PUNTO_Y_COMA update PARENTESIS_DER LLAVE_IZQ instrucciones LLAVE_DER {
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

statement
    : LLAVE_IZQ instrucciones LLAVE_DER {
        $$ = new Statement($2, @1.first_line, @1.first_column);
    }
    | LLAVE_IZQ LLAVE_DER {
        $$ = new Statement([], @1.first_line, @1.first_column);
    }
    ;

declaracion_funcion
    : FUNCTION tipo_datos ID PARENTESIS_IZQ parametros PARENTESIS_DER statement {
        $$ = new Funct($3, $2, $7, $5, @1.first_line, @1.first_column);
    }
    | FUNCTION tipo_datos ID PARENTESIS_IZQ PARENTESIS_DER statement {
        $$ = new Funct($3, $2, $6, [], @1.first_line, @1.first_column);
    }
    ;

parametros
    : parametros COMA parametro { 
        $1.push($3); 
        $$ = $1; 
    }
    | parametro { 
        $$ = [$1]; 
    }
    ;

parametro
    : ID DOS_PUNTOS tipo_datos IGUAL expresion {
        $$ = { id: $1, tipo: $3, defaultValue: $5 };
    }
    | ID DOS_PUNTOS tipo_datos {
        $$ = { id: $1, tipo: $3 };
    }
    ;
llamada_metodo
    
    : ID PARENTESIS_IZQ parametros_llamada PARENTESIS_DER PUNTO_Y_COMA {
        $$ = new MethodCall($1, $3, @1.first_line, @1.first_column);
    }
    | ID PARENTESIS_IZQ PARENTESIS_DER PUNTO_Y_COMA{
        $$ = new MethodCall($1, [], @1.first_line, @1.first_column); // Llamada sin parámetros
    }
    ;

parametros_llamada
    : parametros_llamada COMA parametro_llamada {
        $1.push($3);
        $$ = $1;
    }
    | parametro_llamada {
        $$ = [$1];
    }
    ;

parametro_llamada
    : ID ASIGNACION expresion {
        // Sobrescribir el valor de un parámetro por su nombre
        $$ = { id: $1, value: $3 };
    }
    ;

Execute :   EJECUTAR ID PARENTESIS_IZQ parametros_llamada PARENTESIS_DER       {
            $$=new Execute($2,$4, @1.first_line, @1.first_column);}
        |   EJECUTAR ID PARENTESIS_IZQ PARENTESIS_DER                         {
            $$=new Execute($2, [],@1.first_line, @1.first_column);}   
;