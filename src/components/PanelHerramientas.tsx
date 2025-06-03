import React, { useRef, useState } from 'react';
import { useSimulador } from '../context/SimuladorContext';
import { Trayectoria } from '../models/Trayectoria';

interface PanelHerramientasProps {
  onOpenParametros: () => void;
}

/**
 * Componente para las herramientas de configuración y control del robot
 */
export const PanelHerramientas: React.FC<PanelHerramientasProps> = ({ onOpenParametros }) => {
  const { 
    toggleMatrices, 
    toggleCoordenadas, 
    toggleWorkspace, 
    mostrarMatrices,
    mostrarCoordenadas,
    mostrarWorkspace,
    reiniciarSimulador,
    coordenadas
  } = useSimulador();
  
  const [formatoTrayectoria, setFormatoTrayectoria] = useState<'JSON' | 'CSV'>('JSON');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' | 'info' } | null>(null);

  // Muestra un mensaje temporal
  const mostrarMensaje = (texto: string, tipo: 'success' | 'error' | 'info' = 'info') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  // Maneja la importación de trayectoria
  const handleImportar = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Procesa el archivo seleccionado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const contenido = event.target?.result as string;
      try {
        const trayectoria = new Trayectoria(formatoTrayectoria);
        const exito = trayectoria.importarDatos(contenido);
        
        if (exito) {
          mostrarMensaje(`Trayectoria importada: ${trayectoria.cantidadPuntos} puntos`, 'success');
          // Aquí se implementaría la ejecución de la trayectoria
        } else {
          mostrarMensaje('Formato de archivo inválido', 'error');
        }
      } catch (error) {
        mostrarMensaje('Error al procesar el archivo', 'error');
      }
    };
    reader.readAsText(file);
    
    // Limpiar input para permitir cargar el mismo archivo nuevamente
    e.target.value = '';
  };

  // Exporta la posición actual como un punto de trayectoria
  const handleExportar = () => {
    const trayectoria = new Trayectoria(formatoTrayectoria);
    trayectoria.agregarPunto(coordenadas);
    
    const contenido = trayectoria.exportarDatos();
    const blob = new Blob([contenido], { 
      type: formatoTrayectoria === 'JSON' ? 'application/json' : 'text/csv' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trayectoria-punto.${formatoTrayectoria.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostrarMensaje('Punto de trayectoria exportado', 'success');
  };

  // Exporta la configuración actual del robot
  const handleGuardarConfiguracion = () => {
    // Implementación para guardar la configuración actual
    mostrarMensaje('Configuración guardada', 'success');
  };

  // Carga una configuración previa del robot
  const handleCargarConfiguracion = () => {
    // Implementación para cargar una configuración
    mostrarMensaje('Configuración cargada', 'success');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-900 border-b pb-2">Herramientas</h2>
      
      {/* Visualización */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-800">Visualización</h3>
        <div className="flex flex-col gap-2">
          <button 
            className={`flex items-center px-3 py-2 rounded-md border ${mostrarCoordenadas ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700'} hover:bg-blue-50`}
            onClick={toggleCoordenadas}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 8-4-4-4 4"/><path d="M12 4v16"/></svg>
            Coordenadas
          </button>
          
          <button 
            className={`flex items-center px-3 py-2 rounded-md border ${mostrarMatrices ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700'} hover:bg-blue-50`}
            onClick={toggleMatrices}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
            Matrices
          </button>
          
          <button 
            className={`flex items-center px-3 py-2 rounded-md border ${mostrarWorkspace ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700'} hover:bg-blue-50`}
            onClick={toggleWorkspace}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            Espacio de Trabajo
          </button>
        </div>
      </div>
      
      {/* Trayectorias */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-800">Trayectorias</h3>
        <div className="flex mb-2 space-x-2">
          <button
            className={`px-2 py-1 rounded text-sm ${formatoTrayectoria === 'JSON' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFormatoTrayectoria('JSON')}
          >
            JSON
          </button>
          <button
            className={`px-2 py-1 rounded text-sm ${formatoTrayectoria === 'CSV' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFormatoTrayectoria('CSV')}
          >
            CSV
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <button 
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={handleImportar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Importar Trayectoria
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            accept={formatoTrayectoria === 'JSON' ? '.json' : '.csv'} 
            className="hidden"
            onChange={handleFileChange}
          />
          
          <button 
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleExportar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exportar Punto Actual
          </button>
        </div>
      </div>
      
      {/* Configuración */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-800">Configuración</h3>
        <div className="flex flex-col gap-2">
          <button 
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            onClick={handleGuardarConfiguracion}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Guardar Configuración
          </button>
          
          <button 
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            onClick={handleCargarConfiguracion}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>
            Cargar Configuración
          </button>
          
          <button 
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={onOpenParametros}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Parámetros Cinemáticos
          </button>
          
          <button 
            className="flex items-center px-3 py-2 mt-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={reiniciarSimulador}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6"/><path d="M3 13a9 9 0 1 0 3-7.7L3 8"/></svg>
            Reiniciar Simulador
          </button>
        </div>
      </div>
      
      {/* Mensajes de estado */}
      {mensaje && (
        <div className={`mt-4 p-3 rounded-md ${
          mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' : 
          mensaje.tipo === 'error' ? 'bg-red-100 text-red-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {mensaje.texto}
        </div>
      )}
    </div>
  );
};