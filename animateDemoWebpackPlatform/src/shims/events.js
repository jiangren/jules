function EventEmitter() {
    this._events = {};
}

EventEmitter.prototype.on = function (event, listener) {
    if (!this._events[event]) {
        this._events[event] = [];
    }
    this._events[event].push(listener);
    return this;
};

EventEmitter.prototype.removeListener = function (event, listener) {
    if (!this._events[event]) return this;
    this._events[event] = this._events[event].filter(l => l !== listener);
    return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.emit = function (event, ...args) {
    if (!this._events[event]) return false;
    this._events[event].forEach(l => l.apply(this, args));
    return true;
};

EventEmitter.prototype.once = function (event, listener) {
    const onceWrapper = (...args) => {
        this.removeListener(event, onceWrapper);
        listener.apply(this, args);
    };
    return this.on(event, onceWrapper);
};

EventEmitter.prototype.addListener = EventEmitter.prototype.on;
EventEmitter.prototype.removeAllListeners = function (event) {
    if (event) {
        delete this._events[event];
    } else {
        this._events = {};
    }
    return this;
};

module.exports = EventEmitter;
