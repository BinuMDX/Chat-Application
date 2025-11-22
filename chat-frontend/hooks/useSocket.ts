'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  token: string | null;
  onMessage?: (message: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useSocket = (options: UseSocketOptions) => {
  const { token, onMessage, onConnect, onDisconnect, onError } = options;
  
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    // Create socket connection with token
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3033', {
      auth: {
        token,
      },
      query: {
        token, // Also send in query for compatibility with Postman testing
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      setConnectionError(null);
      onConnect?.();
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
      onError?.(error);
    });

    // Message handler
    socket.on('message', (message) => {
      console.log('Received message:', message);
      onMessage?.(message);
    });

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up socket connection');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('message');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, onMessage, onConnect, onDisconnect, onError]);

  // Join a conversation room
  const joinRoom = (conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join', { conversationId });
      console.log('Joined room:', conversationId);
    } else {
      console.warn('Socket not connected, cannot join room');
    }
  };

  // Leave a conversation room (optional)
  const leaveRoom = (conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave', { conversationId });
      console.log('Left room:', conversationId);
    }
  };

  // Send a message
  const sendMessage = (conversationId: string, content: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message', {
        conversationId,
        content,
      });
      console.log('Sent message:', { conversationId, content });
    } else {
      console.warn('Socket not connected, cannot send message');
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    joinRoom,
    leaveRoom,
    sendMessage,
  };
};
