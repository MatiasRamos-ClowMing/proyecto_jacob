import React, { useState } from 'react';
import { createStorage } from '../utils/storage';

const UserManagementScreen = () => {
  const [users, setUsers] = createStorage('users', [{ username: "13337578", password: "Andre123!", role: "master" }]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('standard');
  const [error, setError] = useState('');

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      setError('Usuario y contraseña son obligatorios');
      return;
    }
    if (users.some(user => user.username === newUsername)) {
      setError('El usuario ya existe');
      return;
    }
    setUsers([...users, { username: newUsername, password: newPassword, role: newUserRole }]);
    setNewUsername('');
    setNewPassword('');
    setNewUserRole('standard');
    setError('');
  };

  const handleDeleteUser = (username) => {
    if (username === '13337578') {
      alert('No puedes eliminar al usuario maestro principal');
      return;
    }
    setUsers(users.filter(user => user.username !== username));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h2>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Usuario</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="standard">Usuario Estándar</option>
                <option value="master">Usuario Maestro</option>
                <option value="consultant">Consultor</option>
              </select>
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Agregar Usuario
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Lista de Usuarios</h3>
          <ul className="divide-y divide-gray-200">
            {users.map(user => (
              <li key={user.username} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">{user.username}</p>
                  <span className="text-sm text-gray-500">
                    {user.role === 'master' ? 'Maestro' : (user.role === 'consultant' ? 'Consultor' : 'Estándar')}
                  </span>
                </div>
                {user.username !== '13337578' && (
                  <button
                    onClick={() => handleDeleteUser(user.username)}
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

export default UserManagementScreen;