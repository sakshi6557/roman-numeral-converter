/**
 * OpenTelemetry configuration for distributed tracing.
 * Sets up tracing for the Roman Numeral Converter service.
 * 
 * @module traces
 * @category Observability
 * 
 * @description
 * This module configures OpenTelemetry for distributed tracing, allowing us to:
 * - Track requests across service boundaries
 * - Monitor performance and latency
 * - Debug issues in production
 * - Analyze service dependencies
 * 
 * The configuration includes:
 * - OTLP HTTP exporter for sending traces to Jaeger
 * - Automatic instrumentation for Node.js
 * - Service name and resource attributes
 * - Graceful shutdown handling
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

/**
 * OpenTelemetry SDK instance
 * Configures and manages tracing for the application
 * 
 * @type {NodeSDK}
 * @private
 */
const sdk = new NodeSDK({
  /**
   * OTLP HTTP exporter configuration
   * Sends traces to Jaeger collector
   */
  traceExporter: new OTLPTraceExporter({
    url: 'http://jaeger:4318/v1/traces',
  }),
  
  /**
   * Automatic instrumentation
   * Captures traces for common Node.js operations
   */
  instrumentations: [getNodeAutoInstrumentations()],
  
  /**
   * Service name for tracing
   * Used to identify this service in distributed traces
   */
  serviceName: 'roman-numeral-service'
});

// Start the SDK
sdk.start();

/**
 * Graceful shutdown handler
 * Ensures traces are properly flushed before process exit
 * 
 * @param {string} signal - The signal that triggered the shutdown
 * @returns {Promise<void>}
 */
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error shutting down OpenTelemetry SDK:', error);
      process.exit(1);
    });
});

export default sdk;