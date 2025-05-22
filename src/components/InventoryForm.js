import React, { useState } from 'react';
import MultiScanBarcode from './MultiScanBarcode';

const InventoryForm = ({ onSave, onCancel, loggedInUser }) => {
  const handleSaveProducts = (products) => {
    onSave(products);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Escaneo Múltiple de Contenedores
      </h2>
      
      <MultiScanBarcode onScanComplete={handleSaveProducts} registeredBy={loggedInUser.username} />

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default InventoryForm;