import React, { useEffect } from 'react';
import { Simulador } from './components/Simulador';
import { SimuladorProvider } from './context/SimuladorContext';

// Componente principal de la aplicación
function App() {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = 'Simulador de Robot Cilíndrico 3D';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <SimuladorProvider>
        <Simulador />
      </SimuladorProvider>
    </div>
  );
}

export default App;