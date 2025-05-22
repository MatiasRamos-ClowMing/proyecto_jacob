import React, { useState } from 'react';
import { createStorage } from '../utils/storage';

const BranchManagementScreen = ({ onSelectBranch, onBack }) => {
  const [branches, setBranches] = createStorage('branches', ['Principal']);
  const [newBranchName, setNewBranchName] = useState('');
  const [error, setError] = useState('');

  const handleAddBranch = (e) => {
    e.preventDefault();
    if (!newBranchName) {
      setError('El nombre de la sucursal es obligatorio');
      return;
    }
    if (branches.includes(newBranchName)) {
      setError('La sucursal ya existe');
      return;
    }
    setBranches([...branches, newBranchName]);
    setNewBranchName('');
    setError('');
  };

  const handleDeleteBranch = (branchName) => {
    if (branchName === 'Principal') {
      alert('No puedes eliminar la sucursal principal');
      return;
    }
    if (window.confirm(`¿Estás seguro de eliminar la sucursal "${branchName}" y todos sus datos?`)) {
      setBranches(branches.filter(name => name !== branchName));
      // En un caso real, aquí también se eliminarían los datos de inventario de esa sucursal
      localStorage.removeItem(`inventory_${branchName}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Sucursales</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Volver
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Agregar Nueva Sucursal</h3>
          <form onSubmit={handleAddBranch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Sucursal</label>
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Agregar Sucursal
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Lista de Sucursales</h3>
          <ul className="divide-y divide-gray-200">
            {branches.map((branch, index) => (
              <li key={index} className="py-4 flex justify-between items-center">
                <button
                  onClick={() => onSelectBranch(branch)}
                  className="text-gray-800 font-medium hover:text-pink-600"
                >
                  {branch}
                </button>
                {branch !== 'Principal' && (
                  <button
                    onClick={() => handleDeleteBranch(branch)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BranchManagementScreen;