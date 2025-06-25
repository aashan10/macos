// components/window-manager.tsx

import { For, type JSXElement } from "solid-js";
import { useWindowManager, type WindowState } from "../hooks/window-manager";
import { Window } from "./window";
import { AppProvider } from "../hooks/app-context";
import { Dynamic } from "solid-js/web";

const WindowManager = () => {
    const { activeWindowsArray, closeWindow, setWindowProperty, focusWindow, isFocused, createWindow, windowComponentFunctions } = useWindowManager();

    return (
        <div class="win.manager overflow-hidden">
            <For each={activeWindowsArray()}>
                {(win) => {

                    const componentToRender = windowComponentFunctions()[win.componentKey];

                    const requestWindow = (props: WindowState & { children: JSXElement }) => {
                        return createWindow({
                            title: props.title,
                            x: win.x + 50,
                            y: win.y + 50,
                            width: props.width || 800,
                            height: props.height || 600,
                            children: props.children,
                            icon: win.icon,
                            parentApp: win.id
                        });
                    }

                    const getWindowInfo = () => {
                        return win;
                    }

                    return (
                        <AppProvider value={{ requestWindow, getWindowInfo }}>
                            <Window
                                id={win.id}
                                title={win.title}
                                x={win.maximized ? 0 : win.x}
                                y={win.maximized ? 0 : win.y}
                                width={win.maximized ? window.innerWidth : win.width}
                                height={win.maximized ? window.innerHeight : win.height}
                                zIndex={win.zIndex}
                                onClose={() => closeWindow(win.id)}
                                isFocused={isFocused}
                                onSetProperty={(property, value) => setWindowProperty(win.id, property, value)}
                                onBringToFront={() => focusWindow(win.id)}
                                minimized={win.minimized}

                            >
                                {componentToRender && <Dynamic component={componentToRender} />}
                            </Window>
                        </AppProvider>
                    )
                }}
            </For>
        </div>
    )
}

export default WindowManager;
