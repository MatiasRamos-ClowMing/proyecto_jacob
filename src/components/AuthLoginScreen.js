import React, { useState } from 'react';
import { getStorage, setActiveSession, getActiveSession } from '../utils/storage';

const AuthLoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const users = getStorage('users', [{ username: "13337578", password: "Andre123!", role: "master" }]);
    const foundUser = users.find(user => user.username === username && user.password === password);
    
    if (foundUser) {
      const activeSessionUser = getActiveSession();
      if (activeSessionUser && activeSessionUser !== foundUser.username) {
        setError(`El usuario ${activeSessionUser} ya tiene una sesión activa.`);
        return;
      }
      setActiveSession(foundUser.username);
      onLogin(foundUser);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión en ECB
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthLoginScreen;