// src/components/Card.jsx

import React from 'react';
import { PrimaryButton, SecondaryButton } from '../ui/button';

export default function Card({ title, description, index, onBenefitsClick, onBuyClick }) {
  // Define un color de fondo basado en el índice para variedad visual
  const bgColor = index % 3 === 0 ? 'bg-blue-500/10' : 
                  index % 3 === 1 ? 'bg-indigo-500/10' : 
                  'bg-cyan-500/10';

  // Define un color de texto primario
  const textColor = index % 3 === 0 ? 'text-blue-700' : 
                    index % 3 === 1 ? 'text-indigo-700' : 
                    'text-cyan-700';

  return (
    <div 
      className={`
        ${bgColor}
        ${textColor}
        rounded-xl p-5 shadow-lg border border-gray-100 
        transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]
        flex flex-col justify-between
      `}
    >
      {/* Icono decorativo (usando un emoji para simplicidad) */}
      <div className="text-3xl mb-3">
        {index % 4 === 0 ? '✨' : index % 4 === 1 ? '🔗' : index % 4 === 2 ? '⚡' : '🚀'}
      </div>
      
      <h4 className="text-xl font-bold mb-2">
        {title}
      </h4>
      <p className="text-sm opacity-80">
        {description}
      </p>
      {/* Botones de acción */}
      <div className="flex flex-col lg:flex-row justify-end gap-2 mt-4">
       <PrimaryButton className="mt-4" onClick={onBenefitsClick}>
        Beneficios
      </PrimaryButton>
      <SecondaryButton className="mt-4" onClick={onBuyClick}>
        La quiero
      </SecondaryButton>
      </div>
    </div>
  );
}