import { createMemo, For } from "solid-js";
import { usePreferences } from "../../../hooks/preferences";

export const AppearancePreferences = () => {
    const { getPreference, setPreference } = usePreferences();

    const theme = createMemo(() => getPreference("theme") || "light");

    const themes: Array<{ name: string, value: 'light' | 'dark' | 'auto', icon: string }> = [
        { name: "Auto", value: "auto", icon: "./appearance/auto.png" },
        { name: "Light", value: "light", icon: "./appearance/light.png" },
        { name: "Dark", value: "dark", icon: "./appearance/dark.png" }
    ];

    return (
        <div class="w-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 dark:text-stone-50 text-stone-800 dark:text-stone-400 p-4 rounded-xl border dark:border-stone-900 border-stone-200 flex flex-row items-start">
            <h1 class="flex w-1/2 text-sm font-semibold dark:text-stone-400">Appearance</h1>

            <div class="flex w-1/2 flex-row gap-4 justify-end">
                <For each={themes}>
                    {(item) => (
                        <button class={`flex flex-col gap-2`} onClick={() => setPreference("theme", item.value)}>
                            <img src={item.icon} class={`rounded h-[40px] ${theme() === item.value ? 'ring ring-blue-700 ring-2' : ''}`} />
                            <span class="text-xs">{item.name}</span>
                        </button>
                    )}
                </For>
            </div>
        </div>
    );
}
