import { ReactNode } from 'react';

/**
 * Represents the standard interface that all Micro-UI modules must implement.
 * This ensures that the orchestration layer (proxy) can interact with them uniformly.
 */
export interface BuildAdapter<TData = unknown> {
  /**
   * Fetches the necessary data for the module.
   * In a real build-time adapter, this might transform CMS data.
   * In this runtime simulation, it acts as the data fetcher.
   */
  loader: () => Promise<TData>;

  /**
   * The primary presentation component.
   * It receives the data returned by the loader.
   */
  Component: (props: { data: TData }) => ReactNode;
}
