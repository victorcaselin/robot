import React from 'react';

interface ModalAyudaProps {
  onClose: () => void;
}

/**
 * Modal con instrucciones de uso del simulador
 */
export const ModalAyuda: React.FC<ModalAyudaProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Ayuda del Simulador</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Acerca del Robot Cilíndrico</h3>
              <p className="text-gray-700">
                Un robot cilíndrico es un tipo de robot industrial que utiliza coordenadas cilíndricas (r, θ, z) para describir su movimiento. 
                Cuenta con tres grados de libertad: rotación de la base (θ), elevación vertical (z) y extensión radial (r).
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Controles de la Visualización 3D</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li><span className="font-medium">Rotar cámara:</span> Click izquierdo + arrastrar</li>
                <li><span className="font-medium">Zoom:</span> Rueda del ratón</li>
                <li><span className="font-medium">Desplazar:</span> Click derecho + arrastrar</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Control de Articulaciones</h3>
              <p className="text-gray-700 mb-2">
                Utiliza los deslizadores (sliders) para controlar las tres articulaciones del robot:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li><span className="font-medium">Rotación Base (θ):</span> Gira la base del robot (-180° a 180°)</li>
                <li><span className="font-medium">Elevación (z):</span> Mueve la columna verticalmente (0 a 5m)</li>
                <li><span className="font-medium">Extensión (r):</span> Extiende el brazo horizontalmente (0 a 3m)</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Visualización Técnica</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li><span className="font-medium">Coordenadas:</span> Muestra la posición actual del efector final en coordenadas cartesianas (x, y, z).</li>
                <li><span className="font-medium">Matrices:</span> Visualiza la matriz de transformación homogénea que describe la posición y orientación del efector final.</li>
                <li><span className="font-medium">Espacio de Trabajo:</span> Muestra el volumen de espacio alcanzable por el robot.</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Trayectorias</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li><span className="font-medium">Importar:</span> Carga una trayectoria desde archivos JSON o CSV.</li>
                <li><span className="font-medium">Exportar:</span> Guarda la posición actual como un punto de trayectoria.</li>
              </ul>
              <p className="text-gray-700 mt-2">
                <span className="font-medium">Formato JSON:</span> <code>[&lbrace;"x":1,"y":2,"z":3&rbrace;, ...]</code><br/>
                <span className="font-medium">Formato CSV:</span> <code>x,y,z</code> (una línea por punto)
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Configuración</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li><span className="font-medium">Parámetros Cinemáticos:</span> Modifica las dimensiones físicas del robot.</li>
                <li><span className="font-medium">Guardar/Cargar:</span> Almacena o recupera la configuración actual.</li>
                <li><span className="font-medium">Reiniciar:</span> Restaura el simulador a su estado inicial.</li>
              </ul>
            </section>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};