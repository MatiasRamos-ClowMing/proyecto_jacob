import React from 'react';

export const getStorage = (key, defaultValue = []) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return defaultValue;
  }
};

export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error writing to localStorage", error);
  }
};

export const createStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    return getStorage(key, initialValue);
  });

  const setValue = (value) => {
    setStoredValue(value);
    setStorage(key, value);
  };

  return [storedValue, setValue];
};

export const getOfflineRegistrations = () => {
  return getStorage('offlineRegistrations', []);
};

export const addOfflineRegistration = (registration) => {
  const offlineRegistrations = getOfflineRegistrations();
  setStorage('offlineRegistrations', [...offlineRegistrations, registration]);
};

export const clearOfflineRegistrations = () => {
  setStorage('offlineRegistrations', []);
};

export const getActiveSession = () => {
  return getStorage('activeSession', null);
};

export const setActiveSession = (username) => {
  setStorage('activeSession', username);
};

export const clearActiveSession = () => {
  localStorage.removeItem('activeSession');
};