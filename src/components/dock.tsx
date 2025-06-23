import { For } from "solid-js";
import { useWindowManager, type WindowState } from "../hooks/window-manager";
import { Preferences } from "./preferences";
import { Safari } from "./apps/safari";
import { Tooltip } from "./utils/tooltip";

export const Dock = () => {

    const { windows, focusWindow, createWindow } = useWindowManager();

    const findWindowByName = (name: string) => {
        return windows().find(win => win.title === name);
    }

    const createOrFocusExistingWindow = (name: string, props: WindowState) => {
        const existingWindow = findWindowByName(name);
        if (existingWindow) {
            focusWindow(existingWindow.id);
        } else {
            createWindow(name, props.x, props.y, props.width, props.height, props.children);
        }
    }

    const dockItems = [
        {
            name: 'Finder', icon: './dock/finder.svg', onClick: () => { },
        },
        {
            name: 'Safari', icon: './dock/safari.svg', onClick: () => {
                createOrFocusExistingWindow('Safari', {
                    id: 'safari-window', // this won't be used regardless, but I'm too lazy to change the type
                    title: 'Safari',
                    x: 100,
                    y: 100,
                    width: 800,
                    height: 600,
                    children: [<Safari />],
                    zIndex: 1000, // Assuming a default zIndex
                });
            }
        },
        {
            name: 'System Preferences', icon: './dock/syspref.svg', onClick: () => {
                createOrFocusExistingWindow('System Preferences', {
                    id: 'system-preferences-window',
                    title: 'System Preferences',
                    x: 400,
                    y: 100,
                    width: 900,
                    height: 800,
                    children: [<Preferences />],
                    zIndex: 1000, // Assuming a default zIndex
                });
            }
        },
        { name: 'divider' },
        {
            name: 'Siri', icon: './dock/siri.svg', onClick: () => { }
        },
        {
            name: 'Trash', icon: './dock/trash.svg', onClick: () => { }
        }
    ];

    return (
        <div class="dock fixed bottom-2 w-full h-16 z-[10000] flex flex-row items-center justify-center">
            <div class="h-16 bg-stone-200/50 dark:bg-stone-900/50 gap-3 backdrop-blur-2xl  rounded-2xl p-4 shadow-lg z-[10000] flex flex-row items-center">
                <For each={dockItems}>
                    {(item) => item.name === 'divider' ? (
                        <span class="h-10 w-2 border-r border-stone-200/50 dark:border-stone-900/50 mr-3" />
                    ) : (
                        <Tooltip content={item.name}>
                            <button class="flex h-10 w-10 bg-cover bg-no-repeat z-[10001] items-center justify-center rounded-lg transition-colors"
                                onClick={item.onClick}
                                style={{ 'background-image': `url('${item.icon}')` }}
                            />
                        </Tooltip>

                    )}
                </For>
            </div>
        </div>
    );
}
