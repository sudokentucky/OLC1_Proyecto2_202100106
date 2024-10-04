import { useState, useCallback } from "react";

function useCommandExecution() {
  const [inputText, setInputText] = useState(""); // Código fuente a interpretar
  const [outputText, setOutputText] = useState(""); // Mensajes de salida del backend
  const [loading, setLoading] = useState(false); // Estado de carga
  const [message, setMessage] = useState(""); // Manejo de mensajes
  const [messageType, setMessageType] = useState<"success" | "error" | "info" | "">(""); // Tipo de mensaje

  // Función para mostrar mensajes
  const showMessage = useCallback((text: string, type: "success" | "error" | "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000); // El mensaje desaparece después de 5 segundos
  }, []);

  // Función para ejecutar el código fuente enviándolo al backend
  const handleExecute = useCallback(async () => {
    if (!inputText.trim()) {
      showMessage("El área de texto está vacía. Por favor, ingrese un comando o cargue un archivo.", "error");
      return;
    }

    setLoading(true);
    try {
      // Enviar el código fuente al backend usando el endpoint `/interpretar`
      const response = await fetch("http://localhost:3000/interpretar", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain", // Especificamos que el contenido es texto plano
        },
        body: inputText, // Enviamos el código fuente como texto
      });

      const data = await response.json();

      // Manejar los códigos HTTP que no sean 200 pero que tengan una respuesta válida
      if (!response.ok) {
        const { errores } = data;
        const errorMessages = errores.map((err: any) => `Tipo: ${err.type} ${err.description} En: Linea: ${err.file} Columna: ${err.column}`).join("\n");
        const fullOutput = `${errorMessages}`;
        setOutputText(fullOutput); // Actualizamos el texto de salida con los errores
        showMessage("Se encontraron errores en la ejecución.", "error");
        return;
      }

      // Si la respuesta es correcta y no hay errores
      const { mensajes } = data;
      setOutputText(mensajes.join("\n")); // Mostrar los mensajes de la consola
      showMessage("Ejecución completada con éxito", "success");

    } catch (error) {
      // En caso de error de red u otro tipo de error
      if (error instanceof Error) {
        setOutputText(`Error: ${error.message}`);
        showMessage(`Error en la ejecución: ${error.message}`, "error");
      } else {
        setOutputText("Error desconocido");
        showMessage("Error en la ejecución: Error desconocido", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [inputText, showMessage]);

  // Función para resetear los campos
  const handleReset = useCallback(() => {
    setInputText("");
    setOutputText("");
    showMessage("Campos limpiados correctamente", "info");
  }, [showMessage]);

  return {
    inputText,
    setInputText,
    outputText,
    loading,
    message,        // Retorna el mensaje actual
    messageType,    // Retorna el tipo de mensaje actual
    handleExecute,
    handleReset
  };
}

export default useCommandExecution;
