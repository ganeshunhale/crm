import { useEffect, useRef, useCallback } from "react";

export function useWebSocket(url) {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const manuallyClosed = useRef(false);
  const reconnectAttempts = useRef(0);
  const messageQueue = useRef([]);

  const connect = useCallback(() => {
    if (!url || socketRef.current) return;
    console.log({url})
    manuallyClosed.current = false;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      reconnectAttempts.current = 0;
      console.log("✅ Connected");
      //   onOpen?.(event);
      messageQueue.current.forEach((msg) => {
        socket.send(typeof msg === "string" ? msg : JSON.stringify(msg));
      });
      messageQueue.current = [];
    };

    // socket.onmessage = (event) => {
    //   onMessage?.(event); // delegate parsing to component
    // };

    socket.onerror = (err) => {
      //   onError?.(event);
      console.error("⚠️ Error:", err)
    };

    socket.onclose = () => {
      console.log("❌ Disconnected")

      // Reconnect if not closed manually
      if (!manuallyClosed.current) {
        const timeout = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          connect();
        }, timeout);
      }
    };
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      // manuallyClosed.current = true;
      clearTimeout(reconnectTimeoutRef.current);
      //   socketRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((msg) => {
    const socketInstance = socketRef.current;
    if (socketInstance?.readyState === WebSocket.OPEN) {
      socketInstance.send(typeof msg === "string" ? msg : JSON.stringify(msg));
    } else {
      messageQueue.current.push(msg);
      console.warn("WebSocket not open yet, message not sent", msg);
    }
  }, []);

  const closeSocket = useCallback(() => {
    manuallyClosed.current = true;
    clearTimeout(reconnectTimeoutRef.current);
    socketRef.current?.close();
  }, []);

  return { socket: socketRef, sendMessage, closeSocket };
}
