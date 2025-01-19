"use client";
import React, { useState } from "react";

// Fonction pour convertir une couleur hexadécimale en HSL
const hexToHSL = (hex: string): string => {
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
};

const ThemeControl = () => {
  const [primaryColor, setPrimaryColor] = useState("#ff8c00");
  const [borderRadius, setBorderRadius] = useState(8);
  const [isOpen, setIsOpen] = useState(true); // État pour afficher/masquer le panneau

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setPrimaryColor(color);
    const hslColor = hexToHSL(color);
    document.documentElement.style.setProperty("--primary", hslColor);
    document.documentElement.style.setProperty("--ring", hslColor);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const radius = e.target.value;
    setBorderRadius(Number(radius));
    document.documentElement.style.setProperty("--radius", `${radius}px`);
  };

  const resetTheme = () => {
    setPrimaryColor("#ff8c00");
    setBorderRadius(8);
    const defaultHSL = hexToHSL("#ff8c00");
    document.documentElement.style.setProperty("--primary", defaultHSL);
    document.documentElement.style.setProperty("--radius", "8px");
  };

  return (
    <>
      {/* Bouton pour afficher le panneau si fermé */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg hover:bg-gray-700"
        >
          Ouvrir le panneau de configuration
        </button>
      )}

      {/* Panneau de contrôle */}
      {isOpen && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Modifier le theme</h3>
            {/* Bouton pour fermer le panneau */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white bg-gray-600 hover:bg-gray-500 p-1 rounded"
            >
              ✕
            </button>
          </div>

          <label className="block mb-4">
            <span className="text-sm">Primary Color:</span>
            <input
              type="color"
              value={primaryColor}
              onChange={handleColorChange}
              className="w-full mt-1"
            />
          </label>
          <label className="block mb-4">
            <span className="text-sm">Border Radius:</span>
            <input
              type="range"
              min="0"
              max="50"
              value={borderRadius}
              onChange={handleRadiusChange}
              className="w-full mt-1"
            />
          </label>
          <button
            onClick={resetTheme}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Reset
          </button>
        </div>
      )}
    </>
  );
};

export default ThemeControl;
