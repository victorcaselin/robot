import { Coordenadas } from './Coordenadas';

/**
 * Clase Trayectoria - Representa una secuencia de puntos para el movimiento del robot
 */
export class Trayectoria {
  puntos: Coordenadas[];
  formato: 'CSV' | 'JSON';

  /**
   * Constructor de la clase Trayectoria
   * @param formato Formato de los datos ('CSV' o 'JSON')
   */
  constructor(formato: 'CSV' | 'JSON' = 'JSON') {
    this.puntos = [];
    this.formato = formato;
  }

  /**
   * Importa datos de trayectoria desde un string en formato CSV o JSON
   * @param datos String con los datos en formato CSV o JSON
   * @returns true si la importación fue exitosa, false en caso contrario
   */
  importarDatos(datos: string): boolean {
    try {
      if (this.formato === 'CSV') {
        // Procesar formato CSV
        const lineas = datos.trim().split('\n');
        const puntosNuevos: Coordenadas[] = [];
        
        // Verificar si hay encabezados (primera línea)
        let startIndex = 0;
        if (lineas[0].toLowerCase().includes('x') && 
            lineas[0].toLowerCase().includes('y') &&
            lineas[0].toLowerCase().includes('z')) {
          startIndex = 1;
        }
        
        for (let i = startIndex; i < lineas.length; i++) {
          const valores = lineas[i].split(',');
          if (valores.length >= 3) {
            const x = parseFloat(valores[0].trim());
            const y = parseFloat(valores[1].trim());
            const z = parseFloat(valores[2].trim());
            
            if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
              puntosNuevos.push(new Coordenadas(x, y, z));
            }
          }
        }
        
        if (puntosNuevos.length > 0) {
          this.puntos = puntosNuevos;
          return true;
        }
        return false;
      } else {
        // Procesar formato JSON
        const datosJSON = JSON.parse(datos);
        
        if (Array.isArray(datosJSON)) {
          const puntosNuevos: Coordenadas[] = [];
          
          for (const punto of datosJSON) {
            if ('x' in punto && 'y' in punto && 'z' in punto) {
              const x = parseFloat(punto.x);
              const y = parseFloat(punto.y);
              const z = parseFloat(punto.z);
              
              if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                puntosNuevos.push(new Coordenadas(x, y, z));
              }
            }
          }
          
          if (puntosNuevos.length > 0) {
            this.puntos = puntosNuevos;
            return true;
          }
        }
        return false;
      }
    } catch (error) {
      console.error('Error al importar datos:', error);
      return false;
    }
  }

  /**
   * Exporta los puntos de la trayectoria al formato especificado
   * @returns String con los datos en formato CSV o JSON
   */
  exportarDatos(): string {
    if (this.formato === 'CSV') {
      // Exportar como CSV
      let csv = 'X,Y,Z\n';
      this.puntos.forEach(punto => {
        csv += `${punto.x},${punto.y},${punto.z}\n`;
      });
      return csv;
    } else {
      // Exportar como JSON
      return JSON.stringify(this.puntos, null, 2);
    }
  }

  /**
   * Agrega un nuevo punto a la trayectoria
   * @param punto Coordenadas del punto a agregar
   */
  agregarPunto(punto: Coordenadas): void {
    this.puntos.push(punto);
  }

  /**
   * Elimina todos los puntos de la trayectoria
   */
  limpiar(): void {
    this.puntos = [];
  }

  /**
   * Obtiene la cantidad de puntos en la trayectoria
   * @returns Número de puntos
   */
  get cantidadPuntos(): number {
    return this.puntos.length;
  }
}