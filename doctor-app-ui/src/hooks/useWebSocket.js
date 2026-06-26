import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'http://localhost:8080/ws';

export function useWebSocket(appointmentId, onMessageReceived, onReadReceipt, onTyping) {
  const clientRef = useRef(null);
  const connectedRef = useRef(false);

  const connect = useCallback(() => {
    if (!appointmentId || connectedRef.current) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = new SockJS(`${WS_URL}?token=${token}`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        connectedRef.current = true;

        client.subscribe(`/topic/chat/${appointmentId}`, (msg) => {
          if (onMessageReceived) {
            onMessageReceived(JSON.parse(msg.body));
          }
        });

        client.subscribe(`/topic/chat/${appointmentId}/read`, () => {
          if (onReadReceipt) onReadReceipt();
        });

        client.subscribe(`/topic/chat/${appointmentId}/typing`, (msg) => {
          if (onTyping) onTyping(JSON.parse(msg.body));
        });
      },
      onDisconnect: () => {
        connectedRef.current = false;
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        connectedRef.current = false;
      },
    });

    client.activate();
    clientRef.current = client;
  }, [appointmentId, onMessageReceived, onReadReceipt, onTyping]);

  useEffect(() => {
    connect();
    return () => {
      connectedRef.current = false;
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [connect]);

  const sendTyping = useCallback((typing) => {
    if (clientRef.current?.connected && appointmentId) {
      const userId = localStorage.getItem('userId');
      clientRef.current.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({ appointmentId, userId: Number(userId), typing }),
      });
    }
  }, [appointmentId]);

  return { sendTyping };
}