/**
 * Service for handling Prometheus metrics.
 * Provides counters and histograms for monitoring the application's performance and usage.
 * 
 * @module metrics
 * @category Services
 */

import { Registry, Counter, Histogram } from 'prom-client';

/**
 * Prometheus metrics registry
 * Central registry for all metrics in the application
 * 
 * @type {Registry}
 * @private
 */
const register = new Registry();

/**
 * Counter for tracking the total number of Roman numeral conversion requests
 * Increments each time a conversion request is made
 * 
 * @type {Counter}
 * @example
 * // Increment the counter
 * requestCount.inc();
 */
export const requestCount = new Counter({
  name: 'roman_numeral_requests_total',
  help: 'Total number of Roman numeral conversion requests',
  registers: [register],
});

/**
 * Histogram for tracking HTTP request durations
 * Records the duration of each HTTP request in milliseconds
 * Includes labels for method, route, and status code
 * 
 * @type {Histogram}
 * @example
 * // Record request duration
 * const start = Date.now();
 * // ... handle request ...
 * httpRequestDurationMicroseconds.observe(Date.now() - start);
 */
export const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  registers: [register],
});

export { register }; 