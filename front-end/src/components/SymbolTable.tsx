import useSymbolTable from "../hooks/useSymbolTable";

const SymbolTable: React.FC = () => {
  const { symbols, loading, error } = useSymbolTable();

  // Si está cargando, mostramos un mensaje de carga
  if (loading) {
    return <p className="text-buffy text-center">Cargando la tabla de símbolos...</p>;
  }

  // Si hubo un error, mostramos un mensaje de error
  if (error) {
    return <p className="text-marcelin-400 text-center">Error: {error}</p>;
  }

  return (
    <div className="bg-aro-100 min-h-screen p-4 flex flex-col justify-center items-center"> {/* Fondo aro-600 */}
      {/* Título separado de la tabla */}
      <h2 className="text-3xl font-bold mb-6 text-buffy-500 text-center">Tabla de Símbolos</h2>

      {/* Contenedor de la tabla */}
      <div className="overflow-x-auto w-full max-w-5xl bg-light-50 border-neutral-950 rounded-lg shadow-lg"> {/* Fondo blanco para la tabla */}
        <table className="min-w-full table-auto border-collapse border border-nosferatu mx-auto">
          <thead className="bg-vonCount-500 text-light-50">
            <tr>
              <th className="border border-nosferatu px-6 py-3 text-center font-semibold">ID</th>
              <th className="border border-nosferatu px-6 py-3 text-center font-semibold">Tipo</th>
              <th className="border border-nosferatu px-6 py-3 text-center font-semibold">Valor</th>
              <th className="border border-nosferatu px-6 py-3 text-center font-semibold">Entorno</th>
              <th className="border border-nosferatu px-6 py-3 text-center font-semibold">Línea</th>
              <th className="border border-nosferatu px-6 py-3 text-center font-semibold">Columna</th>
            </tr>
          </thead>
          <tbody>
            {symbols.length > 0 ? (
              symbols.map((symbol, index) => (
                <tr
                  key={index}
                  className="hover:bg-dracula-700 hover:text-light transition-all duration-300 ease-in-out"
                >
                  <td className="border border-nosferatu px-4 py-2 text-center">{symbol.ID}</td>
                  <td className="border border-nosferatu px-4 py-2 text-center">{symbol.Tipo}</td>
                  <td className="border border-nosferatu px-4 py-2 text-center">{symbol.Valor}</td>
                  <td className="border border-nosferatu px-4 py-2 text-center">{symbol.Entorno}</td>
                  <td className="border border-nosferatu px-4 py-2 text-center">{symbol.Línea}</td>
                  <td className="border border-nosferatu px-4 py-2 text-center">{symbol.Columna}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 bg-nosferatu-50 text-buffy-800"
                >
                  Aun no hay simbolos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SymbolTable;
