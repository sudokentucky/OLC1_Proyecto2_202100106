import { Request, Response } from 'express'; // Importando Request y Response de express
import express from 'express'; // Importando express
import cors from 'cors'; // Importando cors
import Errors from './Analizador/Error/error';
import { AST } from './Analizador/Tree/AST'; // Importando el AST

const grammar = require("../Grammar/parser.js"); // Importando la gramática (parser generado por Jison, Bison, etc.)

const app = express(); // Creando la app de express
app.use(cors()); // Usando CORS para permitir solicitudes entre dominios
app.use(express.json()); // Usando express para manejar JSON
app.use(express.text()); // Usar este middleware para recibir texto plano
const port = 3000; // Definiendo el puerto

let currentAST: AST | null = null; // Variable para almacenar el AST actual

// Ruta de prueba
app.get('/', (_req: Request, res: Response) => { 
    res.send('Hello World!'); // Respuesta simple
});

// Ruta para la interpretación
app.post('/interpretar', (req: Request, res: Response) => {
    console.log(" ======================= INICIO DE INTERPRETACION ======================= ");
    
    // Limpiar los errores antes de iniciar una nueva interpretación
    Errors.clearErrors();  // Limpiar la lista de errores global
    
    try {
        const codigoFuente = req.body; // Código fuente enviado en texto plano

        if (!codigoFuente) {
            return res.status(400).json({ mensaje: "No se proporcionó ningún código para interpretar." });
        }

        let ast: AST;
        try {
            ast = grammar.parse(codigoFuente); // Parseamos el código fuente con la gramática
            currentAST = ast; // Almacenar el AST actual
        } catch (parseError: any) {
            console.error(parseError);

            // Extraer información del error que genera el parser
            if (parseError.hash) {
                const {loc, expected, token } = parseError.hash;

                // Agregar el error de sintaxis a la lista de errores
                Errors.addError(
                    "Sintáctico",
                    `Error de sintaxis: se esperaba uno de los siguientes tokens: ${expected.join(', ')}, pero se encontró '${token}'`,
                    loc.first_line,
                    loc.first_column
                );
            } else {
                Errors.addError("Sintáctico", "Error de sintaxis desconocido.", 0, 0);
            }
            
            return res.status(400).json({ 
                errores: Errors.getErrors() // Retornamos los errores en formato JSON
            });
        }
        // Interpretamos el AST y obtenemos los mensajes de la consola y los errores
        const salidaConsola = ast.interpreter();  // Mensajes generados
        
        const erroresInterpretacion = Errors.getErrors();  // Errores acumulados

        console.log(" ======================= FIN DE INTERPRETACION ======================= ");

        return res.json({
            mensajes: salidaConsola,     // Mensajes de la consola
            errores: erroresInterpretacion // Errores detectados durante la interpretación
        });

    } catch (error) {
        console.error("Error en la interpretación:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor durante la interpretación." });
    }
});


// Ruta para obtener la tabla de símbolos
app.get('/tablaSimbolos', (_req: Request, res: Response) => {
    try {
        if (!currentAST) {
            return res.status(500).json({ mensaje: "No se ha interpretado ningún código." });
        }

        // Obtener el entorno global del AST actual
        const globalEnv = currentAST.getGlobalEnvironment();
        if (!globalEnv) {
            return res.status(500).json({ mensaje: "El entorno global no ha sido inicializado." });
        }

        // Obtener todos los símbolos del entorno global
        const tablaSimbolos = globalEnv.getSymbols();

        return res.json(tablaSimbolos);
    } catch (error) {
        console.error("Error al generar la tabla de símbolos:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor al generar la tabla de símbolos." });
    }
});

app.get('/errores', (_req: Request, res: Response) => {
    try {
        return res.json(Errors.getErrors());
    } catch (error) {
        console.error("Error al obtener la lista de errores:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor al obtener la lista de errores." });
    }
}
);

// Ruta para obtener el código DOT del AST actual
app.get('/generateDot', (_req: Request, res: Response) => {
    try {
        if (!currentAST) {
            return res.status(500).json({ mensaje: "No se ha interpretado ningún código." });
        }

        // Llamar al método generateDot para generar el código DOT del AST
        const dotCode = currentAST.generateDot();

        // Retornar el código DOT en formato texto plano
        res.setHeader('Content-Type', 'text/plain');  // Asegura que se envía como texto plano
        return res.send(dotCode); // Enviar el código DOT directamente

    } catch (error) {
        console.error("Error al generar el código DOT del AST:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor al generar el código DOT del AST." });
    }
});


// Iniciamos el servidor en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
    console.log("POST a http://localhost:3000/interpretar ");
    console.log ("GET a http://localhost:3000/tablaSimbolos ");
});
