import { createContext, useContext } from "react";
import type { IDataProvider } from "../data/types";

export const DataProviderContext = createContext<IDataProvider | null>(null);

export function useDataProvider(): IDataProvider {
  const provider = useContext(DataProviderContext);
  if (!provider) {
    throw new Error("useDataProvider must be used within a DataProviderContext.Provider");
  }
  return provider;
}

