import React from 'react';
import exportToExcel from '../utils/exportToExcel';

const ExportButton = ({ data }) => {
  const handleExport = () => {
    if (data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    
    const formattedData = data.map(item => ({
      'ID': item.id,
      'Código de Barras': item.barcode,
      'Ubicación de Bodega': item.ubicacionBodega,
      'Registrado por': item.registeredBy || 'Desconocido',
      'Fecha de Actualización': item.lastUpdated
    }));
    
    exportToExcel(formattedData, 'inventario_bodega');
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Exportar a Excel
    </button>
  );
};

export default ExportButton;