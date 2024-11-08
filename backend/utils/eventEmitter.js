const EventEmitter = require('events');
const logger = require('./logger');

class AppEventEmitter extends EventEmitter {
  emit(event, ...args) {
    logger.debug('Event emitted', { event, args });
    return super.emit(event, ...args);
  }

  onWithLog(event, listener) {
    this.on(event, (...args) => {
      logger.debug('Event handled', { event, args });
      return listener(...args);
    });
  }
}

const eventEmitter = new AppEventEmitter();

module.exports = eventEmitter;
