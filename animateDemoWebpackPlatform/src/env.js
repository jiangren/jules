const isDev = true;

if (typeof window !== 'undefined') {
    window.__DEV__ = isDev;
    if (!window.process) window.process = { env: { NODE_ENV: 'development' } };
}
if (typeof global !== 'undefined') {
    global.__DEV__ = isDev;
    if (!global.process) global.process = { env: { NODE_ENV: 'development' } };
}
if (typeof self !== 'undefined') {
    self.__DEV__ = isDev;
}
