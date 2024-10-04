import React from 'react';

//interface MessageProps {

interface MessageProps {
    text: string; // Se añade un texto
    type: "success" | "error" | "warning"| "info"|""; // Se añade un tipo de mensaje
}

const Message: React.FC<MessageProps> = ({ text, type }) => { // Se añade un tipo de mensaje
    if (!text) return null; // Si no hay texto, no se muestra el mensaje
    //Si el mensaje es de tipo success, se muestra un mensaje de color verde
    const messageClass = type === "success" // Se añade un tipo de mensaje
      ? "bg-blade-100 text-blade-800"
      : type === "error"
      ? "bg-marcelin-100 text-marcelin-500"
      : "bg-blue-100 text-blue-700";
  
    return (
      <div className={`mt-4 p-2 text-center rounded-md ${messageClass} transition-opacity duration-500 ease-in-out`}> 
        {text}
      </div>
    );
  };
  
  export default Message;
  