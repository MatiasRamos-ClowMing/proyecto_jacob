import React, { useEffect, useRef } from 'react';

const UserStatsChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const chartWidth = canvas.width - 40; // Padding horizontal
    const chartHeight = canvas.height - 40; // Padding vertical
    const barWidth = chartWidth / data.length - 10; // Ancho de barra con espacio
    const maxCount = Math.max(...data.map(item => item.count));
    const scaleY = chartHeight / maxCount;

    // Dibujar barras
    data.forEach((item, index) => {
      const barHeight = item.count * scaleY;
      const x = 20 + index * (barWidth + 10);
      const y = canvas.height - 20 - barHeight;

      ctx.fillStyle = '#EC4899'; // Color rosa de Tailwind
      ctx.fillRect(x, y, barWidth, barHeight);

      // Dibujar texto (usuario y conteo)
      ctx.fillStyle = '#1F2937'; // Color gris oscuro de Tailwind
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.user, x + barWidth / 2, canvas.height - 5);
      ctx.fillText(item.count, x + barWidth / 2, y - 5);
    });
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Contenedores Registrados por Usuario</h3>
      <canvas ref={chartRef} width="600" height="300"></canvas>
    </div>
  );
};

const StatsScreen = ({ products, onBack }) => {
  const getUserStats = (items) => {
    const stats = items.reduce((acc, item) => {
      const user = item.registeredBy || 'Desconocido';
      acc[user] = (acc[user] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(stats).map(([user, count]) => ({
      user,
      count
    }));
  };

  const userStatsData = getUserStats(products);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Estadísticas de Registro</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Volver
          </button>
        </div>
        
        <UserStatsChart data={userStatsData} />
      </div>
    </div>
  );
};

export default StatsScreen;