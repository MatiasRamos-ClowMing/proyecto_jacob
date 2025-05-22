const exportToExcel = (data, fileName) => {
  // Crear contenido CSV
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item)
      .map(value => `"${value}"`)
      .join(',')
  ).join('\n');
  
  const csvContent = `${headers}\n${rows}`;
  
  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default exportToExcel;