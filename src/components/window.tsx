import { createEffect, createMemo, createSignal, onCleanup, type JSXElement } from "solid-js";
import type { WindowState } from "../hooks/window-manager";

type WindowProps = Omit<WindowState, 'children' | 'componentKey'> & {
    onClose: (id: string) => void;
    onSetProperty: <K extends keyof WindowState>(property: K, value: WindowState[K]) => void;
    onBringToFront: (id: string) => void;
    isFocused: (id: string) => boolean;
    minimized?: boolean; // Optional prop for minimized state
    children: JSXElement; // Optional children for the window content
};

const InteractionType = {
    None: 0,
    Dragging: 1,
    ResizingNW: 2,
    ResizingNE: 3,
    ResizingSW: 4,
    ResizingSE: 5,
    ResizingN: 6,
    ResizingE: 7,
    ResizingS: 8,
    ResizingW: 9,
}

export const Window = (props: WindowProps) => {
    const { id, x, y, width, height, zIndex, onClose, onSetProperty, onBringToFront, isFocused, minimized, children } = props;
    const [position, setPosition] = createSignal<{ x: number, y: number }>({ x: x, y: y });
    const [size, setSize] = createSignal<{ width: number, height: number }>({ width: width, height: height });

    const isWindowFocused = createMemo(() => isFocused(id));

    const [interaction, setInteraction] = createSignal<number>(InteractionType.None);
    const [initialMouseX, setInitialMouseX] = createSignal(0);
    const [initialMouseY, setInitialMouseY] = createSignal(0);
    const [initialWindowX, setInitialWindowX] = createSignal(0);
    const [initialWindowY, setInitialWindowY] = createSignal(0);
    const [initialWindowWidth, setInitialWindowWidth] = createSignal(0);
    const [initialWindowHeight, setInitialWindowHeight] = createSignal(0);
    const [zInd, setZIndex] = createSignal(zIndex);

    createEffect(() => {
        if (interaction() === InteractionType.None) {
            setZIndex(props.zIndex);
        }
    });

    const handleMouseDown = (e: MouseEvent, type: number) => {
        // Prevent default browser behavior like text selection during drag/resize
        e.preventDefault();
        // Stop propagation to ensure only this specific element handles the event

        if (!isWindowFocused()) {
            onBringToFront(id); // Bring the window to front on any interaction
            return;
        }


        // onBringToFront(id); // Bring the window to front on any interaction
        setInteraction(type);
        setInitialMouseX(e.clientX);
        setInitialMouseY(e.clientY);
        setInitialWindowX(position().x); // Use current props for initial position
        setInitialWindowY(position().y);
        setInitialWindowWidth(size().width); // Use current props for initial dimensions
        setInitialWindowHeight(size().height);
    };

    const handleMouseMove = (e: MouseEvent) => {
        // Only proceed if an interaction (dragging or resizing) is active
        if (interaction() === InteractionType.None) return;

        // Uncomment the line below for very detailed (but noisy) debugging of mouse movement
        // console.log(`[Window ${id}] MouseMove: interaction=${interaction()} (Enum value), clientX=${e.clientX}, clientY=${e.clientY}`);

        const deltaX = e.clientX - initialMouseX();
        const deltaY = e.clientY - initialMouseY();

        switch (interaction()) {
            case InteractionType.Dragging:
                setPosition({ x: initialWindowX() + deltaX, y: initialWindowY() + deltaY });
                break;
            case InteractionType.ResizingNW:
                setPosition({ x: initialWindowX() + deltaX, y: initialWindowY() + deltaY });
                setSize({
                    width: Math.max(100, initialWindowWidth() - deltaX), // Min width 100px
                    height: Math.max(100, initialWindowHeight() - deltaY), // Min height 100px
                });
                break;
            case InteractionType.ResizingNE:
                setPosition({ x: initialWindowX(), y: initialWindowY() + deltaY });
                setSize({
                    width: Math.max(100, initialWindowWidth() + deltaX), // Min width 100px
                    height: Math.max(100, initialWindowHeight() - deltaY), // Min height 100px
                });
                break;
            case InteractionType.ResizingSW:
                setPosition({ x: initialWindowX() + deltaX, y: initialWindowY() });
                setSize({
                    width: Math.max(100, initialWindowWidth() - deltaX), // Min width 100px
                    height: Math.max(100, initialWindowHeight() + deltaY), // Min height 100px
                });
                break;
            case InteractionType.ResizingSE:
                setSize({
                    width: Math.max(100, initialWindowWidth() + deltaX), // Min width 100px
                    height: Math.max(100, initialWindowHeight() + deltaY), // Min height 100px
                });
                break;
            case InteractionType.ResizingN:
                setPosition({ x: initialWindowX(), y: initialWindowY() + deltaY });
                setSize({
                    width: initialWindowWidth(), // Width remains unchanged
                    height: Math.max(100, initialWindowHeight() - deltaY), // Min height 100px
                });
                break;
            case InteractionType.ResizingE:
                setSize({
                    width: Math.max(100, initialWindowWidth() + deltaX), // Min width 100px
                    height: initialWindowHeight(), // Height remains unchanged
                });
                break;
            case InteractionType.ResizingS:
                setSize({
                    width: initialWindowWidth(), // Width remains unchanged
                    height: Math.max(100, initialWindowHeight() + deltaY), // Min height 100px
                });
                onSetProperty('height', Math.max(100, initialWindowHeight() + deltaY));
                break;
            case InteractionType.ResizingW:
                setPosition({ x: initialWindowX() + deltaX, y: initialWindowY() });
                setSize({
                    width: Math.max(100, initialWindowWidth() - deltaX), // Min width 100px
                    height: initialWindowHeight(), // Height remains unchanged
                });
                break;
        }
    };

    const handleMouseUp = () => {
        if (interaction() !== InteractionType.None) {
            console.log(`[Window ${id}] MouseUp: interaction=${interaction()} (Enum value)`);
        }
        setInteraction(InteractionType.None);

        onSetProperty('x', position().x);
        onSetProperty('y', position().y);
        onSetProperty('width', size().width);
        onSetProperty('height', size().height);

    };

    // Attach global event listeners to the document for mousemove and mouseup.
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Clean up these global event listeners when the component is unmounted
    onCleanup(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    });

    const close = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClose(id);
    }

    return (
        <div onMouseDown={() => { !isWindowFocused() && onBringToFront(id) }} class={`${minimized ? 'hidden' : 'absolute overflow-hidden window rounded-xl flex flex-col shadow-md/30 '}`}
            style={{
                left: `${position().x}px`,
                top: `${position().y}px`,
                width: `${size().width}px`,
                height: `${size().height}px`,
                'z-index': zInd(),
            }}>
            {/* Title bar - Drag Handle */}
            <div class="p-2 flex flex-row items-center gap-5 rounded-t-xl" style={{ 'z-index': zInd() + 1 }}>
                <div class="flex gap-1">
                    <button style={{ 'z-index': zInd() + 2 }} class={`h-3 w-3 rounded-full ${isWindowFocused() ? 'bg-red-500' : 'bg-stone-500'}`} onMouseDown={close}></button>
                    <button style={{ 'z-index': zInd() + 2 }} class={`h-3 w-3 rounded-full ${isWindowFocused() ? 'bg-yellow-500' : 'bg-stone-500'}`} onMouseDown={() => window.dispatchEvent(new CustomEvent('minimize-window', {
                        detail: { id: props.id }
                    }))}></button>
                    <button style={{ 'z-index': zInd() + 2 }} class={`h-3 w-3 rounded-full ${isWindowFocused() ? 'bg-green-500' : 'bg-stone-500'}`} onMouseDown={() => window.dispatchEvent(new CustomEvent('maximize-window', {
                        detail: { id: props.id }
                    }))}></button>
                </div>
                <div style={{ 'z-index': zInd() + 5 }} onDblClick={() => {

                    window.dispatchEvent(new CustomEvent('maximize-window', {
                        detail: { id: props.id }
                    }));
                }} onMouseDown={(e) => handleMouseDown(e, InteractionType.Dragging)} class="w-full bg-transparent flex flex-row min-h-4">

                </div>
            </div>

            <div class="flex flex-col overflow-hidden h-full w-full">
                {children}
            </div>

            {/* Resize Handles (Increased size for easier interaction and better visibility) */}
            <div class="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize"
                onMouseDown={(e) => handleMouseDown(e, InteractionType.ResizingNW)}
                style={{ 'z-index': zInd() + 1 }} />
            <div class="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize"
                onMouseDown={(e) => handleMouseDown(e, InteractionType.ResizingNE)}
                style={{ 'z-index': zInd() + 1 }} />
            <div class="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize"
                onMouseDown={(e) => handleMouseDown(e, InteractionType.ResizingSW)}
                style={{ 'z-index': zInd() + 1 }} />
            <div class="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize"
                onMouseDown={(e) => handleMouseDown(e, InteractionType.ResizingSE)}
                style={{ 'z-index': zInd() + 1 }} />
            <div class="absolute bottom-0 left-3 right-3 h-2 cursor-ns-resize" // Adjusted left/right for corner handles
                onMouseDown={(e) => handleMouseDown(e, InteractionType.ResizingS)} />
            <div class="absolute right-0 top-3 bottom-3 w-2 cursor-ew-resize" // Adjusted top/bottom for corner handles
                onMouseDown={(e) => handleMouseDown(e, InteractionType.ResizingE)} />
            <div class="absolute left-0 top-3 bottom-3 w-2 cursor-ew-resize" // Adjusted top/bottom for corner handles
                onMouseDown={(e) => handleMouseDown(e, InteractionType.ResizingW)} />
            <div class="absolute top-0 left-3 right-3 h-2 cursor-ns-resize" // Top resize handle, adjusted left/right
                onMouseDown={(e) => handleMouseDown(e, InteractionType.ResizingN)} />
        </div >
    );
};
