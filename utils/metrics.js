const { performance } = require('perf_hooks');
const logger = require('./logger');

class Metrics {
  constructor() {
    this.metrics = new Map();
  }

  startTimer(name) {
    this.metrics.set(name, performance.now());
  }

  endTimer(name) {
    const start = this.metrics.get(name);
    if (!start) return;
    
    const duration = performance.now() - start;
    this.metrics.delete(name);
    
    logger.info('Metric recorded', {
      name,
      duration: `${duration.toFixed(2)}ms`
    });
    
    return duration;
  }

  increment(name, value = 1) {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + value);
    
    logger.info('Counter incremented', {
      name,
      value: current + value
    });
  }

  getValue(name) {
    return this.metrics.get(name);
  }

  clear() {
    this.metrics.clear();
  }
}

module.exports = new Metrics();
