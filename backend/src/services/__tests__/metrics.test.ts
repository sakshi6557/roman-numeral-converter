import { requestCount, httpRequestDurationMicroseconds, register } from '../metrics';

describe('Metrics Service', () => {
  beforeEach(() => {
    // Reset metrics before each test
    requestCount.reset();
    httpRequestDurationMicroseconds.reset();
  });

  it('increments request count', async () => {
    const initialCount = await requestCount.get();
    expect(initialCount.values[0].value).toBe(0);

    requestCount.inc();
    const newCount = await requestCount.get();
    expect(newCount.values[0].value).toBe(1);
  });

  it('records request duration', async () => {
    const start = process.hrtime();
    const duration = 0.1; // seconds

    // Simulate a request
    const end = process.hrtime(start);
    const durationInSeconds = (end[0] * 1e9 + end[1]) / 1e9;
    
    httpRequestDurationMicroseconds
      .labels('GET', '/romannumeral', '200')
      .observe(durationInSeconds);

    const metrics = await httpRequestDurationMicroseconds.get();
    expect(metrics.values[0].value).toBeGreaterThanOrEqual(duration);
  });

  test('register contains all metrics', async () => {
    const metrics = await register.metrics();
    expect(metrics).toContain('roman_numeral_requests_total');
    expect(metrics).toContain('http_request_duration_ms');
  });
}); 