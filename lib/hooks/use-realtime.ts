'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { OperationalSnapshot } from '../services/types';

export function useRealtime() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [snapshot, setSnapshot] = useState<OperationalSnapshot | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const wsUrl = apiUrl.replace('/api', '');

    const newSocket = io(wsUrl, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    newSocket.on('snapshot-update', (data: OperationalSnapshot) => {
      setSnapshot(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, snapshot, connected };
}

