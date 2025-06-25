import { createMemo, For, Show, } from "solid-js";
import { useWindowManager, type WindowState, } from "../hooks/window-manager";
import { Tooltip } from "./utils/tooltip";
import { AppRegistry, launchApp, type AppInfo } from "./apps/registry";


type DockItem = {
    name: string;
    icon: string;
    onClick: () => void;
    highlighted?: boolean;
} | 'divider';

const getDockItemForApp = (app: AppInfo) => {
    return {
        name: app.name,
        icon: app.icon,
        onClick: () => launchApp(app),
        highlighted: false
    };
}

const getDockItemForWindow = (win: WindowState, focusWindow: (id: string) => void) => {
    return {
        name: win.title,
        icon: win.icon || AppRegistry[win.title]?.icon || './apps/default-app.svg',
        onClick: () => focusWindow(win.id),
        highlighted: true
    }
}

const mergeDockItems = (apps: DockItem[], windows: DockItem[]) => {
    const result = new Map<string, DockItem>();

    for (const item of apps) {
        if (typeof item === 'string') {
            result.set(item, item);
        } else {
            result.set(item.name, item);
        }
    }

    for (const item of windows) {
        if (typeof item === 'string') {
            result.set(item, item);
        } else {
            result.set(item.name, item);
        }
    }

    return Array.from(result.values());

}

export const Dock = () => {

    const { windows, focusWindow } = useWindowManager();


    const dockItems = createMemo(() => {
        const staticDockItems: DockItem[] = [
            getDockItemForApp(AppRegistry['Finder']),
            getDockItemForApp(AppRegistry['Safari']),
            getDockItemForApp(AppRegistry['Preferences']),
            'divider',
            // getDockItemForApp(AppRegistry['Siri']),
            getDockItemForApp(AppRegistry['Trash']),
        ];

        const dynamicDockItems: DockItem[] = Object.values(windows).map(win => getDockItemForWindow(win, focusWindow));

        return mergeDockItems(staticDockItems, dynamicDockItems);
    });



    return (
        <div class="dock fixed bottom-2 w-full h-16 z-[10000] flex flex-row items-center justify-center">
            <div class="h-16 bg-stone-200/50 dark:bg-stone-900/50 gap-3 backdrop-blur-2xl  rounded-2xl p-4 shadow-lg z-[10000] flex flex-row items-center">
                <For each={dockItems()}>
                    {(item) => typeof item === 'string' ? (
                        <span class="h-10 w-2 border-r border-stone-200/50 dark:border-stone-900/50 mr-3" />
                    ) : (
                        <Tooltip content={item.name}>
                            <button class="flex h-10 w-10 bg-cover bg-no-repeat z-[10001] items-center justify-center rounded-lg transition-colors"
                                onClick={item.onClick}
                                style={{ 'background-image': `url('${item.icon}')` }}
                            />
                            <Show when={item.highlighted || false}>
                                <span class="absolute -bottom-2 left-[calc(50%-2px)] w-[4px] h-1 bg-blue-500 rounded-full" />
                            </Show>
                        </Tooltip>

                    )}
                </For>
            </div>
        </div>
    );
}
