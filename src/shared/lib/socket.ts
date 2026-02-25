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

});

socket.on('disconnect', () => {
});

socket.on('connect_error', (_error) => {

});

if (typeof window !== 'undefined') {
  (window as any).socket = socket;
}