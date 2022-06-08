declare type Listener = (event?: DispatcherEvent) => void;
interface DispatcherEvent {
    type: string;
    [key: string]: any;
}
declare class EventDispatcher {
    private _listeners;
    addEventListener(type: string, listener: Listener): void;
    removeEventListener(type: string, listener: Listener): void;
    removeAllEventListeners(type?: string): void;
    dispatchEvent(event: DispatcherEvent): void;
}
