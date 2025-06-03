import React, { useState } from 'react';
import { useSimulador } from '../context/SimuladorContext';
import { PanelArticulaciones } from './PanelArticulaciones';
import { PanelHerramientas } from './PanelHerramientas';
import { VisualizadorRobot } from './VisualizadorRobot';
import { PanelInformacion } from './PanelInformacion';
import { ModalAyuda } from './ModalAyuda';
import { ModalParametros } from './ModalParametros';

/**
 * Componente principal del simulador que organiza la interfaz
 */
export const Simulador: React.FC = () => {
  const { mostrarMatrices, mostrarCoordenadas, mostrarWorkspace } = useSimulador();
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [mostrarModalParametros, setMostrarModalParametros] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Barra superior */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Simulador de Robot Cilíndrico</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setMostrarAyuda(true)}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded-md flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              Ayuda
            </button>
          </div>
        </div>
      </header>
      
      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel izquierdo: Articulaciones */}
        <div className="w-1/4 bg-white shadow-md overflow-y-auto p-4">
          <PanelArticulaciones />
        </div>
        
        {/* Panel central: Visualización 3D */}
        <div className="w-2/4 bg-gray-100 relative">
          <VisualizadorRobot />
        </div>
        
        {/* Panel derecho: Herramientas */}
        <div className="w-1/4 bg-white shadow-md overflow-y-auto p-4">
          <PanelHerramientas onOpenParametros={() => setMostrarModalParametros(true)} />
          
          {/* Panel de información (condicional) */}
          {(mostrarMatrices || mostrarCoordenadas || mostrarWorkspace) && (
            <div className="mt-6">
              <PanelInformacion />
            </div>
          )}
        </div>
      </div>
      
      {/* Modales */}
      {mostrarAyuda && <ModalAyuda onClose={() => setMostrarAyuda(false)} />}
      {mostrarModalParametros && <ModalParametros onClose={() => setMostrarModalParametros(false)} />}
    </div>
  );
};