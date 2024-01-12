export default class EventBus {
    private static instance: EventBus;
    private eventListeners: Record<string, Array<Function>> = {};
   
    private constructor() {}
   
    public static getInstance(): EventBus {
      if (!EventBus.instance) {
        EventBus.instance = new EventBus();
      }
      return EventBus.instance;
    }
   
    public subscribe(eventName: string, callback: Function): void {
      if (!this.eventListeners[eventName]) {
        this.eventListeners[eventName] = [];
      }
      this.eventListeners[eventName].push(callback);
    }
   
    public unsubscribe(eventName: string, callback: Function): void {
      const index = this.eventListeners[eventName].indexOf(callback);
      if (index > -1) {
        this.eventListeners[eventName].splice(index, 1);
      }
    }
   
    public emit(eventName: string, data?: any): void {
      if (this.eventListeners[eventName]) {
        this.eventListeners[eventName].forEach((callback) => callback(data));
      }
    }
}
   