import React from 'react';
import { useSimulador } from '../context/SimuladorContext';
import { Slider } from './ui/Slider';

/**
 * Componente para controlar las articulaciones del robot mediante sliders
 */
export const PanelArticulaciones: React.FC = () => {
  const { articulaciones, actualizarArticulacion } = useSimulador();

  // Función para obtener la etiqueta adecuada según el tipo de articulación
  const obtenerEtiqueta = (id: number, tipo: string) => {
    switch (id) {
      case 0:
        return 'Rotación Base (θ)';
      case 1:
        return 'Elevación (z)';
      case 2:
        return 'Extensión (r)';
      default:
        return tipo === 'rotacional' ? 'Articulación Rotacional' : 'Articulación Lineal';
    }
  };

  // Función para obtener la unidad adecuada según el tipo de articulación
  const obtenerUnidad = (tipo: string) => {
    return tipo === 'rotacional' ? '°' : ' m';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-900 border-b pb-2">Control de Articulaciones</h2>
      
      <div className="space-y-8">
        {articulaciones.map((articulacion) => (
          <div key={articulacion.id} className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium text-gray-700">
                {obtenerEtiqueta(articulacion.id, articulacion.tipo)}
              </label>
              <span className="text-sm font-medium bg-blue-100 px-2 py-1 rounded-md text-blue-800">
                {articulacion.valorActual.toFixed(2)}{obtenerUnidad(articulacion.tipo)}
              </span>
            </div>
            
            <Slider
              min={articulacion.limiteInferior}
              max={articulacion.limiteSuperior}
              value={articulacion.valorActual}
              step={0.1}
              onChange={(valor) => actualizarArticulacion(articulacion.id, valor)}
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>{articulacion.limiteInferior}{obtenerUnidad(articulacion.tipo)}</span>
              <span>{articulacion.limiteSuperior}{obtenerUnidad(articulacion.tipo)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};