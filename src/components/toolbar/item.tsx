import { For, Show, type JSXElement, createSignal, onMount, onCleanup, createMemo } from "solid-js";

export type ToolbarItemProps = {
    name: string | JSXElement;
    icon?: JSXElement;
    onClick?: () => void;
    children?: ToolbarItemProps[];
    kbd?: string;
    isChild?: boolean; // Used to indicate if this item is a child of another item
};

export const ToolbarItem = (props: ToolbarItemProps) => {
    const { name } = props;
    const [showDropdown, setShowDropdown] = createSignal(false);
    let itemRef: HTMLLIElement | undefined; // Reference to the li element

    const buttonClasses = createMemo(() => {
        const baseClasses = [
            "w-full px-4 py-1",
            "flex flex-row gap-2 items-center cursor-pointer text-sm",
        ];

        if (props.isChild) {
            baseClasses.push("rounded-lg hover:bg-blue-700 hover:text-stone-50");
        } else {
            baseClasses.push("rounded-full");
            if (showDropdown()) {
                baseClasses.push("bg-stone-200/50 dark:bg-stone-900/50 backdrop-blur-xl");
            }
        }

        return baseClasses.join(" ");
    })

    const handleItemClick = (event: MouseEvent) => {
        // Prevent event from bubbling up to the document listener immediately
        event.stopPropagation();

        // If there's an onClick prop, call it
        if (props.onClick) {
            props.onClick();
        }

        setShowDropdown(!showDropdown());
    };

    const handleClickOutside = (event: MouseEvent) => {
        // If the dropdown is open and the click is outside this component
        if (showDropdown() && itemRef && !itemRef.contains(event.target as Node)) {
            setShowDropdown(false);
        }
    };

    // Add event listener when component mounts
    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    // Clean up event listener when component unmounts
    onCleanup(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    return (
        <li class="relative" ref={itemRef}> {/* Assign ref to the li element */}
            <button class={buttonClasses()} onClick={handleItemClick}>
                <Show when={props.icon}>
                    <span>{props.icon}</span>
                </Show>
                <Show when={name}>
                    <span class="">{name}</span>
                </Show>
                <Show when={props.kbd}>
                    <span class="text-xs text-gray-500">{props.kbd}</span>
                </Show>
            </button>

            <Show when={props.children && props.children.length > 0}>
                <ul class={`absolute mt-1 top-full backdrop-blur-xl flex-col py-1 px-1 min-w-[200px] bg-stone-200/80 dark:bg-stone-900/80 border dark:border-stone-900/70 border-stone-200/70 rounded-xl shadow-lg ${showDropdown() ? 'flex' : 'hidden'}`}>
                    <For each={props.children}>
                        {(child) => (
                            <ToolbarItem isChild={true} {...child} />
                        )}
                    </For>
                </ul>
            </Show>
        </li>
    );
};
