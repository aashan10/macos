import { createMemo, createSignal } from "solid-js";

type WindowState = {
    id: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    children?: any;
};


const [windows, setWindows] = createSignal<WindowState[]>([]);
const [focusedWindow, setFocusedWindow] = createSignal<string | null>(null);
const [nextZIndex, setNextZIndex] = createSignal(100);

export const useWindowManager = () => {

    const createWindow = (title: string, x: number, y: number, width: number, height: number, children?: any) => {
        const id = `window-${Date.now()}`;

        const newWindow: WindowState = {
            id,
            title,
            x,
            y,
            width,
            height,
            zIndex: nextZIndex(),
            children: children || null,
        };

        setWindows(prev => [...prev, newWindow]);
        setNextZIndex(prev => prev + 1);
        setFocusedWindow(id);
    }

    const closeWindow = (id: string) => {
        setWindows(prev => prev.filter(win => win.id !== id));
    }

    const setWindowProperty = <K extends keyof WindowState>(id: string, property: K, value: WindowState[K]) => {
        const window = windows().filter(win => win.id === id)[0] ?? null;
        if (!window) return;

        const existingProperty = window[property];
        if (existingProperty === value) return; // No change needed

        setWindows(prev => {
            return prev.map(win => {
                if (win.id === id) {
                    return { ...win, [property]: value };
                }
                return win;
            });
        });
    }

    const focusWindow = (id: string) => {
        setWindows(prev => {
            const focusedWindow = prev.find(win => win.id === id);
            if (!focusedWindow) return prev;

            // Increase zIndex of the focused window
            const newZIndex = nextZIndex();
            setNextZIndex(newZIndex + 1);

            return prev.map(win => {
                if (win.id === id) {
                    return { ...win, zIndex: newZIndex };
                }
                return win;
            });
        });
        setFocusedWindow(id);
    }

    const isFocused = (id: string) => {
        return focusedWindow() === id;
    }

    const activeWindow = createMemo(() => {
        return windows().find(win => win.id === focusedWindow()) || null;
    });


    return {
        windows,
        createWindow,
        closeWindow,
        setWindowProperty,
        focusWindow,
        isFocused,
        focusedWindow,
        activeWindow,
    }
}

export type { WindowState };
