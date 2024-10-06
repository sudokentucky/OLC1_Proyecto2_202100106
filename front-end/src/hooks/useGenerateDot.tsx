import { useState, useEffect } from "react";

export const useDotCode = () => {
  const [dotCode, setDotCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDotCode = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/generateDot"); // Llamada al backend
        if (!response.ok) {
          throw new Error("Error al obtener el código DOT.");
        }
        const data = await response.text(); // Recibe el código DOT
        console.log("Respuesta del servidor:");
        console.log(data); // Verificar qué devuelve el servidor
        setDotCode(data);  // Establecer el código DOT
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message); // Captura errores
        } else {
          setErrorMessage("Error desconocido.");
        }
      } finally {
        setLoading(false); // Indica que terminó de cargar
      }
    };
  
    fetchDotCode(); // Ejecutar una vez al montar el componente
  }, []);
  
  return { dotCode, loading, errorMessage };
};
