import { For, Show, createMemo, } from "solid-js";
import { useWindowManager, type WindowState } from "../hooks/window-manager";
import { Tooltip } from "./utils/tooltip";
import { AppRegistry, getAppIcon, launchApp, type AppInfo } from "./apps/registry";


export const Dock = () => {

    const { windows, focusWindow, createWindow, inactiveWindows } = useWindowManager();

    const findWindowByName = (name: string) => {
        const windowList = windows;
        for (const win of Object.values(windowList)) {
            if (win.title === name) {
                return win;
            }
        }
        return null;
    }

    const createOrFocusExistingWindow = (name: string, props: WindowState) => {
        const existingWindow = findWindowByName(name);
        if (existingWindow) {
            focusWindow(existingWindow.id);
        } else {
            createWindow(name, props.x, props.y, props.width, props.height, props.children);
        }
    }

    const dockItems: Array<AppInfo & { onClick: () => void; isOpen?: boolean } | string> = [
        { ...AppRegistry['Finder'], onClick: () => launchApp(AppRegistry['Finder']) },
        { ...AppRegistry['Safari'], onClick: () => launchApp(AppRegistry['Safari']) },
        { ...AppRegistry['Preferences'], onClick: () => launchApp(AppRegistry['Preferences']) },
        'divider',
        // { ...AppRegistry['Siri'], onClick: () => launchApp('Siri') },
        { ...AppRegistry['Trash'], onClick: () => launchApp(AppRegistry['Trash']) },
    ];


    const getDockItems = createMemo(() => {
        let items = [...dockItems];

        const openButInactive: Record<string, WindowState> = inactiveWindows();

        for (const [_, win] of Object.entries(openButInactive)) {
            items.push({
                name: win.title,
                icon: getAppIcon(win.title),
                onClick: () => createOrFocusExistingWindow(win.title, win),
                isOpen: true,
                component: win.children
            });
        }



        return items;
    });


    return (
        <div class="dock fixed bottom-2 w-full h-16 z-[10000] flex flex-row items-center justify-center">
            <div class="h-16 bg-stone-200/50 dark:bg-stone-900/50 gap-3 backdrop-blur-2xl  rounded-2xl p-4 shadow-lg z-[10000] flex flex-row items-center">
                <For each={getDockItems()}>
                    {(item) => typeof item === 'string' ? (
                        <span class="h-10 w-2 border-r border-stone-200/50 dark:border-stone-900/50 mr-3" />
                    ) : (
                        <Tooltip content={item.name}>
                            <button class="flex h-10 w-10 bg-cover bg-no-repeat z-[10001] items-center justify-center rounded-lg transition-colors"
                                onClick={item.onClick}
                                style={{ 'background-image': `url('${item.icon}')` }}
                            />
                            <Show when={item.isOpen || false}>
                                <span class="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-b-lg" />
                            </Show>
                        </Tooltip>

                    )}
                </For>
            </div>
        </div>
    );
}
