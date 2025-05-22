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
    <div>
      {isMasterUser && products.length > 0 && (
        <div className="mb-4 flex items-center space-x-4">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {selectedItems.length === products.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedItems.length === 0 ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'} text-white`}
          >
            Eliminar Seleccionados ({selectedItems.length})
          </button>
        </div>
      )}

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
        ))
      }
    </div>
  );
};

export default InventoryList;