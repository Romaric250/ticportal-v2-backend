let ioInstance = null;
export function registerSocketServer(io) {
    ioInstance = io;
}
export function getIO() {
    return ioInstance;
}
//# sourceMappingURL=ioHolder.js.map