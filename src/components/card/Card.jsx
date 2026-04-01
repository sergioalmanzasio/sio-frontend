import React from 'react';
import { ButtonCard } from '../ui/button';
import { getColorOpertator, getColorButtonBuy, getColorButtonBenefits } from '../../shared/utils';

export default function Card({ title, description, operator, price = "$ -- /mes", onBenefitsClick, onBuyClick, operatorLogo, operatorColor }) {
  return (
    <div 
      className={`
        relative overflow-hidden
        ${operatorColor}
        text-white
        rounded-xl p-5 shadow-lg border border-gray-100 
        transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]
        flex flex-col justify-between
        h-full min-h-[220px]
      `}
    >
      <div className="absolute -top-5 -right-5 w-24 h-24 bg-white rounded-full 
                flex items-center justify-center overflow-hidden shadow-md">
        <img 
          src={operatorLogo}
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
      <div className="flex flex-col lg:flex-row justify-end gap-2 mt-2">
        <ButtonCard className="mt-2 md:mt-4 bg-black/30" onClick={onBenefitsClick}>
          Beneficios
        </ButtonCard>
      </div>
    </div>
  );
}