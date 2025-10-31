import { io } from 'socket.io-client';

// Obtener URL base desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL ;

export const socket = io(`${API_URL}/rt`, {
  transports: ['websocket'],       
  withCredentials: true,
  auth: {
    token: localStorage.getItem('token') || undefined,
  },
});

socket.on('connect', () => {
  console.log('✅ Socket conectado:', socket.id);
  console.log('🔗 URL:', API_URL);
});

socket.on('disconnect', () => {
  console.log('❌ Socket desconectado');
});

socket.on('connect_error', (error) => {
  console.error('🔥 Error conexión socket:', error);
  console.error('🔗 Intentando conectar a:', `${API_URL}/rt`);
});

if (typeof window !== 'undefined') {
  (window as any).socket = socket;
}