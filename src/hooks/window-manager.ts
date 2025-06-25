import { createMemo, createSignal, onCleanup, type JSXElement } from "solid-js";
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
    componentKey: string;
    maximized?: boolean;
    minimized?: boolean;
    parentApp?: string;
};


const [windows, setWindows] = createStore<Record<string, WindowState>>({});
const [focusedWindow, setFocusedWindow] = createSignal<string | null>(null);
const [nextZIndex, setNextZIndex] = createSignal(100);

const [windowComponentFunctions, setWindowComponentFunctions] = createSignal<Record<string, () => JSXElement>>({});

export const useWindowManager = () => {

    type CreateWindowProps = {
        title: string,
        x: number,
        y: number,
        width: number,
        height: number,
        children?: JSXElement,
        icon?: string,
        parentApp?: string
    };

    const createWindow = (props: CreateWindowProps) => {
        const { title, x, y, width, height, children, icon, parentApp } = props;

        const id = `window-${Date.now()}`;
        const componentKey = `component-${id}`;

        const componentFunc = () => children;

        setWindowComponentFunctions(prev => ({
            ...prev,
            [componentKey]: componentFunc
        }));

        setWindows(id, {
            id,
            icon,
            title,
            x,
            y,
            width,
            height,
            zIndex: getNextZIndex(),
            minimized: false,
            maximized: false,
            parentApp: parentApp,
            componentKey: componentKey
        });

        setFocusedWindow(id);

        return id;
    }

    const getNextZIndex = () => {
        const currentZIndex = nextZIndex();
        setNextZIndex(currentZIndex + 1);
        return currentZIndex;
    }

    const closeWindow = (id: string) => {
        const win = windows[id];

        if (win) {
            setWindowComponentFunctions(prev => {
                const next = { ...prev };
                delete next[win.componentKey];
                return next;
            });
            setWindows(id, undefined!);
        }

        if (focusedWindow() === id) {
            setFocusedWindow(null);
        }
    }

    const setWindowProperty = <K extends keyof WindowState>(id: string, property: K, value: WindowState[K]) => {

        let windowList = windows;
        if (!windowList[id]) return;

        setWindows(id, property, value);
    }

    const focusWindow = (id: string) => {

        console.log("Focusing window", id);
        const windowList = windows;
        if (!windowList[id]) return;

        setWindows(id, 'zIndex', getNextZIndex());
        setWindows(id, 'minimized', false);
        setWindows(id, 'maximized', false);

        setFocusedWindow(id);
    }

    const isFocused = (id: string) => {
        return focusedWindow() === id;
    }

    const activeWindow = createMemo(() => {
        const fcWindow = focusedWindow();
        if (!fcWindow) return null;

        const windowsList = windows;
        if (!windowsList[fcWindow]) return null;

        return windowsList[fcWindow];
    });

    const onMinimizeWindow = (event: CustomEvent) => {
        const id = event.detail.id;

        if (!windows[id]) return;
        setWindows(id, 'minimized', true);
        setWindows(id, 'maximized', false);
    }

    const onMaximizeWindow = (event: CustomEvent) => {
        const id = event.detail.id;

        if (!windows[id]) return;

        setWindows(id, 'minimized', false);
        setWindows(id, 'maximized', !windows[id].maximized);
    }

    const onRestoreWindow = (event: CustomEvent) => {
        const id = event.detail.id;

        if (!windows[id]) return;
        setWindows(id, 'minimized', false);
        setWindows(id, 'maximized', false);
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
        windowComponentFunctions,
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
