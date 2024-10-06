import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onExecuteCommand: () => void;
  onResetCommand: () => void;
  onLoadFile: (fileContent: string) => void;  // Función para cargar un archivo en el área de entrada
  inputText: string;  // El contenido actual del área de entrada para guardar
}

const Navbar: React.FC<NavbarProps> = ({ onExecuteCommand, onResetCommand, onLoadFile, inputText }) => {
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const navigate = useNavigate(); 

  // Cerrar menús cuando se hace clic fuera del navbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.getElementById('navbar');
      if (navbar && !navbar.contains(event.target as Node)) {
        setIsFileOpen(false);
        setIsToolsOpen(false);
        setIsReportsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para redirigir a la tabla de símbolos
  const handleViewSymbolTable = () => {
    setIsReportsOpen(false);
    navigate("/tabla-simbolos");
  };

  // Función para redirigir a la vista de errores
  const handleViewErrors = () => {
    setIsReportsOpen(false);
    navigate("/errores"); // Navegar a la nueva página de errores
  };

  const handleViewAST = () => {
    setIsReportsOpen(false);
    navigate("/ast"); // Navegar a la vista de AST
  };

  // Función para abrir un archivo .ci y cargar su contenido
  const handleOpenFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        onLoadFile(fileContent);  // Pasar el contenido del archivo a la función de carga
      };
      reader.readAsText(file);
    }
  };

  // Función para guardar el archivo .ci
  const handleSaveFile = () => {
    const blob = new Blob([inputText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "archivo.ci";
    link.click();
  };

  return (
    <nav id="navbar" className="bg-nosferatu text-cullen py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Hacemos clic en el nombre para redirigir a la página principal */}
        <div 
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}  // Navegar a la página principal
        >
          CompInterpreter
        </div>

        <ul className="flex space-x-6">
          {/* Archivo Dropdown */}
          <li className="relative">
            <button
              onClick={() => {
                setIsFileOpen(!isFileOpen);
                setIsToolsOpen(false);
                setIsReportsOpen(false);
              }}
              className="hover:bg-buffy px-4 py-2 rounded-md focus:outline-none"
            >
              Archivo
            </button>
            {isFileOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                <li>
                  <button
                    onClick={() => {
                      onResetCommand();  // Limpiar el área de entrada
                      setIsFileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-dracula"
                  >
                    Nuevo archivo
                  </button>
                </li>
                <li>
                  <label
                    className="block w-full text-left px-4 py-2 hover:bg-dracula cursor-pointer"
                  >
                    Abrir archivo
                    <input
                      type="file"
                      accept=".ci"
                      onChange={handleOpenFile}
                      className="hidden"
                    />
                  </label>
                </li>
                <li>
                  <button
                    onClick={handleSaveFile}  // Llama a la función para guardar el archivo
                    className="block w-full text-left px-4 py-2 hover:bg-dracula"
                  >
                    Guardar archivo
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Herramientas Dropdown */}
          <li className="relative">
            <button
              onClick={() => {
                setIsToolsOpen(!isToolsOpen);
                setIsFileOpen(false);
                setIsReportsOpen(false);
              }}
              className="hover:bg-buffy px-4 py-2 rounded-md focus:outline-none"
            >
              Herramientas
            </button>
            {isToolsOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                <li>
                  <button
                    onClick={() => {
                      onExecuteCommand();  // Ejecutar comandos
                      setIsToolsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-dracula"
                  >
                    Ejecutar
                  </button>
                </li>
              </ul>
            )}
          </li>

{/* Reportes Dropdown */}
<li className="relative">
  <button
    onClick={() => {
      setIsReportsOpen(!isReportsOpen);
      setIsFileOpen(false);
      setIsToolsOpen(false);
    }}
    className="hover:bg-buffy px-4 py-2 rounded-md focus:outline-none"
  >
    Reportes
  </button>
  {isReportsOpen && (
    <ul className="absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
      <li>
        <button
          onClick={handleViewSymbolTable}
          className="block w-full text-left px-4 py-2  hover:bg-dracula"
        >
          Ver Tabla de símbolos
        </button>
      </li>
      <li>
        <button
          onClick={handleViewErrors}
          className="block w-full text-left px-4 py-2 hover:bg-dracula"
        >
          Ver errores
        </button>
      </li>
      <li>
        <button
          onClick={handleViewAST}
          className="block w-full text-left px-4 py-2 hover:bg-dracula"
        >
          Ver AST
        </button>
      </li>
    </ul>
  )}
</li>

        </ul>
        
      </div>
    </nav>
    
  );
};

export default Navbar;
