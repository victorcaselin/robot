import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Coordenadas } from '../models/Coordenadas';
import { Articulacion } from '../models/Articulacion';
import { ParametrosCinematica } from '../models/ParametrosCinematica';

// Definición del contexto del simulador
interface SimuladorContextType {
  articulaciones: Articulacion[];
  coordenadas: Coordenadas;
  parametros: ParametrosCinematica;
  matrizDirecta: number[][];
  mostrarMatrices: boolean;
  mostrarCoordenadas: boolean;
  mostrarWorkspace: boolean;
  actualizarArticulacion: (id: number, valor: number) => void;
  toggleMatrices: () => void;
  toggleCoordenadas: () => void;
  toggleWorkspace: () => void;
  actualizarParametros: (nuevosParametros: Partial<ParametrosCinematica>) => void;
  reiniciarSimulador: () => void;
}

// Valores iniciales ajustados según especificaciones
const parametrosIniciales: ParametrosCinematica = {
  longitudBase: 0.3, // Altura mínima del eje vertical
  longitudBrazo: 1.7, // Extensión máxima del brazo
  radioBase: 0.4, // Radio de la base
  alturaMaxima: 1.3 // Altura máxima del eje vertical
};

const articulacionesIniciales: Articulacion[] = [
  new Articulacion(0, 'rotacional', 0, -180, 180),    // Base rotacional (theta)
  new Articulacion(1, 'lineal', 0.3, 0.3, 1.3),      // Elevación (z)
  new Articulacion(2, 'lineal', 0.3, 0.3, 1.7)       // Extensión (r)
];

// Crear contexto
const SimuladorContext = createContext<SimuladorContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useSimulador = () => {
  const context = useContext(SimuladorContext);
  if (!context) {
    throw new Error('useSimulador debe ser usado dentro de SimuladorProvider');
  }
  return context;
};

// Provider del contexto
export const SimuladorProvider = ({ children }: { children: ReactNode }) => {
  const [articulaciones, setArticulaciones] = useState<Articulacion[]>(articulacionesIniciales);
  const [parametros, setParametros] = useState<ParametrosCinematica>(parametrosIniciales);
  const [matrizDirecta, setMatrizDirecta] = useState<number[][]>([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ]);
  const [coordenadas, setCoordenadas] = useState<Coordenadas>(new Coordenadas(0.3, 0, 0.3));
  const [mostrarMatrices, setMostrarMatrices] = useState(false);
  const [mostrarCoordenadas, setMostrarCoordenadas] = useState(true);
  const [mostrarWorkspace, setMostrarWorkspace] = useState(false);

  // Actualizar una articulación específica
  const actualizarArticulacion = (id: number, valor: number) => {
    setArticulaciones(prevState => {
      const nuevasArticulaciones = [...prevState];
      const articulacion = nuevasArticulaciones.find(a => a.id === id);
      if (articulacion) {
        articulacion.actualizarValor(valor);
      }
      return nuevasArticulaciones;
    });
    
    calcularCinematicaDirecta();
  };

  // Calcular cinemática directa
  const calcularCinematicaDirecta = () => {
    const theta = articulaciones[0].valorActual * Math.PI / 180;
    const z = articulaciones[1].valorActual;
    const r = articulaciones[2].valorActual;
    
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    
    setCoordenadas(new Coordenadas(x, y, z));
    
    const nuevaMatriz = [
      [Math.cos(theta), -Math.sin(theta), 0, x],
      [Math.sin(theta), Math.cos(theta), 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1]
    ];
    
    setMatrizDirecta(nuevaMatriz);
  };

  const toggleMatrices = () => setMostrarMatrices(!mostrarMatrices);
  const toggleCoordenadas = () => setMostrarCoordenadas(!mostrarCoordenadas);
  const toggleWorkspace = () => setMostrarWorkspace(!mostrarWorkspace);
  
  const actualizarParametros = (nuevosParametros: Partial<ParametrosCinematica>) => {
    setParametros(prevParams => ({
      ...prevParams,
      ...nuevosParametros
    }));
    calcularCinematicaDirecta();
  };
  
  const reiniciarSimulador = () => {
    setArticulaciones(articulacionesIniciales.map(a => new Articulacion(a.id, a.tipo, a.valorActual, a.limiteInferior, a.limiteSuperior)));
    setParametros({...parametrosIniciales});
    calcularCinematicaDirecta();
  };

  React.useEffect(() => {
    calcularCinematicaDirecta();
  }, []);

  return (
    <SimuladorContext.Provider
      value={{
        articulaciones,
        coordenadas,
        parametros,
        matrizDirecta,
        mostrarMatrices,
        mostrarCoordenadas,
        mostrarWorkspace,
        actualizarArticulacion,
        toggleMatrices,
        toggleCoordenadas,
        toggleWorkspace,
        actualizarParametros,
        reiniciarSimulador
      }}
    >
      {children}
    </SimuladorContext.Provider>
  );
};