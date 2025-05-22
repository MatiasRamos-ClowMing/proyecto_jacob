import React from 'react';

const InventoryItemCard = ({ item, onDelete, isMasterUser }) => {
  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(item.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
          <h3 className="text-lg sm:text-xl font-mono font-bold text-gray-800">{item.barcode}</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Ubicación de Bodega</p>
            <p className="font-medium">{item.ubicacionBodega}</p>
          </div>
          {item.registeredBy && (
            <div>
              <p className="text-sm text-gray-500">Registrado por</p>
              <p className="font-medium">{item.registeredBy}</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <span className="text-xs text-gray-400">Actualizado: {item.lastUpdated}</span>
          {isMasterUser && (
            <div className="mt-2 sm:mt-0">
              <button 
                onClick={handleDelete}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryItemCard;