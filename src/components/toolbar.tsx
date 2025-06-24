import { createMemo, For } from "solid-js";
import { useWindowManager } from "../hooks/window-manager"
import { IoLogoApple } from "solid-icons/io";
import { usePreferences } from "../hooks/preferences";
import { Preferences } from "./preferences";
import { ThemeSwitcher } from "./theme-switcher";
import { ToolbarItem, type ToolbarItemProps } from "./toolbar/item";

export const Toolbar = () => {
    const { closeWindow, createWindow, activeWindow } = useWindowManager();
    const { getPreference } = usePreferences();


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

        const active = activeWindow();

        if (active) {
            items.push({
                name: <span class="font-semibold">{active.title}</span>,
                children: [
                    {
                        name: 'Quit',
                        onClick: () => closeWindow(active.id),
                    },
                    {
                        name: 'Force Quit',
                        onClick: () => {
                            window.dispatchEvent(new CustomEvent('force-quit-window', {
                                detail: {
                                    title: active.title,
                                }
                            }))
                        },
                    }
                ]
            });

            items.push({
                name: 'File',
                children: [
                    {
                        name: 'New Window',
                        onClick: () => createWindow(active.title, 400, 100, 800, 600, active.children),
                    },
                    {
                        name: 'New Tab',
                        onClick: () => { },
                    },
                    {
                        name: 'Close Window',
                        onClick: () => closeWindow(active.id),
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
