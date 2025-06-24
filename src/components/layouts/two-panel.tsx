import type { JSX } from "solid-js";
import { Show, createSignal, onCleanup, onMount, createEffect } from "solid-js";

type TwoPanelLayoutProps = {
    sidebar: JSX.Element;
    content: JSX.Element;
    class?: string;
    sidebarClass?: string;
    contentClass?: string;
    showDivider?: boolean;
    /** The initial width of the sidebar in pixels. Defaults to 240. */
    initialWidth?: number;
    /** The minimum width the sidebar can be resized to. Defaults to 150. */
    minWidth?: number;
    /** The maximum width the sidebar can be resized to. Defaults to 500. */
    maxWidth?: number;
    fromTopbar?: boolean;
};

export const TwoPanelLayout = (props: TwoPanelLayoutProps) => {
    // Set default values for props
    const initialWidth = () => props.initialWidth ?? 240;
    const minWidth = () => props.minWidth ?? 150;
    const maxWidth = () => props.maxWidth ?? 500;

    const [sidebarWidth, setSidebarWidth] = createSignal(initialWidth());
    const [isDragging, setIsDragging] = createSignal(false);

    let initialMouseX = 0;
    let initialSidebarWidth = 0;

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        initialMouseX = e.clientX;
        initialSidebarWidth = sidebarWidth();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging()) return;
        const deltaX = e.clientX - initialMouseX;
        const newWidth = initialSidebarWidth + deltaX;

        // Clamp the new width between min and max values
        const clampedWidth = Math.max(minWidth(), Math.min(newWidth, maxWidth()));
        setSidebarWidth(clampedWidth);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Add global event listeners when the component mounts
    onMount(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    });

    // Clean up global event listeners when the component is unmounted
    onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    });

    // Add a class to the body to prevent text selection during drag
    createEffect(() => {
        document.body.style.userSelect = isDragging() ? 'none' : '';
    });

    const rootClasses = () => `w-full h-full flex flex-row ${props.class || ''} ${props.fromTopbar ? 'absolute top-0 left-0' : 'relative'}`;

    // Sidebar no longer uses Tailwind's w-* classes for width, it's controlled by style
    const sidebarClasses = () => `h-full overflow-y-auto flex-shrink-0 ${props.sidebarClass || ''} ${props.fromTopbar ? 'z-50' : ''}`;

    const contentClasses = () => `h-full w-full flex-1 overflow-y-auto ${props.contentClass || ''} ${props.fromTopbar ? 'bg-stone-50 dark:bg-stone-800' : ''}`;

    return (
        <div class={rootClasses()}>
            {/* Sidebar Panel */}
            <div class="h-full flex-shrink-0 bg-stone-50/70 pt-8 dark:bg-stone-800/70 backdrop-blur-3xl overflow-hidden flex">
                <div class={sidebarClasses()} style={{ width: `${sidebarWidth()}px` }}>
                    {props.sidebar}
                </div>
            </div>

            {/* Draggable Divider */}
            <Show when={props.showDivider}>
                <div
                    class="h-full w-[1px] flex justify-center items-center cursor-col-resize group"
                    onMouseDown={handleMouseDown}
                >
                    {/* The visual 1px line */}
                    <div class="h-full w-[2px] bg-stone-200/70 dark:bg-stone-800/70 backdrop-blur-3xl group-hover:bg-blue-700" />
                </div>
            </Show>

            {/* Content Panel */}
            <div class={contentClasses()}>
                {props.content}
            </div>
        </div>
    );
};
