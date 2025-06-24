import {
    IoBatteryFull,
    IoBluetoothOutline,
    IoChevronBack,
    IoChevronForward,
    IoCogOutline,
    IoGlobeOutline,
    IoGlobeSharp,
    IoInvertModeOutline,
    IoMenuOutline,
    IoSearchOutline,
    IoWifiOutline,
} from "solid-icons/io"
import { createMemo, createSignal, For, Show } from "solid-js"
import { AppearancePreferences } from "./preferences/pages/appearance"
import { Dynamic } from "solid-js/web"
import { FaSolidUniversalAccess } from "solid-icons/fa"
import { Battery } from "./preferences/pages/battery"
import { TwoPanelLayout } from "./layouts/two-panel"

export const Preferences = () => {
    const [activeTab, setActiveTab] = createSignal<string | null>("appearance")

    const tabs = [
        { name: "Wi-Fi", id: "wifi", bg: "#007AFF", fg: "#fff", icon: IoWifiOutline },
        { name: "Bluetooth", id: "bluetooth", bg: "#007AFF", fg: "#fff", icon: IoBluetoothOutline },
        { name: "Network", id: "network", bg: "#007AFF", fg: "#fff", icon: IoGlobeOutline },
        { name: "VPN", id: "vpn", bg: "#007AFF", fg: "#fff", icon: IoGlobeSharp },
        { name: "Battery", id: "battery", bg: "#49D759", fg: "#fff", icon: IoBatteryFull },
        { name: "", id: "divider" },
        { name: "General", id: "general", bg: "#AFAFB4", fg: "#fff", icon: IoCogOutline },
        { name: "Accessibility", id: "accessibility", bg: "#007AFF", fg: "#fff", icon: FaSolidUniversalAccess },
        { name: "Appearance", id: "appearance", bg: "#000", fg: "#fff", icon: IoInvertModeOutline },
        { name: "Menu Bar", id: "menu-bar", bg: "#AFAFB4", fg: "#fff", icon: IoMenuOutline },
        {
            name: "Apple Intelligence & Siri",
            id: "apple-intelligence",
            bg: "#ffffff",
            fg: "#000000",
            icon: () => <img src="./apple_intelligence.svg" />,
        },
    ]

    const openTab = createMemo(() => tabs.filter(tab => tab.id === activeTab())[0] || null);

    return (
        <TwoPanelLayout
            showDivider
            fromTopbar
            sidebar={[
                <div class="w-full text-stone-800 dark:text-stone-300 w-full border-r-none p-4">

                    <div class="w-full relative mb-4">
                        <input
                            type="text"
                            placeholder="Search"
                            class="w-full pl-[28px] bg-stone-200/50 dark:bg-stone-800/50 px-4 py-1 rounded-lg dark:text-white border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <IoSearchOutline size={20} color="#707070" class="absolute left-[8px] top-[8px]" />
                    </div>

                    <div class="flex flex-row gap-4 mb-4 items-center">
                        <img src="./pfp/pfp.jpg" class="h-12 w-12 bg-stone-500 rounded-full" />
                        <div class="flex flex-col">
                            <span class="text-sm font-medium">Ashan Ghimire</span>
                            <span class="text-xs text-gray-500">Apple Account</span>
                        </div>
                    </div>

                    <div class="flex flex-col w-full flex-1 overflow-y-auto">
                        <For each={tabs}>
                            {(tab) =>
                                tab.id === "divider" ? (
                                    <div class="py-2" />
                                ) : (
                                    <button
                                        onMouseDown={() => setActiveTab(tab.id)}
                                        class={`flex flex-row items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-colors ${activeTab() === tab.id ? "bg-blue-600 text-white" : ""
                                            }`}
                                    >
                                        <span
                                            class="h-[20px] w-[20px] flex justify-center items-center rounded-md shadow-sm flex-shrink-0"
                                            style={{ "background-color": tab.bg }}
                                        >
                                            <Dynamic component={tab.icon} size={12} color={tab.fg} />
                                        </span>
                                        <span class="text-sm truncate">{tab.name}</span>
                                    </button>
                                )
                            }
                        </For>
                    </div>
                </div>
            ]}
            content={[
                <div class="h-full relative">
                    <div class="static top-0 w-full p-4 flex flex-row gap-4 items-center">
                        <button>
                            <IoChevronBack size={25} class="text-gray-500 dark:text-gray-400" />
                        </button>
                        <button>
                            <IoChevronForward size={25} class="text-gray-500 dark:text-gray-400" />
                        </button>
                        <h1 class="text-md text-stone-700 dark:text-white font-semibold">{openTab().name ?? ''}</h1>
                    </div>
                    <div class="p-4">

                        <Show when={activeTab() === "appearance"}>
                            <AppearancePreferences />
                        </Show>
                        <Show when={activeTab() === "battery"}>
                            <Battery />
                        </Show>
                        <Show when={!activeTab() || (activeTab() !== "appearance" && activeTab() !== "battery")}>
                            <div class="flex items-center justify-center h-full text-gray-500">
                                <div class="text-center">
                                    <h2 class="text-xl font-semibold mb-2">Select a preference</h2>
                                    <p><kbd>To be implemented!</kbd></p>
                                </div>
                            </div>
                        </Show>
                    </div>
                </div>
            ]} />
    )
}

