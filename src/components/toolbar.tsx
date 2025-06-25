import { createMemo, For } from "solid-js";
import { useWindowManager } from "../hooks/window-manager"
import { IoLogoApple } from "solid-icons/io";
import { usePreferences } from "../hooks/preferences";
import { ThemeSwitcher } from "./theme-switcher";
import { ToolbarItem, type ToolbarItemProps } from "./toolbar/item";
import { SinglePanelLayout } from "./layouts/single-panel";
import { AppRegistry, launchApp } from "./apps/registry";

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
                    onClick: () => createWindow({
                        title: "About This Mac",
                        width: 400,
                        height: 400,
                        x: 400,
                        y: 400,
                        children: [<SinglePanelLayout content={[]} />]
                    }),
                },
                {
                    name: 'System Preferences',
                    onClick: () => launchApp(AppRegistry['Preferences']),
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
