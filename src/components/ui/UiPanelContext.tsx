"use client";
import React, { createContext, useContext, useState } from "react";

type PanelType = "none" | "email" | "navigator";

interface UiPanelContextType {
  openPanel: PanelType;
  setOpenPanel: (panel: PanelType) => void;
}

const UiPanelContext = createContext<UiPanelContextType>({
  openPanel: "none",
  setOpenPanel: () => {},
});

export const UiPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openPanel, setOpenPanel] = useState<PanelType>("none");
  return (
    <UiPanelContext.Provider value={{ openPanel, setOpenPanel }}>
      {children}
    </UiPanelContext.Provider>
  );
};

export const useUiPanel = () => useContext(UiPanelContext);
