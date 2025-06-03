/**
 * Interfaz ParametrosCinematica - Define los parámetros físicos del robot
 */
export interface ParametrosCinematica {
  longitudBase: number;  // Altura de la base fija
  longitudBrazo: number; // Longitud máxima del brazo extensible
  radioBase: number;     // Radio de la base giratoria
  alturaMaxima: number;  // Altura máxima alcanzable
}