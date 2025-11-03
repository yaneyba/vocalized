import { MockDataProvider } from "./MockDataProvider";
import type { IDataProvider } from "./types";

type ProviderKey = "mock";

export class DataProviderFactory {
  static create(provider: ProviderKey = "mock"): IDataProvider {
    switch (provider) {
      case "mock":
      default:
        return new MockDataProvider();
    }
  }
}

