"use client";
import { useEffect } from "react";

export const useWebSocket = (wsRef) => {
  useEffect(() => {
    const wsUrl =
      process.env.NODE_ENV === "production"
        ? "wss://your-production-url"
        : "ws://localhost:3001";

    const setupWebSocket = () => {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed");
        setTimeout(setupWebSocket, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    setupWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);
};
