import React, { useState, useEffect } from 'react';

const BarcodeScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState('');

  const handleScanClick = () => {
    setScanning(true);
    // En un entorno real, aquí se integraría con una librería de escaneo
    // Para este ejemplo simularemos el escaneo después de 2 segundos
    setTimeout(() => {
      const mockBarcode = '789' + Math.floor(10000000 + Math.random() * 90000000);
      setBarcode(mockBarcode);
      onScan(mockBarcode);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleScanClick}
        disabled={scanning}
        className={`flex items-center justify-center w-full py-2 px-4 rounded-lg ${scanning ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
      >
        {scanning ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Escaneando...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Escanear Código de Barras
          </>
        )}
      </button>
      
      {barcode && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">Código escaneado: <span className="font-mono font-bold">{barcode}</span></p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;