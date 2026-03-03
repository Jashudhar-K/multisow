import React from 'react';

const CropGrowthStatic = () => (
  <div className="flex items-center justify-center w-full h-64 bg-[#0A0F0A] rounded-2xl">
    <svg width="180" height="220" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="90" cy="210" rx="60" ry="12" fill="#3D1C02" />
      {/* Soil mounds */}
      <ellipse cx="40" cy="215" rx="12" ry="4" fill="#4B2A0A" opacity="0.5" />
      <ellipse cx="140" cy="217" rx="10" ry="3" fill="#4B2A0A" opacity="0.4" />
      <ellipse cx="70" cy="218" rx="8" ry="2.5" fill="#4B2A0A" opacity="0.3" />
      {/* Main stalk */}
      <rect x="86" y="110" width="8" height="90" rx="4" fill="#6DB33F" />
      {/* Leaves (SVG paths for mature plant) */}
      <path d="M90 140 Q70 120 90 110 Q110 120 90 140" fill="#A3E635" stroke="#6DB33F" strokeWidth="2" />
      <path d="M90 160 Q60 150 90 130 Q120 150 90 160" fill="#A3E635" stroke="#6DB33F" strokeWidth="2" />
      <path d="M90 180 Q50 170 90 150 Q130 170 90 180" fill="#A3E635" stroke="#6DB33F" strokeWidth="2" />
      <path d="M90 200 Q80 190 90 170 Q100 190 90 200" fill="#A3E635" stroke="#6DB33F" strokeWidth="2" />
      {/* Flower */}
      <circle cx="90" cy="110" r="12" fill="#FFD700" stroke="#FF8C00" strokeWidth="3" />
      {/* Fruit */}
      <ellipse cx="90" cy="100" rx="7" ry="10" fill="#C0392B" stroke="#F4D03F" strokeWidth="2" />
    </svg>
  </div>
);

export default CropGrowthStatic;
