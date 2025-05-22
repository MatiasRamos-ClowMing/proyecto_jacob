import React from 'react';

const InventoryStats = ({ items }) => {
  const totalItems = items.length;
  const totalLocations = [...new Set(items.map(item => item.ubicacionBodega))].length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">Contenedores Totales</h3>
        <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">Ubicaciones</h3>
        <p className="text-2xl font-bold text-gray-800">{totalLocations}</p>
      </div>
    </div>
  );
};

export default InventoryStats;