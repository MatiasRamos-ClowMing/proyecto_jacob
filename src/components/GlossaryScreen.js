import React, { useState, useEffect } from 'react';
import sections from '../mock/sections';

const GlossaryScreen = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSections, setFilteredSections] = useState(sections);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredSections(sections);
      return;
    }
    const filtered = sections.filter(section =>
      section.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSections(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Glosario de Secciones</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Volver
          </button>
        </div>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por número o nombre de sección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Sección
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre de Sección
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSections.map((section, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {section.number}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                    {section.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSections.length === 0 && (
            <div className="text-center py-4 text-gray-500">No se encontraron secciones.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlossaryScreen;