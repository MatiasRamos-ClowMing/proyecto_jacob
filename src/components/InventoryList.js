import React, { useState } from 'react';
import LocationGroup from './LocationGroup';

const InventoryList = ({ products, onDelete, isMasterUser }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const groupByLocation = (items) => {
    return items.reduce((groups, item) => {
      const location = item.ubicacionBodega;
      if (!groups[location]) {
        groups[location] = [];
      }
      groups[location].push(item);
      return groups;
    }, {});
  };

  const groupedProducts = groupByLocation(products);

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === products.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(products.map(p => p.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      alert('Selecciona al menos un contenedor para eliminar.');
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar ${selectedItems.length} contenedor(es) seleccionado(s)?`)) {
      onDelete(selectedItems);
      setSelectedItems([]);
    }
  };

  return (
    <div className="space-y-4">
      {isMasterUser && products.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start gap-2">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {selectedItems.length === products.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              disabled={selectedItems.length === 0}
            >
              Eliminar seleccionados
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} seleccionado(s)
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedProducts)
          .sort(([locA], [locB]) => locA.localeCompare(locB))
          .map(([location, items]) => (
            <LocationGroup
              key={location}
              location={location}
              items={items}
              onDelete={onDelete} // Mantener eliminación individual
              isMasterUser={isMasterUser}
              selectedItems={selectedItems}
              onSelectItem={handleSelectItem}
            />
          ))}
      </div>
    </div>
  );
};

export default InventoryList;