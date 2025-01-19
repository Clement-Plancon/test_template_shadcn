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
  const [isOpen, setIsOpen] = useState(true);
  const [isAdvanced, setIsAdvanced] = useState(false); // État pour basculer entre les modes

  // Variables CSS pour le mode avancé
  const variables = [
    "--background",
    "--foreground",
    "--card",
    "--card-foreground",
    "--popover",
    "--popover-foreground",
    "--primary",
    "--primary-foreground",
    "--secondary",
    "--secondary-foreground",
    "--muted",
    "--muted-foreground",
    "--accent",
    "--accent-foreground",
    "--destructive",
    "--destructive-foreground",
    "--border",
    "--input",
    "--ring",
    "--radius",
  ];

  // Variables simplifiées pour le mode de base
  const baseControls = [
    {
      name: "--primary",
      label: "Primary Color",
      type: "color",
      defaultValue: "#ff8c00",
    },
    {
      name: "--radius",
      label: "Border Radius",
      type: "range",
      defaultValue: 8,
      min: 0,
      max: 50,
    },
  ];

  const handleVariableChange = (name: string, value: string) => {
    if (name === "--radius") {
      document.documentElement.style.setProperty(name, `${value}px`);
    } else {
      const hslValue = hexToHSL(value);
      document.documentElement.style.setProperty(name, hslValue);
    }
  };

  const resetVariables = () => {
    if (isAdvanced) {
      variables.forEach((variable) => {
        if (variable === "--radius") {
          document.documentElement.style.setProperty(variable, "8px");
        } else {
          document.documentElement.style.setProperty(variable, "");
        }
      });
    } else {
      baseControls.forEach((control) => {
        if (control.type === "color") {
          const hslValue = hexToHSL(control.defaultValue as string);
          document.documentElement.style.setProperty(control.name, hslValue);
        } else if (control.type === "range") {
          document.documentElement.style.setProperty(
            control.name,
            `${control.defaultValue}px`
          );
        }
      });
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg hover:bg-gray-700"
        >
          Ouvrir panneau de configuration
        </button>
      )}

      {isOpen && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-72 h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
              {isAdvanced
                ? "Contrôle de thème avancé"
                : "Contrôle de thème de base"}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white bg-gray-600 hover:bg-gray-500 p-1 rounded"
            >
              ✕
            </button>
          </div>

          {!isAdvanced &&
            baseControls.map((control) => (
              <div key={control.name} className="mb-4">
                <label className="block text-sm mb-1">{control.label}</label>
                {control.type === "color" ? (
                  <input
                    type="color"
                    defaultValue={control.defaultValue as string}
                    onChange={(e) =>
                      handleVariableChange(control.name, e.target.value)
                    }
                    className="w-full"
                  />
                ) : (
                  <input
                    type="range"
                    min={(control.min ?? 0).toString()} // Conversion explicite et valeur par défaut
                    max={(control.max ?? 50).toString()} // Conversion explicite et valeur par défaut
                    defaultValue={control.defaultValue.toString()} // Conversion explicite
                    onChange={(e) =>
                      handleVariableChange(control.name, e.target.value)
                    }
                    className="w-full"
                  />
                )}
              </div>
            ))}

          {isAdvanced &&
            variables.map((variable) => (
              <div key={variable} className="mb-4">
                <label className="block text-sm mb-1">{variable}</label>
                {variable === "--radius" ? (
                  <input
                    type="range"
                    min="0"
                    max="50"
                    defaultValue="8"
                    onChange={(e) =>
                      handleVariableChange(variable, e.target.value)
                    }
                    className="w-full"
                  />
                ) : (
                  <input
                    type="color"
                    defaultValue="#ffffff"
                    onChange={(e) =>
                      handleVariableChange(variable, e.target.value)
                    }
                    className="w-full"
                  />
                )}
              </div>
            ))}

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setIsAdvanced(!isAdvanced)}
              className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded"
            >
              {isAdvanced
                ? "Revenir au panneau de base"
                : "Configuration avancée"}
            </button>
            <button
              onClick={resetVariables}
              className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeControl;
