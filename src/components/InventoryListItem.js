import React from 'react';

const InventoryListItem = ({ item, onDelete, isMasterUser, isSelected, onSelectItem }) => {
  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(item.id);
    }
  };

  return (
    <div className={`flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-pink-50' : ''}`}>
      {isMasterUser && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectItem(item.id)}
          className="mr-4 h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
        />
      )}
      <div className="flex-1 grid grid-cols-3 gap-4 items-center">
        <div className="font-mono font-bold text-gray-800">{item.barcode}</div>
        <div className="text-gray-700">{item.ubicacionBodega}</div>
        <div className="text-gray-600 text-sm">{item.registeredBy || 'Desconocido'}</div>
      </div>
      <div className="text-xs text-gray-400 mr-4">{item.lastUpdated}</div>
      <button 
        onClick={handleDelete}
        className="text-sm text-red-600 hover:text-red-800"
      >
        Eliminar
      </button>
    </div>
  );
};

export default InventoryListItem;