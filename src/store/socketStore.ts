import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './authStore';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const SOCKET_URL = 'http://localhost:3000'; // Will be overridden by env

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    const { socket: existingSocket } = get();
    if (existingSocket?.connected) {
      return;
    }

    const token = useAuthStore.getState().token;
    if (!token) {
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
