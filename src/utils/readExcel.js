// Esta es una simulación. En un entorno real, necesitarías una librería como 'xlsx'.
// Dado que no podemos usar librerías externas, simulamos la lectura.
const readExcel = (file) => {
  return new Promise((resolve, reject) => {
    // Simular lectura de un archivo Excel y extracción de datos
    // Asumimos que el archivo tiene columnas 'A' (código) y 'B' (ubicación)
    // y devolvemos un array de objetos { barcode: '...', ubicacionBodega: '...' }
    
    // Simulación de datos leídos del Excel
    const mockData = [
      { barcode: '7891234567890', ubicacionBodega: 'Estante A1' },
      { barcode: '7899876543210', ubicacionBodega: 'Estante B3' },
      { barcode: '1112223334440', ubicacionBodega: 'Estante C5' },
      { barcode: '5556667778880', ubicacionBodega: 'Pasillo D2' },
      { barcode: '9990001112220', ubicacionBodega: 'Estante A1' },
      { barcode: '3334445556660', ubicacionBodega: 'Cajón F8' },
      { barcode: '7778889990000', ubicacionBodega: 'Estante G1' },
      { barcode: '2223334445550', ubicacionBodega: 'Pasillo H9' },
      { barcode: '6667778889990', ubicacionBodega: 'Estante I3' },
      { barcode: '1231231231230', ubicacionBodega: 'Cajón J7' },
    ];

    // Simular un pequeño retraso para la "lectura"
    setTimeout(() => {
      console.log(`Simulando lectura de archivo: ${file.name}`);
      resolve(mockData);
    }, 1500);
  });
};

export default readExcel;