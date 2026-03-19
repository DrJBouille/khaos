type Handler = (data: any) => void;

class TaskSignalingService {
  private socket?: WebSocket;
  private connecting = false;
  private handlers: Handler[] = [];

  connect(taskId: string) {
    if (this.socket?.readyState === WebSocket.OPEN || this.connecting) return;

    this.connecting = true;

    this.socket = new WebSocket(
      import.meta.env.VITE_WS_URL + `/task/${taskId}`
    );

    this.socket.onopen = () => {
      this.connecting = false;
    };

    this.socket.onmessage = (event) => {
      console.log(event)
      try {
        const data = JSON.parse(event.data);

        this.handlers.forEach(handler => {
          try {
            handler(data);
          } catch (e) {
            console.error('Handler error:', e);
          }
        });
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connecting = false;
    };

    this.socket.onclose = () => {
      this.connecting = false;
    };
  }

  onMessage(handler: Handler) {
    this.handlers.push(handler);
  }

  disconnect() {
    this.socket?.close();
    this.socket = undefined;
  }
}

export const taskSignalingService = new TaskSignalingService();
