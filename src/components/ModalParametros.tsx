import React, { useState } from 'react';
import { useSimulador } from '../context/SimuladorContext';
import { ParametrosCinematica } from '../models/ParametrosCinematica';

interface ModalParametrosProps {
  onClose: () => void;
}

/**
 * Modal para modificar los parámetros cinemáticos del robot
 */
export const ModalParametros: React.FC<ModalParametrosProps> = ({ onClose }) => {
  const { parametros, actualizarParametros } = useSimulador();
  
  const [parametrosForm, setParametrosForm] = useState<ParametrosCinematica>({
    ...parametros
  });
  
  // Maneja cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParametrosForm({
      ...parametrosForm,
      [name]: parseFloat(value)
    });
  };
  
  // Guarda los cambios
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarParametros(parametrosForm);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Parámetros Cinemáticos</h2>
              <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="longitudBase" className="block text-sm font-medium text-gray-700 mb-1">
                  Longitud de la Base (m)
                </label>
                <input
                  type="number"
                  id="longitudBase"
                  name="longitudBase"
                  value={parametrosForm.longitudBase}
                  onChange={handleChange}
                  min="0.5"
                  max="10"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="longitudBrazo" className="block text-sm font-medium text-gray-700 mb-1">
                  Longitud Máxima del Brazo (m)
                </label>
                <input
                  type="number"
                  id="longitudBrazo"
                  name="longitudBrazo"
                  value={parametrosForm.longitudBrazo}
                  onChange={handleChange}
                  min="0.5"
                  max="10"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="radioBase" className="block text-sm font-medium text-gray-700 mb-1">
                  Radio de la Base (m)
                </label>
                <input
                  type="number"
                  id="radioBase"
                  name="radioBase"
                  value={parametrosForm.radioBase}
                  onChange={handleChange}
                  min="0.2"
                  max="5"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="alturaMaxima" className="block text-sm font-medium text-gray-700 mb-1">
                  Altura Máxima (m)
                </label>
                <input
                  type="number"
                  id="alturaMaxima"
                  name="alturaMaxima"
                  value={parametrosForm.alturaMaxima}
                  onChange={handleChange}
                  min="1"
                  max="15"
                  step="0.5"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};