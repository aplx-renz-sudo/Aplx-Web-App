/**
 * Centralized API Rate Limit & Quota Handler
 * Detects rate-limit and quota-exhaustion errors and triggers the funny Touch Grass modal.
 */

export interface ApiLimitEventDetail {
  providerName?: string;
  details?: string;
}

const API_LIMIT_EVENT = 'aplx:api_limit_reached';

/**
 * Checks whether an error or string indicates that an API key limit or server rate limit was reached.
 */
export function isApiLimitError(err: unknown): boolean {
  if (!err) return false;

  const str = String(
    typeof err === 'object' && err !== null && 'message' in err
      ? (err as { message: unknown }).message
      : err
  ).toLowerCase();

  return (
    str.includes('429') ||
    str.includes('too many requests') ||
    str.includes('rate limit') ||
    str.includes('ratelimit') ||
    str.includes('rate_limit') ||
    str.includes('quota') ||
    str.includes('resource_exhausted') ||
    str.includes('insufficient_quota') ||
    str.includes('exceeded your current quota') ||
    str.includes('out of credits') ||
    str.includes('credit limit') ||
    str.includes('balance is too low') ||
    str.includes('insufficient funds') ||
    str.includes('overloaded') ||
    str.includes('capacity exceeded') ||
    str.includes('server overwhelmed') ||
    str.includes('limit reached') ||
    str.includes('cool-down') ||
    str.includes('cooldown') ||
    str.includes('limit exceeded')
  );
}

/**
 * Triggers the funny Touch Grass & Drink Water modal across the app.
 */
export function triggerApiLimitModal(detail?: ApiLimitEventDetail): void {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent<ApiLimitEventDetail>(API_LIMIT_EVENT, {
    detail: detail || { providerName: 'AI Provider' },
  });
  window.dispatchEvent(event);
}

/**
 * Subscribes a React component to API limit events.
 */
export function subscribeToApiLimit(callback: (detail: ApiLimitEventDetail) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<ApiLimitEventDetail>;
    callback(customEvent.detail || {});
  };

  window.addEventListener(API_LIMIT_EVENT, handler);
  return () => {
    window.removeEventListener(API_LIMIT_EVENT, handler);
  };
}
