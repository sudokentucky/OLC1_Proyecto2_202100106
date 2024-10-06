import React, { useRef } from "react";
import { Graphviz } from "graphviz-react";
import { useDotCode } from "../hooks/useGenerateDot";
import { saveAs } from "file-saver"; // Librería para guardar archivos

const DotGraph: React.FC = () => {
  const { dotCode, loading, errorMessage } = useDotCode(); // Usa el hook para obtener el código DOT
  const graphRef = useRef<HTMLDivElement | null>(null); // Referencia para el contenedor del gráfico

  // Función para descargar el gráfico en formato PNG
  const handleDownloadPNG = () => {
    if (graphRef.current) {
      const graphContainer = graphRef.current.querySelector("svg");
      if (graphContainer) {
        const svgString = new XMLSerializer().serializeToString(graphContainer);
        const canvas = document.createElement("canvas");
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
        img.onload = function () {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, "graph.png"); // Guardar como PNG
            }
          });
        };
      }
    }
  };

  if (loading) {
    return <p>Cargando gráfico...</p>;
  }

  if (errorMessage) {
    return <p>Error: {errorMessage}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="graph-container mb-4" ref={graphRef}>
        {/* Renderiza el código DOT utilizando el componente Graphviz */}
        {dotCode ? (
          <Graphviz
            dot={dotCode}
            options={{
              height: 600,  // Ajusta la altura
              width: 800,   // Ajusta el ancho
              fit: true,    // Ajusta al tamaño del contenedor
              zoom: true,   // Habilita el zoom
            }}
          />
        ) : (
          <p>No hay código DOT disponible.</p>
        )}
      </div>
      <button
        onClick={handleDownloadPNG}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Descargar como PNG
      </button>
    </div>
  );
};

export default DotGraph;
