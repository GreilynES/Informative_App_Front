import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000/rt', {
  transports: ['websocket'],       
  withCredentials: true,
  // Si usas JWT:
  auth: {
    token: localStorage.getItem('token') || undefined,
  },
});
