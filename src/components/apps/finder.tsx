import { IoAppsOutline, IoChevronBack, IoChevronForward, IoDownloadOutline, IoFileTrayOutline, IoFolderOutline, IoShareOutline, IoTimerOutline } from "solid-icons/io"
import { TwoPanelLayout } from "../layouts/two-panel"
import { createMemo, createSignal, For, Show } from "solid-js"
import { SiIcloud } from "solid-icons/si";
import { Dynamic } from "solid-js/web";
import { AppRegistry, launchApp } from "./registry";


export const Finder = () => {

    const [active, setActive] = createSignal('icloud-drive');

    const groups = [
        {
            name: "iCloud",
            items: [
                { name: "iCloud Drive", icon: SiIcloud, id: 'icloud-drive', files: [0, 1] },
                { name: 'Shared', icon: IoShareOutline, id: 'shared' },
            ]
        },
        {
            name: "Favorites",
            items: [
                { name: "AirDrop", icon: IoShareOutline, id: 'airdrop' },
                { name: 'Recents', icon: IoTimerOutline, id: 'recents' },
                { name: 'Applications', icon: IoAppsOutline, id: 'applications' },
                { name: 'Desktop', icon: IoFolderOutline, id: 'desktop' },
                { name: 'Documents', icon: IoFileTrayOutline, id: 'documents' },
                { name: 'Downloads', icon: IoDownloadOutline, id: 'downloads' },
            ]
        },
        {
            name: "Locations",
            items: [
                { name: "Macintosh HD", icon: IoFolderOutline, id: 'macintosh-hd' },
                { name: 'Network', icon: IoFolderOutline, id: 'network' },
                { name: 'AirDrop', icon: IoShareOutline, id: 'airdrop-locations' },
            ]
        },
        // {
        //     name: "Tags",
        //     items: [
        //         { name: "Work", icon: IoFolderOutline, id: 'work' },
        //         { name: 'Personal', icon: IoFolderOutline, id: 'personal' },
        //         { name: 'Important', icon: IoFolderOutline, id: 'important' },
        //     ]
        // }
    ];

    const files: Record<number, any> = {
        0: { name: "Photos", kind: "folder", preview: './apps/finder.svg' },
        1: { name: "myprofilepic.jpg", kind: "file", preview: './pfp/pfp.jpg', type: 'image' },
    };

    const activeItem = createMemo(() => {
        return groups.flatMap(group => group.items).find(item => item.id === active());
    });

    const activeFiles = createMemo(() => {
        const item = activeItem();
        if (item && item.files) {
            return item.files.map(fileId => files[fileId] ?? null).filter(file => file !== null);
        }
        return [];
    });


    return (
        <TwoPanelLayout
            showDivider
            fromTopbar
            sidebar={[
                <div class="w-full mt-5 px-3">
                    <For each={groups}>
                        {(group) => (
                            <div class="flex flex-col mb-4">
                                <span class="pl-3 text-xs text-stone-500 font-semibold mb-1">{group.name}</span>
                                <ul class="w-full">
                                    <For each={group.items}>
                                        {(item) => (
                                            <li class="w-full">
                                                <button onClick={() => setActive(item.id)} class={`rounded-lg w-full flex flex-row gap-2 px-3 py-2 ${active() === item.id ? 'bg-stone-200/70 backdrop-blur-3xl dark:bg-stone-900/70' : ''}`}>
                                                    <Dynamic component={item.icon} class="text-blue-700" size={20} />
                                                    <span class="text-sm text-stone-700 dark:text-stone-300">{item.name}</span>
                                                </button>
                                            </li>
                                        )}

                                    </For>
                                </ul>
                            </div>
                        )}
                    </For>
                </div>
            ]}
            content={[
                <div class="w-full relative flex">
                    <div class="absolute top-0 left-0 w-full p-4 flex flex-row gap-4 items-center justify-start shadow-3xl border-e border-stone-200 dark:border-stone-950">
                        <div class="flex flex-row gap-2 items-center">
                            <button><IoChevronBack size={25} class="text-gray-500 dark:text-gray-400" /></button>
                            <button><IoChevronForward size={25} class="text-gray-500 dark:text-gray-400" /></button>
                        </div>
                        <h1 class="text-stone-800 dark:text-stone-200 font-semibold text-lg">{activeItem()?.name ?? 'Finder'}</h1>
                    </div>

                    <div class="mt-12 grid grid-cols-5 gap-4 p-3">

                        <For each={activeFiles()}>
                            {(file) => (
                                <button class="flex flex-col items-center">
                                    <img src={file.preview} class={`${file.type === 'folder' ? 'h-8 w-8 ' : ''}`} alt={file.name} />
                                    <span class="text-sm text-stone-700 dark:text-stone-300 mt-2">{file.name}</span>
                                </button>
                            )}

                        </For>

                        <Show when={active() === 'applications'}>
                            <For each={Object.keys(AppRegistry)}>
                                {(id) => {
                                    const app = AppRegistry[id];
                                    return (
                                        <button onDblClick={() => launchApp(id)} class="flex flex-col items-center">
                                            <img src={app.icon} class="h-16 w-16" alt={app.name} />
                                            <span class="text-sm text-stone-700 dark:text-stone-300 mt-2">{app.name}</span>
                                        </button>
                                    )
                                }}
                            </For>
                        </Show>
                    </div>
                </div>
            ]}
        />
    )
}
