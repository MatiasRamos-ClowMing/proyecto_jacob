import React, { useState, useEffect, useRef } from 'react';
import { createStorage, getOfflineRegistrations, clearOfflineRegistrations, getActiveSession, setActiveSession, clearActiveSession } from './utils/storage';
import InventoryItemCard from './components/InventoryItemCard';
import InventoryForm from './components/InventoryForm';
import InventorySearch from './components/InventorySearch';
import InventoryStats from './components/InventoryStats';
import ExportButton from './components/ExportButton';
import AuthLoginScreen from './components/AuthLoginScreen';
import UserManagementScreen from './components/UserManagementScreen';
import InventoryList from './components/InventoryList';
import StatsScreen from './components/StatsScreen';
import GlossaryScreen from './components/GlossaryScreen';
import InventoryComparisonScreen from './components/InventoryComparisonScreen';
import initialProducts from './mock/products'; // Asegurarse de que esta importación sea correcta

const App = () => {
  // Asegurarse de que initialProducts se use correctamente aquí
  const [products, setProducts] = createStorage('inventory', initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showForm, setShowForm] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('inventory'); // 'inventory', 'users', 'stats', 'glossary', 'comparison'
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [sessionConflict, setSessionConflict] = useState(false);

  const [users, setUsers] = createStorage('users', [{ username: "13337578", password: "Andre123!", role: "master" }]);

  // Referencia para el temporizador de inactividad
  const inactivityTimer = useRef(null);
  const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutos en milisegundos

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
  };

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
      const offlineRegistrations = getOfflineRegistrations();
      if (offlineRegistrations.length > 0) {
        setSyncing(true);
        setTimeout(() => {
          const newProducts = offlineRegistrations.map(product => ({
            ...product,
            id: Math.max(...products.map(p => p.id), 0) + 1,
            lastUpdated: new Date().toISOString().split('T')[0]
          }));
          setProducts([...products, ...newProducts]);
          clearOfflineRegistrations();
          setSyncing(false);
          alert(`Sincronizados ${offlineRegistrations.length} registros offline.`);
        }, 2000);
      }
    }
  }, [isOnline, products, syncing, setProducts]);

  // Verificar sesión activa al cargar la app
  useEffect(() => {
    const activeSessionUser = getActiveSession();
    if (activeSessionUser) {
      const user = users.find(u => u.username === activeSessionUser);
      if (user) {
        setLoggedInUser(user);
        resetInactivityTimer(); // Iniciar temporizador al cargar sesión
      } else {
        clearActiveSession();
      }
    }
  }, [users]);

  // Escuchar cambios en localStorage para detectar sesiones duplicadas
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'activeSession') {
        const activeSessionUser = event.newValue;
        if (loggedInUser && activeSessionUser && activeSessionUser !== loggedInUser.username) {
          setSessionConflict(true);
          setLoggedInUser(null);
          clearActiveSession();
          clearTimeout(inactivityTimer.current); // Limpiar temporizador en conflicto
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loggedInUser]);

  // Reiniciar temporizador en eventos de usuario
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    const handleUserActivity = () => {
      if (loggedInUser) {
        resetInactivityTimer();
      }
    };

    events.forEach(event => window.addEventListener(event, handleUserActivity));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleUserActivity));
      clearTimeout(inactivityTimer.current); // Limpiar temporizador al desmontar
    };
  }, [loggedInUser]);


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
      productsData.forEach(reg => addOfflineRegistration(reg));
      alert(`Sin conexión. Registros guardados localmente (${productsData.length}).`);
    }
    setShowForm(false);
  };

  const handleDeleteProduct = (idsToDelete) => {
    const idsArray = Array.isArray(idsToDelete) ? idsToDelete : [idsToDelete];
    setProducts(products.filter(product => !idsArray.includes(product.id)));
  };

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    setCurrentPage('inventory');
    setSessionConflict(false);
    resetInactivityTimer(); // Iniciar temporizador al iniciar sesión
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    clearActiveSession();
    setCurrentPage('inventory');
    clearTimeout(inactivityTimer.current); // Limpiar temporizador al cerrar sesión
    alert('Sesión cerrada por inactividad.');
  };

  if (sessionConflict) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Conflicto de Sesión</h2>
          <p>Tu sesión ha sido cerrada porque se ha iniciado sesión con este usuario en otro dispositivo.</p>
          <button
            onClick={() => setSessionConflict(false)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  if (!loggedInUser) {
    return <AuthLoginScreen onLogin={handleLoginSuccess} />;
  }

  const isConsultant = loggedInUser.role === 'consultant';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">ECB</h1>
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
            {loggedInUser.role === 'master' && (
              <button
                onClick={() => setCurrentPage('users')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Gestión de Usuarios
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {currentPage === 'inventory' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <InventorySearch onSearch={handleSearch} />
              <div className="flex space-x-3">
                <ExportButton data={products} />
                {!isConsultant && ( // Ocultar botón para consultores
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    + Registrar Contenedores
                  </button>
                )}
              </div>
            </div>

            <InventoryStats items={products} />

            {showForm && !isConsultant && ( // Ocultar formulario para consultores
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

        {currentPage === 'users' && loggedInUser.role === 'master' && (
          <UserManagementScreen />
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

export default App;

// DONE