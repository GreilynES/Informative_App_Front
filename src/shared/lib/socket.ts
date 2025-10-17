import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000/rt', {
  transports: ['websocket'],       
  withCredentials: true,
  auth: {
    token: localStorage.getItem('token') || undefined,
  },
});

socket.on('connect', () => {
  console.log('✅ Socket conectado:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Socket desconectado');
});

socket.on('connect_error', (error) => {
  console.error('🔥 Error conexión:', error);
});

if (typeof window !== 'undefined') {
  (window as any).socket = socket;
}