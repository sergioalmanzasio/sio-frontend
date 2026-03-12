// src/components/Card.jsx

import React from 'react';
import { PrimaryButton, SecondaryButton, ButtonCard } from '../ui/button';
import { getColorOpertator, getColorButtonBuy, getColorHoverOpertator, getColorButtonBenefits, OPERATORS_LOGOS } from '../../shared/utils';

export default function Card({ title, description, index, operator, price = "$ -- /mes", onBenefitsClick, onBuyClick }) {
  // Define un color de fondo basado en el índice para variedad visual
  // const bgColor = index % 3 === 0 ? 'bg-blue-500/10' : 
  //                 index % 3 === 1 ? 'bg-indigo-500/10' : 
  //                 'bg-cyan-500/10';

  // // Define un color de texto primario
  // const textColor = index % 3 === 0 ? 'text-blue-700' : 
  //                   index % 3 === 1 ? 'text-indigo-700' : 
  //                   'text-cyan-700';


  

  return (
    <div 
      className={`
        relative overflow-hidden
        ${getColorOpertator(operator)}
        text-white
        rounded-xl p-5 shadow-lg border border-gray-100 
        transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]
        flex flex-col justify-between
      `}
    >
      {/* Icono decorativo (usando un emoji para simplicidad) */}
      {/* <div className="text-3xl mb-3">
        {index % 4 === 0 ? '✨' : index % 4 === 1 ? '🔗' : index % 4 === 2 ? '⚡' : '🚀'}
      </div> */}

      <div className="absolute -top-5 -right-5 w-24 h-24 bg-white rounded-full 
                flex items-center justify-center overflow-hidden shadow-md">

        <img 
          src={OPERATORS_LOGOS[operator.toUpperCase()] ?? OPERATORS_LOGOS.CLARO}
          alt={operator}
          className="w-24 h-14 object-contain"
        />

      </div>
      
      <h4 className="text-xl font-bold mb-2 max-w-[150px] md:max-w-[200px]">
        {title}
      </h4>
      <p className="text-sm opacity-80">
        {description}
      </p>
      <p className="text-xl opacity-80 font-semibold mt-4 ">
        {price} <span className="text-white text-sm font-normal opacity-90"> /mes</span>
      </p>
      {/* Botones de acción */}
      <div className="flex flex-col lg:flex-row justify-end gap-2 mt-2">
        <ButtonCard className={`mt-2 md:mt-4 ${getColorButtonBenefits(operator)}`} onClick={onBenefitsClick}>
          Beneficios
        </ButtonCard>

        <ButtonCard className={`mt-2 md:mt-4 hidden ${getColorButtonBuy(operator)}`} onClick={onBuyClick}>
          Adquirir
        </ButtonCard>
      </div>
    </div>
  );
}