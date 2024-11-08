const EventEmitter = require('events');
const logger = require('./logger');

class AppEventEmitter extends EventEmitter {
  emit(event, ...args) {
    logger.info('Event emitted', { event, args });
    return super.emit(event, ...args);
  }

  onWithLog(event, listener) {
    this.on(event, (...args) => {
      logger.info('Event handled', { event, args });
      listener(...args);
    });
  }
}

module.exports = new AppEventEmitter();
