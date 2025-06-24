import { createMemo, createSignal, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

type WindowState = {
    id: string;
    icon?: string; // Optional icon for the window
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    children?: any;
    maximized?: boolean;
    minimized?: boolean;
};


const [windows, setWindows] = createStore<Record<string, WindowState>>({});
const [focusedWindow, setFocusedWindow] = createSignal<string | null>(null);
const [nextZIndex, setNextZIndex] = createSignal(100);

export const useWindowManager = () => {

    const createWindow = (title: string, x: number, y: number, width: number, height: number, children?: any, icon?: string) => {
        const id = `window-${Date.now()}`;

        setWindows(prev => {

            return {
                ...prev,
                [id]: {
                    id,
                    icon,
                    title,
                    x,
                    y,
                    width,
                    height,
                    zIndex: getNextZIndex(),
                    children: children || null,
                    maximized: false, // Default to not maximized
                    minimized: false, // Default to not minimized
                }
            };
        });
        setFocusedWindow(id);
    }

    const getNextZIndex = () => {
        const currentZIndex = nextZIndex();
        setNextZIndex(currentZIndex + 1);
        return currentZIndex;
    }

    const closeWindow = (id: string) => {
        // @ts-ignore 
        setWindows(id, undefined);

        if (focusedWindow() === id) {
            setFocusedWindow(null); // Clear focused window if the closed window was focused
        }
    }

    const setWindowProperty = <K extends keyof WindowState>(id: string, property: K, value: WindowState[K]) => {

        let windowList = windows;
        if (!windowList[id]) return; // If the window doesn't exist, do nothing 

        const window = windowList[id];
        const existingProperty = window[property];
        if (existingProperty === value) return; // No change needed

        windowList = { ...windowList, [id]: { ...window, [property]: value, maximized: false, minimized: false } };

        setWindows(windowList);
    }

    const focusWindow = (id: string) => {

        const windowList = windows;
        if (!windowList[id]) return; // If the window doesn't exist, do nothing

        setWindows(prev => {
            return {
                ...prev, [id]: {
                    ...prev[id],
                    zIndex: getNextZIndex(),
                    minimized: false, // Ensure the window is not minimized when focused
                    maximized: false, // Ensure the window is not maximized when focused
                }
            };
        });

        setFocusedWindow(id);
    }

    const isFocused = (id: string) => {
        return focusedWindow() === id;
    }

    const activeWindow = createMemo(() => {
        const fcWindow = focusedWindow();
        if (!fcWindow) return null; // If no window is focused, return null

        const windowsList = windows;
        if (!windowsList[fcWindow]) return null; // If the focused window doesn't exist, return null 

        return windowsList[fcWindow];
    });

    const onMinimizeWindow = (event: CustomEvent) => {
        const id = event.detail.id;

        setWindows(prev => {
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    minimized: true,
                    maximized: false, // Ensure maximized is false when minimized
                }
            }
        })
    }

    const onMaximizeWindow = (event: CustomEvent) => {
        const id = event.detail.id;

        setWindows(prev => {
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    maximized: !prev[id].maximized, // Toggle maximized state
                    minimized: false, // Ensure minimized is false when maximized
                }
            }
        })
    }

    const onRestoreWindow = (event: CustomEvent) => {
        const id = event.detail.id;


        setWindows(prev => {
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    maximized: false, // Ensure maximized is false when restored
                    minimized: false, // Ensure minimized is false when restored
                }
            }
        })
    }

    // @ts-ignore
    window.addEventListener('minimize-window', onMinimizeWindow);

    // @ts-ignore
    window.addEventListener('restore-window', onRestoreWindow);

    // @ts-ignore
    window.addEventListener('maximize-window', onMaximizeWindow);

    onCleanup(() => {

        // @ts-ignore
        window.removeEventListener('minimize-window', onMinimizeWindow);

        // @ts-ignore
        window.removeEventListener('restore-window', onRestoreWindow);

        // @ts-ignore
        window.removeEventListener('maximize-window', onMaximizeWindow);
    });

    const activeWindows = createMemo(() => {

        // active windows are those that are not minimized 
        let activeWindows: Record<string, WindowState> = {};

        for (let k of Object.keys(windows)) {
            const win = windows[k];
            if (!win.minimized) {
                activeWindows[k] = win;
            }
        }

        console.log("Active Windows", activeWindows);
        return activeWindows;
    });

    const activeWindowsArray = createMemo(() => {
        return Object.values(activeWindows());
    });

    const inactiveWindows = createMemo(() => {
        // inactive windows are those that are minimized 

        let inactiveWindows: Record<string, WindowState> = {};
        const windowList = windows;
        for (let k of Object.keys(windowList)) {
            const win = windowList[k];
            if (win.minimized) {
                inactiveWindows[k] = win;
            }
        }

        return inactiveWindows;
    });

    const inactiveWindowsArray = createMemo(() => Object.values(inactiveWindows()));

    const windowsArray = createMemo(() => Object.values(windows));

    return {
        windows,
        windowsArray,
        createWindow,
        closeWindow,
        setWindowProperty,
        focusWindow,
        isFocused,
        focusedWindow,
        activeWindow,
        activeWindows,
        activeWindowsArray,
        inactiveWindows,
        inactiveWindowsArray,
    }
}

export type { WindowState };
