import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const WebSocketComponent = () => {
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket(API_URL + '/ws');

      ws.onopen = () => {
        console.log('WebSocket Connected');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        setMessage(event.data);
      };

      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setIsConnected(false);
        setTimeout(connectWebSocket, 5000);  // Intenta reconectar cada 5 segundos
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <p className="text-lg mb-2">{isConnected ? 'Connected' : 'Disconnected'}</p>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default WebSocketComponent;