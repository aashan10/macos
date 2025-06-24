import { For } from "solid-js";
import { useWindowManager } from "../hooks/window-manager";
import { Window } from "./window";

const WindowManager = () => {

    const { activeWindowsArray, closeWindow, setWindowProperty, focusWindow, isFocused } = useWindowManager();

    return (
        <div class="win.manager overflow-hidden">
            <For each={activeWindowsArray()}>
                {(win) => (
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
                        children={win.children}
                        onSetProperty={(property, value) => setWindowProperty(win.id, property, value)}
                        onBringToFront={() => focusWindow(win.id)} />
                )}
            </For>

        </div>
    )
}


export default WindowManager;
