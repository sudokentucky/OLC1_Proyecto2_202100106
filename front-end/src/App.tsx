import Navbar from "./components/Navbar";
import CommandExecution from "./components/CommandExecution";
import SymbolTable from "./components/SymbolTable"; // Importa el nuevo componente para la tabla de símbolos
import ErrorTable from "./components/ErrorTable"; // Importa el componente para los errores
import useCommandExecution from "./hooks/useCommandExecution"; // Hook que gestiona la ejecución de comandos
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importa Router
import DotGraph from "./components/AST"; // Importa el componente para el gráfico AST

function App() {
  // Centralizamos el hook para gestionar la ejecución y reset
  const {
    inputText,
    setInputText,
    outputText,
    loading,
    handleExecute,
    handleReset,
    message,
    messageType
  } = useCommandExecution();


  // Función para cargar el archivo en el área de texto
  const handleLoadFile = (content: string) => {
    setInputText(content);
  };

  return (
    <Router>
      <div>
        {/* Pasamos las funciones al Navbar para ejecutar, resetear y cargar archivos */}
        <Navbar
          onExecuteCommand={handleExecute}
          onResetCommand={handleReset}
          onLoadFile={handleLoadFile} // Pasamos la función para cargar archivo
          inputText={inputText} // Pasamos el texto actual para la funcionalidad de guardar
        />

        <Routes>
          {/* Ruta principal donde se ejecuta el código */}
          <Route
            path="/"
            element={
              <CommandExecution
                inputText={inputText}
                setInputText={setInputText}
                outputText={outputText}
                loading={loading}
                message={message}
                messageType={messageType}
              />
            }
          />

          {/* Ruta para ver la tabla de símbolos */}
          <Route path="/tabla-simbolos" element={<SymbolTable />} />

          {/* Ruta para ver los errores */}
          <Route path="/errores" element={<ErrorTable />} />
          <Route path="/ast" element={<DotGraph />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
