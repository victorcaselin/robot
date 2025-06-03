/**
 * Clase Articulacion - Representa una articulación del robot
 */
export class Articulacion {
  id: number;
  tipo: string;
  valorActual: number;
  limiteInferior: number;
  limiteSuperior: number;

  /**
   * Constructor de la clase Articulación
   * @param id Identificador único de la articulación
   * @param tipo Tipo de articulación: 'rotacional' o 'lineal'
   * @param valorActual Valor inicial de la articulación
   * @param limiteInferior Límite inferior del rango de movimiento
   * @param limiteSuperior Límite superior del rango de movimiento
   */
  constructor(
    id: number,
    tipo: string,
    valorActual: number,
    limiteInferior: number,
    limiteSuperior: number
  ) {
    this.id = id;
    this.tipo = tipo;
    this.limiteInferior = limiteInferior;
    this.limiteSuperior = limiteSuperior;
    // Asegurar que el valor inicial esté dentro de los límites
    this.valorActual = Math.max(
      this.limiteInferior,
      Math.min(valorActual, this.limiteSuperior)
    );
  }

  /**
   * Actualiza el valor de la articulación dentro de sus límites
   * @param nuevoValor Nuevo valor para la articulación
   * @returns El valor actualizado (limitado si es necesario)
   */
  actualizarValor(nuevoValor: number): number {
    // Asegurar que el nuevo valor esté dentro de los límites
    this.valorActual = Math.max(
      this.limiteInferior,
      Math.min(nuevoValor, this.limiteSuperior)
    );
    return this.valorActual;
  }

  /**
   * Convierte la articulación a un objeto para JSON
   */
  toJSON() {
    return {
      id: this.id,
      tipo: this.tipo,
      valorActual: this.valorActual,
      limiteInferior: this.limiteInferior,
      limiteSuperior: this.limiteSuperior
    };
  }
}