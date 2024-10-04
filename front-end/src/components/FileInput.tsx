import React from 'react';

interface FileInputProps {
    onFileSelect: (file: File) => void; // Función que manejará el archivo seleccionado
  }
  
  const FileInput: React.FC<FileInputProps> = ({ onFileSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Tomamos el primer archivo seleccionado
    if (file) {
      onFileSelect(file); // Llamamos a la función de selección de archivo
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Selecciona un archivo</label>
      <input
        type="file"
        onChange={handleFileChange} // Disparar evento al seleccionar archivo
        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
      />
    </div>
  );
};

export default FileInput;
