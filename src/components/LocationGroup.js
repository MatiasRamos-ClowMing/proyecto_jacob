import React from 'react';
import InventoryListItem from './InventoryListItem';

const LocationGroup = ({ location, items, onDelete, isMasterUser, selectedItems, onSelectItem }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4 sticky top-0 bg-gray-50 z-10 py-2 border-b border-gray-200">
        <div className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full mr-3">
          {items.length}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{location}</h2>
      </div>
      
      <div className="divide-y divide-gray-200 border-t border-gray-200">
        {items.map(item => (
          <InventoryListItem 
            key={item.id} 
            item={item} 
            onDelete={onDelete}
            isMasterUser={isMasterUser}
            isSelected={selectedItems.includes(item.id)}
            onSelectItem={onSelectItem}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationGroup;