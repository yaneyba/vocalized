# Data Layer Reference

The Vocalized dashboard relies on a provider abstraction that keeps data access consistent across pages. This document explains the contracts and how to evolve them.

## Key Files

- `src/data/types.ts` — shared TypeScript interfaces for agents, calls, billing, analytics, etc.
- `src/data/MockDataProvider.ts` — mock implementation that returns rich sample data with simulated latency.
- `src/data/DataProviderFactory.ts` — factory that chooses which provider to use (only `mock` today).
- `src/providers/DataProviderContext.tsx` — React context + hook to access the provider from any component.

## IDataProvider Contract

```ts
export interface IDataProvider {
  getDashboardOverview(): Promise<DashboardOverview>;
  getAgents(): Promise<Agent[]>;
  getAgentTemplates(): Promise<AgentTemplate[]>;
  getVoiceProfiles(): Promise<VoiceProfile[]>;
  getCallRecords(): Promise<CallRecord[]>;
  getCallDetail(callId: string): Promise<CallDetail | undefined>;
  getIntegrations(): Promise<Integration[]>;
  getAnalyticsSummary(): Promise<AnalyticsSummary>;
  getBillingSummary(): Promise<BillingSummary>;
  getSettingsSnapshot(): Promise<SettingsSnapshot>;
}
```

Every page invokes one or more of these methods via the `useDataProvider()` hook.

## Mock Implementation

- Returns deterministic mock data defined at the top of `MockDataProvider.ts`.
- Uses `await delay(ms)` to mimic real network latency.
- Clones data before returning so components cannot mutate shared references.

## Swapping to Real APIs

1. Create a new class (e.g., `RestDataProvider`) implementing `IDataProvider`.
2. Replace mock logic with `fetch`/`axios` or your preferred client.
3. Update `DataProviderFactory.create` to choose provider via environment variable:

   ```ts
   const providerKey = (import.meta.env.VITE_DATA_PROVIDER ?? "mock") as ProviderKey;
   export const dataProvider = DataProviderFactory.create(providerKey);
   ```

4. Inject auth tokens or base URLs via configuration to keep the class stateless.

## Error Handling

- Components currently assume success. When adding real APIs, consider:
  - Throwing typed errors from provider methods.
  - Wrapping hooks in `try/catch` to show toast notifications or inline fallbacks.
  - Returning skeletons/loaders during retries.

## Testing Strategy

- Because views depend on the provider interface, you can inject a test double that returns deterministic data for unit tests.
- For integration tests, consider spinning up a mock server or reusing `MockDataProvider`.

By keeping all data access behind `IDataProvider`, the app stays flexible and can move from mocks to production data with minimal churn in the UI layer.

