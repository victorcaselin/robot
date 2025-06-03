/**
 * Clase Coordenadas - Representa la posición del extremo del robot en el espacio cartesiano
 */
export class Coordenadas {
  x: number;
  y: number;
  z: number;

  /**
   * Constructor de la clase Coordenadas
   * @param x Coordenada en el eje X
   * @param y Coordenada en el eje Y
   * @param z Coordenada en el eje Z
   */
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Convierte las coordenadas a formato de texto
   * @returns Representación en texto de las coordenadas
   */
  toString(): string {
    return `X: ${this.x.toFixed(2)}, Y: ${this.y.toFixed(2)}, Z: ${this.z.toFixed(2)}`;
  }
  
  /**
   * Convierte las coordenadas a un objeto para JSON
   */
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }
}