import { IoAccessibilityOutline, IoBatteryFull, IoBluetoothOutline, IoCogOutline, IoGlobeOutline, IoGlobeSharp, IoInvertModeOutline, IoMenuOutline, IoSearchOutline, IoWifiOutline } from "solid-icons/io";
import { createSignal, For, Show } from "solid-js";
import { PreferenceButton } from "./preferences/button";
import { AppearancePreferences } from "./preferences/pages/appearance";

export const Preferences = () => {

    const [activeTab, setActiveTab] = createSignal<string | null>('appearance');

    const tabs = [
        { name: 'Wi-Fi', icon: <IoWifiOutline size={20} color="#56A8E5" />, id: 'wifi' },
        { name: 'Bluetooth', icon: <IoBluetoothOutline size={20} color="#56A8E5" />, id: 'bluetooth' },
        { name: 'Network', icon: <IoGlobeOutline size={20} color="#56A8E5" />, id: 'network' },
        { name: 'VPN', icon: <IoGlobeSharp size={20} color="#56A8E5" />, id: 'vpn' },
        { name: 'Battery', icon: <IoBatteryFull size={20} color="green" />, id: 'battery' },
        { name: 'General', icon: <IoCogOutline size={20} color="#ffffff" />, id: 'general' },
        { name: '', id: 'divider' },
        { name: 'Accessibility', icon: <IoAccessibilityOutline size={20} color="#56A8E5" />, id: 'accessibility' },
        { name: 'Appearance', icon: <IoInvertModeOutline size={20} color="#ffffff" />, id: 'appearance' },
        { name: 'Menu Bar', icon: <IoMenuOutline size={20} color="#ffffff" />, id: 'menu-bar' },
        { name: 'Apple Intelligence & Siri', icon: <img src="./apple_intelligence.svg" />, id: 'apple-intelligence' },
    ];

    return (
        <div class="w-full h-full flex gap-4 flex-row dark:text-white">
            <div class="hidden overflow-y-scroll max-w-[300px] h-full bg-stone-200 dark:bg-stone-800 border dark:border-stone-900 border-stone-200 rounded-lg md:flex lg:w-1/3 md:w-1/2 w-full p-4 flex flex-col">
                <div class="w-full relative">
                    <input type="text" placeholder="Search" class="w-full pl-[28px] bg-white dark:bg-stone-900 px-4 py-1 rounded-lg border dark:border-stone-900 dark:text-white border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <IoSearchOutline size={20} color="#707070" class="absolute left-[8px] top-[8px]" />
                </div>
                <div class="flex flex-row gap-4 my-4 items-center">
                    <img src="./pfp/pfp.jpg" class="h-12 w-12 bg-stone-500 rounded-full" />
                    <div class="flex flex-col">
                        <span>Ashan Ghimire</span>
                        <span class="text-xs">Apple Account</span>
                    </div>
                </div>

                <For each={tabs}>
                    {(tab) => tab.id === 'divider' ? (
                        <span class="py-2" />
                    ) : (
                        <PreferenceButton
                            onClick={() => setActiveTab(tab.id)}
                            label={tab.name}
                            icon={tab.icon}
                            active={activeTab() === tab.id}
                        />
                    )}

                </For>
            </div>

            <div class="w-full md:w-1/2 lg:w-2/3 p-4">
                <Show when={activeTab() === 'appearance'}>
                    <AppearancePreferences />
                </Show>
            </div>
        </div>
    );
}
