"use client";
import { useEffect } from "react";

export const useCanvasSync = (canvas, wsRef) => {
  useEffect(() => {
    if (!canvas || !wsRef.current) return;

    let isProcessingUpdate = false;
    let lastUpdateTime = 0;
    const DEBOUNCE_TIME = 100;
    const clientId = Math.random().toString(36).substr(2, 9);

    const handleCanvasModification = () => {
      if (
        isProcessingUpdate ||
        !wsRef.current ||
        wsRef.current.readyState !== WebSocket.OPEN
      )
        return;

      const now = Date.now();
      if (now - lastUpdateTime < DEBOUNCE_TIME) return;
      lastUpdateTime = now;

      const canvasData = canvas.toJSON();
      wsRef.current.send(
        JSON.stringify({
          type: "canvas-update",
          data: {
            version: canvasData.version,
            objects: canvasData.objects,
            background: "#fff",
          },
          sourceClientId: clientId,
          messageId: Math.random().toString(36).substr(2, 9),
        })
      );
    };

    const handleWebSocketMessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "canvas-update") {
          if (message.sourceClientId === clientId) return;

          const currentState = JSON.stringify({
            objects: canvas.toJSON().objects,
            background: "#fff",
          });
          const incomingState = JSON.stringify({
            objects: message.data.objects,
            background: "#fff",
          });

          if (currentState === incomingState) return;

          isProcessingUpdate = true;

          canvas.off("object:modified", handleCanvasModification);
          canvas.off("object:added", handleCanvasModification);
          canvas.off("object:removed", handleCanvasModification);

          canvas.loadFromJSON(
            {
              ...message.data,
              background: "#fff",
            },
            () => {
              canvas.backgroundColor = "#fff";
              canvas.requestRenderAll();

              setTimeout(() => {
                canvas.on("object:modified", handleCanvasModification);
                canvas.on("object:added", handleCanvasModification);
                canvas.on("object:removed", handleCanvasModification);
                isProcessingUpdate = false;
              }, DEBOUNCE_TIME);
            }
          );
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        isProcessingUpdate = false;
      }
    };

    wsRef.current.onmessage = handleWebSocketMessage;

    canvas.on("object:modified", handleCanvasModification);
    canvas.on("object:added", handleCanvasModification);
    canvas.on("object:removed", handleCanvasModification);

    return () => {
      canvas.off("object:modified", handleCanvasModification);
      canvas.off("object:added", handleCanvasModification);
      canvas.off("object:removed", handleCanvasModification);
      if (wsRef.current) {
        wsRef.current.onmessage = null;
      }
    };
  }, [canvas]);
};
