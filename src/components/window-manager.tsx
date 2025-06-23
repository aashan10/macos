import { For } from "solid-js";
import { useWindowManager } from "../hooks/window-manager";
import { Window } from "./window";

const WindowManager = () => {

    const { windows, closeWindow, setWindowProperty, focusWindow, isFocused } = useWindowManager();

    return (
        <div class="window-manager overflow-hidden">
            <For each={windows()}>
                {(window) => (
                    <Window
                        id={window.id}
                        title={window.title}
                        x={window.x}
                        y={window.y}
                        width={window.width}
                        height={window.height}
                        zIndex={window.zIndex}
                        onClose={closeWindow}
                        isFocused={isFocused}
                        children={window.children}
                        onSetProperty={(property, value) => setWindowProperty(window.id, property, value)}
                        onBringToFront={() => focusWindow(window.id)} />
                )}
            </For>

        </div>
    )
}


export default WindowManager;
