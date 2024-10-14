import React, { useState, useEffect } from 'react';

const WebSocketComponent = () => {
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws');
    setWs(websocket);

    websocket.onmessage = (event) => {
      setMessage(event.data);
    };

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">WebSocket Message2</h1>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default WebSocketComponent;