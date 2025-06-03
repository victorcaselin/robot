import React, { useState, useEffect, useRef } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}

/**
 * Componente Slider personalizado
 */
export const Slider: React.FC<SliderProps> = ({ 
  min, 
  max, 
  value, 
  step = 1, 
  onChange 
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Actualiza el valor interno cuando cambia la prop value
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Calcula el porcentaje para el estilo del track
  const percentage = ((currentValue - min) / (max - min)) * 100;

  // Maneja el cambio del input range
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setCurrentValue(newValue);
    onChange(newValue);
  };

  // Manejo de interacción con el track (click)
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(steppedValue, max));
    
    setCurrentValue(clampedValue);
    onChange(clampedValue);
  };

  return (
    <div 
      className="relative h-6 flex items-center cursor-pointer"
      ref={sliderRef}
      onClick={handleTrackClick}
    >
      {/* Track base */}
      <div className="absolute h-2 w-full bg-gray-200 rounded-full" />
      
      {/* Track relleno */}
      <div 
        className="absolute h-2 bg-blue-500 rounded-full transition-all duration-100" 
        style={{ width: `${percentage}%` }}
      />
      
      {/* Thumb (control deslizante) */}
      <div 
        className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow transform -translate-x-1/2 hover:scale-110 transition-transform"
        style={{ left: `${percentage}%` }}
      />
      
      {/* Input range nativo (invisible pero funcional para accesibilidad) */}
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="absolute w-full h-6 opacity-0 cursor-pointer"
      />
    </div>
  );
};