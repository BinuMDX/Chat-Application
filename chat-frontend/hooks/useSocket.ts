'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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

  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  }, [onMessage, onConnect, onDisconnect, onError]);

  useEffect(() => {
    if (!token) {
      console.log('No token available, skipping socket connection');
      return;
    }

    console.log('Initializing socket connection...');


    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3033', {
      auth: {
        token,
      },
      query: {
        token, 
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      setConnectionError(null);
      onConnectRef.current?.();
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      onDisconnectRef.current?.();
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
      onErrorRef.current?.(error);
    });

    socket.on('message', (message) => {
      console.log('Received message:', message);
      onMessageRef.current?.(message);
    });

    return () => {
      console.log('Cleaning up socket connection');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('message');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const joinRoom = (conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join', { conversationId });
      console.log('Joined room:', conversationId);
    } else {
      console.warn('Socket not connected, cannot join room');
    }
  };

  const leaveRoom = (conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave', { conversationId });
      console.log('Left room:', conversationId);
    }
  };

  const sendMessage = (conversationId: string, content: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message', {
        conversationId,
        text: content,
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
