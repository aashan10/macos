import { createMemo, For } from "solid-js";
import { useWindowManager } from "../hooks/window-manager"
import { IoLogoApple } from "solid-icons/io";
import { usePreferences } from "../hooks/preferences";
import { Preferences } from "./preferences";
import { ThemeSwitcher } from "./theme-switcher";
import { ToolbarItem, type ToolbarItemProps } from "./toolbar/item";

export const Toolbar = () => {
    const { windows, focusedWindow, closeWindow, createWindow } = useWindowManager();
    const { getPreference } = usePreferences();


    const activeWindow = createMemo(() => {
        return windows().filter(win => win.id === focusedWindow())[0] || null;
    });

    const theme = createMemo(() => getPreference("theme") || "light");

    const toolbar = createMemo(() => {
        const items: ToolbarItemProps[] = [{
            name: '',
            icon: <IoLogoApple size={20} color={theme() === 'light' ? '#000000' : '#ffffff'} />,
            onClick: () => { },
            children: [
                {
                    name: 'About This Mac',
                    onClick: () => createWindow("About This Mac", 400, 100, 600, 400, []),
                },
                {
                    name: 'System Preferences',
                    onClick: () => createWindow("System Preferences", 400, 100, 900, 800, [<Preferences />]),
                },
                {
                    name: 'Recent Items',
                    onClick: () => { },
                },
                {
                    name: 'Force Quit',
                    onClick: () => { },
                }
            ]
        }];

        if (activeWindow()) {
            items.push({
                name: <span class="font-semibold">{activeWindow().title}</span>,
                children: [
                    {
                        name: 'Quit',
                        onClick: () => closeWindow(activeWindow().id),
                    },
                    {
                        name: 'Force Quit',
                        onClick: () => {
                            windows().forEach(win => {
                                if (win.title === activeWindow().title) {
                                    closeWindow(win.id);
                                }
                            });
                        },
                    }
                ]
            });

            items.push({
                name: 'File',
                children: [
                    {
                        name: 'New Window',
                        onClick: () => createWindow(activeWindow().title, 400, 100, 800, 600, activeWindow().children),
                    },
                    {
                        name: 'New Tab',
                        onClick: () => { },
                    },
                    {
                        name: 'Close Window',
                        onClick: () => closeWindow(activeWindow().id),
                    }
                ]
            });
        }


        return items;
    })

    return (
        <nav class="w-full flex flex-row justify-between px-4 text-black dark:text-white min-h-[35px]">
            <ul class="flex flex-row items-center justify-start">
                <For each={toolbar()}>
                    {(item) => <ToolbarItem {...item} />}
                </For>
            </ul>

            <ul class="flex">
                <li>
                    <ThemeSwitcher />
                </li>
            </ul>
        </nav>
    )
}
