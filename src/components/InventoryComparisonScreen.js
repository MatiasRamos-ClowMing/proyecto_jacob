import React, { useState, useEffect } from 'react';
import readExcel from '../utils/readExcel';
import { createStorage } from '../utils/storage';

const InventoryComparisonScreen = ({ registeredContainers, onBack, isMasterUser }) => {
  const [expectedContainers, setExpectedContainers] = createStorage('expectedContainers', []);
  const [missingContainers, setMissingContainers] = useState([]);
  const [extraContainers, setExtraContainers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expectedContainers.length > 0) {
      const registeredMap = new Map(registeredContainers.map(c => [c.barcode, c.ubicacionBodega]));
      const expectedMap = new Map(expectedContainers.map(c => [c.barcode, c.ubicacionBodega]));

      const missing = expectedContainers.filter(container => !registeredMap.has(container.barcode));
      const extra = registeredContainers.filter(container => !expectedMap.has(container.barcode));

      setMissingContainers(missing);
      setExtraContainers(extra);
    } else {
      setMissingContainers([]);
      setExtraContainers([]);
    }
  }, [registeredContainers, expectedContainers]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const data = await readExcel(file);
        setExpectedContainers(data);
      } catch (error) {
        console.error("Error reading Excel file:", error);
        alert("Error al leer el archivo Excel.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearExpected = () => {
    if (window.confirm('¿Estás seguro de eliminar la lista de contenedores esperados?')) {
      setExpectedContainers([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Comparativa de Inventario</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Volver
          </button>
        </div>
        
        {isMasterUser && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Cargar Archivo de Contenedores Esperados</h3>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="w-full text-gray-700"
            />
            {loading && <p className="text-blue-600 mt-2">Cargando archivo...</p>}
            {expectedContainers.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <p className="text-green-600">Archivo cargado con {expectedContainers.length} contenedores esperados.</p>
                <button
                  onClick={handleClearExpected}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar Lista
                </button>
              </div>
            )}
          </div>
        )}

        {expectedContainers.length > 0 ? (
          <>
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Contenedores Faltantes ({missingContainers.length})</h3>
              {missingContainers.length === 0 ? (
                <p className="text-green-600">¡Todos los contenedores esperados están registrados!</p>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Número de Contenedor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sección Esperada
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {missingContainers.map((container, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            {container.barcode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {container.ubicacionBodega || 'No especificada'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Contenedores Registrados ({registeredContainers.length})</h3>
              <ul className="list-disc list-inside space-y-2 max-h-60 overflow-y-auto">
                {registeredContainers.map((container, index) => {
                  const expected = expectedContainers.find(exp => exp.barcode === container.barcode);
                  const isExpected = !!expected;
                  const locationMatch = isExpected && expected.ubicacionBodega === container.ubicacionBodega;

                  return (
                    <li 
                      key={index} 
                      className={`font-mono ${isExpected ? (locationMatch ? 'text-green-600' : 'text-orange-600') : 'text-gray-700'}`}
                    >
                      {container.barcode} - Ubicación registrada: {container.ubicacionBodega}
                      {isExpected && !locationMatch && <span className="ml-2 text-sm">(Ubicación esperada: {expected.ubicacionBodega || 'No especificada'})</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500">
            Carga un archivo de contenedores esperados para ver la comparativa.
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryComparisonScreen;