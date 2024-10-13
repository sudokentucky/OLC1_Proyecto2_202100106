import { useRef, useState, useEffect } from "react";
import useLineCounter from "../hooks/useLineCounter";
import Message from "../interface/Message";

// Definir el tipo de las props que recibe CommandExecution
interface CommandExecutionProps {
  inputText: string;
  setInputText: (text: string) => void;
  outputText: string;
  loading: boolean;
  message: string;
  messageType: "success" | "error" | "info" | "";
}

function CommandExecution({
  inputText,
  setInputText,
  outputText,
  loading,
  message,
  messageType
}: CommandExecutionProps) {
  const { lineCount: inputLineCount } = useLineCounter(inputText);
  const { lineCount: outputLineCount } = useLineCounter(outputText);

  const inputTextareaRef = useRef<HTMLTextAreaElement>(null);
  const inputLineCounterRef = useRef<HTMLDivElement>(null);

  const outputTextareaRef = useRef<HTMLTextAreaElement>(null);
  const outputLineCounterRef = useRef<HTMLDivElement>(null);

  const [outputMessageType, setOutputMessageType] = useState<"success" | "error" | "info" | "">("");

  const syncInputScroll = () => {
    if (inputTextareaRef.current && inputLineCounterRef.current) {
      inputLineCounterRef.current.scrollTop = inputTextareaRef.current.scrollTop;
    }
  };

  const syncOutputScroll = () => {
    if (outputTextareaRef.current && outputLineCounterRef.current) {
      outputLineCounterRef.current.scrollTop = outputTextareaRef.current.scrollTop;
    }
  };

  // Sincronizar la altura de ambos textareas
  useEffect(() => {
    if (inputTextareaRef.current && outputTextareaRef.current) {
      const inputHeight = inputTextareaRef.current.scrollHeight;
      const outputHeight = outputTextareaRef.current.scrollHeight;
      const maxHeight = Math.max(inputHeight, outputHeight);

      inputTextareaRef.current.style.height = `${maxHeight}px`;
      outputTextareaRef.current.style.height = `${maxHeight}px`;

      // Asegurarse de que los contadores de líneas también se sincronicen en altura
      if (inputLineCounterRef.current && outputLineCounterRef.current) {
        inputLineCounterRef.current.style.height = `${maxHeight}px`;
        outputLineCounterRef.current.style.height = `${maxHeight}px`;
      }
    }
  }, [inputText, outputText]);

  useEffect(() => {
    if (messageType === "error" || messageType === "success" || messageType === "info") {
      setOutputMessageType(messageType);
    }
  }, [messageType]);

  const outputTextColorClass =
    outputMessageType === "error" ? "text-red-600" : outputMessageType === "success" ? "text-nosferatu-900" : "text-black";

  return (
    <div className="flex flex-col min-h-screen h-screen w-full bg-aro-100">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl p-8 rounded-lg shadow-lg bg-nosferatu-700">
          <h1 className="text-3xl font-bold mb-6 text-center text-lincoln-50">
            Ejecución de Comandos
          </h1>

          {/* Contenedor para ambas áreas de texto */}
          <div className="flex space-x-4 mb-4">
            {/* Input Text Area */}
            <div className="flex-1 relative">
              <label className="block text-base font-medium text-lincoln-50 mb-2" htmlFor="input-text">
                Entrada de comando o archivo de texto
              </label>
              <div className="flex">
                <div
                  ref={inputLineCounterRef}
                  className="line-numbers text-nosferatu bg-buffy-100 p-2 rounded-l-md text-sm text-right overflow-hidden"
                  style={{ height: 'auto', minHeight: '200px' }}
                >
                  {Array.from({ length: inputLineCount }, (_, i) => i + 1).map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
                <textarea
                  id="input-text"
                  ref={inputTextareaRef}
                  className="w-full p-3 text-nosferatu-800 border rounded-r-md shadow-sm focus:outline-none focus:ring-2 text-sm overflow-y-auto resize-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onScroll={syncInputScroll}
                  placeholder="Ingrese comandos aquí..."
                  disabled={loading}
                  style={{
                    minHeight: '200px',
                    fontSize: '13px',
                    whiteSpace: 'pre',
                  }}
                />
              </div>
            </div>

            {/* Output Text Area */}
            <div className="flex-1 relative">
              <label className="block text-base font-medium text-lincoln-50 mb-2" htmlFor="output-text">
                Resultado de la ejecución
              </label>
              <div className="flex">
                <div
                  ref={outputLineCounterRef}
                  className="line-numbers text-nosferatu bg-buffy-100 p-2 rounded-l-md text-sm text-right overflow-hidden"
                  style={{ height: 'auto', minHeight: '200px' }}
                >
                  {Array.from({ length: outputLineCount }, (_, i) => i + 1).map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
                <textarea
                  id="output-text"
                  ref={outputTextareaRef}
                  className={`w-full p-3 border rounded-r-md shadow-sm focus:outline-none focus:ring-2 text-sm ${outputTextColorClass} resize-none`}
                  value={outputText}
                  readOnly
                  onScroll={syncOutputScroll}
                  placeholder="Resultado de la ejecución aparecerá aquí..."
                  style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: '13px',
                    minHeight: '200px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mostrar el componente Message cuando haya mensaje */}
          <Message text={message} type={messageType} />

          {loading && (
            <div className="mt-4 flex justify-center items-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 mb-4"></div>
              <span className="text-blue-500 ml-2">Procesando...</span>
            </div>
          )}
        </div>
      </div>

      <footer className="py-4 text-center text-sm text-gray-500 w-full">
        © {new Date().getFullYear()} Keneth Lopez. 
        Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default CommandExecution;
