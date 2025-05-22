import React, { useState, useEffect } from 'react';
import { createStorage, getOfflineRegistrations, clearOfflineRegistrations } from '../utils/storage';
import InventoryItemCard from './InventoryItemCard';
import InventoryForm from './InventoryForm';
import InventorySearch from './InventorySearch';
import InventoryStats from './InventoryStats';
import ExportButton from './ExportButton';
import InventoryList from './InventoryList';
import StatsScreen from './StatsScreen';
import GlossaryScreen from './GlossaryScreen';
import InventoryComparisonScreen from './InventoryComparisonScreen';
import initialProducts from '../mock/products';

const BranchInventoryScreen = ({ branchName, loggedInUser, onBack }) => {
  const storageKey = `inventory_${branchName}`;
  const [products, setProducts] = createStorage(storageKey, initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState('inventory'); // 'inventory', 'stats', 'glossary', 'comparison'
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Detectar cambios de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sincronizar registros offline cuando la conexión regresa
  useEffect(() => {
    if (isOnline && !syncing) {
      const offlineRegistrations = getOfflineRegistrations(); // Nota: Esto sincroniza todos los offline, no solo los de esta sucursal
      if (offlineRegistrations.length > 0) {
        setSyncing(true);
        // Simular envío de datos al servidor (en un caso real, aquí iría la lógica de API)
        // Esta lógica de sincronización debería ser más sofisticada para manejar múltiples sucursales
        // Por ahora, solo sincroniza al inventario principal o al último seleccionado si no hay uno principal
        const targetStorageKey = storageKey; // Usar la clave de almacenamiento de la sucursal actual
        const [currentProducts, setCurrentProducts] = createStorage(targetStorageKey, []);

        setTimeout(() => {
          const newProducts = offlineRegistrations.map(product => ({
            ...product,
            id: Math.max(...currentProducts.map(p => p.id), 0) + 1,
            lastUpdated: new Date().toISOString().split('T')[0]
          }));
          setCurrentProducts([...currentProducts, ...newProducts]);
          clearOfflineRegistrations();
          setSyncing(false);
          alert(`Sincronizados ${offlineRegistrations.length} registros offline para ${branchName}.`);
        }, 2000); // Simular tiempo de sincronización
      }
    }
  }, [isOnline, products, syncing, setProducts, branchName, storageKey]); // Añadir storageKey como dependencia

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter(product =>
      product.barcode.includes(searchTerm) ||
      product.ubicacionBodega.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.registeredBy && product.registeredBy.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  };

  const handleSaveProducts = (productsData) => {
    if (isOnline) {
      const newProducts = productsData.map(product => ({
        ...product,
        id: Math.max(...products.map(p => p.id), 0) + 1,
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
      setProducts([...products, ...newProducts]);
    } else {
      productsData.forEach(reg => addOfflineRegistration(reg)); // Nota: Esto guarda en un solo offline storage
      alert(`Sin conexión. Registros guardados localmente (${productsData.length}) para ${branchName}.`);
    }
    setShowForm(false);
  };

  const handleDeleteProduct = (idsToDelete) => {
    const idsArray = Array.isArray(idsToDelete) ? idsToDelete : [idsToDelete];
    setProducts(products.filter(product => !idsArray.includes(product.id)));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">ECB - {branchName}</h1>
            <p className="text-gray-600">Entrega de Contenedores por Bodega</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-700">
              Usuario: {loggedInUser.username}
            </span>
            <span className={`text-sm font-semibold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {syncing && (
               <span className="text-sm font-semibold text-blue-600 animate-pulse">Sincronizando...</span>
            )}
            <button
              onClick={() => setCurrentPage('glossary')}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Glosario
            </button>
            <button
              onClick={() => setCurrentPage('stats')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Estadísticas
            </button>
             <button
              onClick={() => setCurrentPage('comparison')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Comparativa
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Volver a Sucursales
            </button>
          </div>
        </header>

        {currentPage === 'inventory' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <InventorySearch onSearch={handleSearch} />
              <div className="flex space-x-3">
                <ExportButton data={products} />
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  + Registrar Contenedores
                </button>
              </div>
            </div>

            <InventoryStats items={products} />

            {showForm && (
              <div className="mb-8">
                <InventoryForm
                  onSave={handleSaveProducts}
                  onCancel={() => setShowForm(false)}
                  loggedInUser={loggedInUser}
                />
              </div>
            )}

            <InventoryList 
              products={filteredProducts} 
              onDelete={handleDeleteProduct} 
              isMasterUser={loggedInUser.role === 'master'} 
            />
          </>
        )}

        {currentPage === 'stats' && (
          <StatsScreen products={products} onBack={() => setCurrentPage('inventory')} />
        )}

        {currentPage === 'glossary' && (
          <GlossaryScreen onBack={() => setCurrentPage('inventory')} />
        )}

        {currentPage === 'comparison' && (
          <InventoryComparisonScreen 
            registeredContainers={products} 
            onBack={() => setCurrentPage('inventory')} 
            isMasterUser={loggedInUser.role === 'master'}
          />
        )}
      </div>
    </div>
  );
};

export default BranchInventoryScreen;