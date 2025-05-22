import React, { useState } from 'react';

const MultiScanBarcode = ({ onScanComplete, registeredBy }) => {
  const [scannedItems, setScannedItems] = useState([]);
  const [activeScan, setActiveScan] = useState(false);
  const [sharedLocation, setSharedLocation] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editBarcode, setEditBarcode] = useState('');
  const [manualBarcode, setManualBarcode] = useState('');

  const handleScan = () => {
    setActiveScan(true);
    // En producción usaríamos la API de cámara aquí
    setTimeout(() => {
      const newBarcode = '789' + Math.floor(10000000 + Math.random() * 90000000);
      setManualBarcode(newBarcode); // Agregar al campo manual
      setActiveScan(false);
    }, 1000);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (manualBarcode) {
      setScannedItems(prev => [...prev, manualBarcode]);
      setManualBarcode('');
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditBarcode(scannedItems[index]);
  };

  const handleSaveEdit = () => {
    const updatedItems = [...scannedItems];
    updatedItems[editingIndex] = editBarcode;
    setScannedItems(updatedItems);
    setEditingIndex(null);
  };

  const handleRemoveItem = (index) => {
    setScannedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!sharedLocation) {
      alert('Por favor ingresa la ubicación de bodega');
      return;
    }

    const products = scannedItems.map(barcode => ({
      barcode,
      ubicacionBodega: sharedLocation,
      registeredBy: registeredBy // Añadir el usuario que registra
    }));
    
    onScanComplete(products);
    setScannedItems([]);
    setSharedLocation('');
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ubicación de Bodega (compartida para todos)
        </label>
        <input
          type="text"
          value={sharedLocation}
          onChange={(e) => setSharedLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
          required
        />
      </div>

      <button
        onClick={handleScan}
        disabled={activeScan || !sharedLocation}
        className={`flex items-center justify-center w-full py-2 px-4 rounded-lg 
          ${activeScan ? 'bg-gray-300' : (sharedLocation ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-400')} 
          text-white transition-colors`}
      >
        {activeScan ? (
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Escaneo con Cámara o Ingreso Manual
          </>
        )}
      </button>

      <form onSubmit={handleManualAdd} className="flex space-x-2">
        <input
          type="text"
          value={manualBarcode}
          onChange={(e) => setManualBarcode(e.target.value)}
          placeholder="Ingresar código manualmente"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Agregar
        </button>
      </form>

      {scannedItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Contenedores escaneados:</h3>
          <div className="max-h-60 overflow-y-auto">
            {scannedItems.map((barcode, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                {editingIndex === index ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editBarcode}
                      onChange={(e) => setEditBarcode(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded"
                    />
                    <button 
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-800"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="font-mono">{barcode}</span>
                    <div className="space-x-2">
                      <button 
                        onClick={() => handleEdit(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Guardar {scannedItems.length} contenedor(es)
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiScanBarcode;