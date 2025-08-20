import { io } from 'socket.io-client';

console.log('Connecting to', import.meta.env.VITE_SOCKET_URL);
// Read WebSocket URL from .env, fallback to same origin
const socket = io(import.meta.env.VITE_SOCKET_URL);

export default socket;
