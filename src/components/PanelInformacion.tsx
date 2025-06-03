import React from 'react';
import { useSimulador } from '../context/SimuladorContext';

/**
 * Componente para mostrar información técnica del robot
 */
export const PanelInformacion: React.FC = () => {
  const { 
    coordenadas, 
    matrizDirecta, 
    mostrarMatrices,
    mostrarCoordenadas,
    mostrarWorkspace
  } = useSimulador();
  
  return (
    <div className="space-y-4 bg-blue-50 p-4 rounded-md">
      <h3 className="font-bold text-blue-800">Información Técnica</h3>
      
      {/* Coordenadas actuales */}
      {mostrarCoordenadas && (
        <div className="bg-white p-3 rounded-md shadow-sm">
          <h4 className="font-medium text-sm text-gray-600 mb-2">Coordenadas del Efector Final:</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-100 p-2 rounded text-center">
              <span className="block text-xs text-gray-600">X</span>
              <span className="font-mono font-medium">{coordenadas.x.toFixed(3)}</span>
            </div>
            <div className="bg-blue-100 p-2 rounded text-center">
              <span className="block text-xs text-gray-600">Y</span>
              <span className="font-mono font-medium">{coordenadas.y.toFixed(3)}</span>
            </div>
            <div className="bg-blue-100 p-2 rounded text-center">
              <span className="block text-xs text-gray-600">Z</span>
              <span className="font-mono font-medium">{coordenadas.z.toFixed(3)}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Matriz de transformación */}
      {mostrarMatrices && (
        <div className="bg-white p-3 rounded-md shadow-sm overflow-x-auto">
          <h4 className="font-medium text-sm text-gray-600 mb-2">Matriz de Transformación:</h4>
          <table className="w-full border-collapse">
            <tbody>
              {matrizDirecta.map((fila, i) => (
                <tr key={i}>
                  {fila.map((valor, j) => (
                    <td key={j} className="border border-gray-200 p-1 text-center">
                      <span className="font-mono text-sm">{valor.toFixed(2)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Espacio de trabajo */}
      {mostrarWorkspace && (
        <div className="bg-white p-3 rounded-md shadow-sm">
          <h4 className="font-medium text-sm text-gray-600 mb-2">Información del Workspace:</h4>
          <ul className="text-sm space-y-1">
            <li>
              <span className="font-medium">Tipo de robot:</span> Cilíndrico
            </li>
            <li>
              <span className="font-medium">Radio máximo:</span> {3} m
            </li>
            <li>
              <span className="font-medium">Altura máxima:</span> {5} m
            </li>
            <li>
              <span className="font-medium">Volumen aproximado:</span> {(Math.PI * 3**2 * 5).toFixed(2)} m³
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};