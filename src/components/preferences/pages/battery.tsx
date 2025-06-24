import { For } from "solid-js"
import { createSignal } from "solid-js"

export const Battery = () => {
    const [selectedPeriod, setSelectedPeriod] = createSignal("24hours")

    // Sample battery level data (0-100%)
    const batteryData = [85, 82, 78, 75, 72, 68, 65, 62, 58, 55, 52, 48, 45, 42, 38, 35, 32, 28, 25, 22, 18, 15, 12, 8, 5]

    // Sample screen usage data (in minutes, 0-60)
    const screenUsageData = [0, 0, 0, 0, 0, 0, 0, 0, 12, 45, 38, 25, 15, 8, 35, 42, 48, 35, 28, 15, 5, 0, 0, 0]

    const timeLabels = ["00", "03", "06", "09", "12", "15", "18", "21"]

    return (
        <>
            <div class="text-stone-800 dark:text-stone-300 w-full flex flex-col gap-3">
                <div class="flex flex-row justify-between items-center rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 p-3">
                    <span class="text-sm font-semibold">Low Power Mode</span>

                    <select class="max-w-[75px]">
                        <option value="never">Never</option>
                        <option value="always">Always</option>
                        <option value="on_battery">On Battery</option>
                    </select>
                </div>

                <div class="flex flex-row justify-between items-center rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 p-3">
                    <span class="text-sm font-semibold">Battery Health</span>
                    <div class="flex items-center gap-2">
                        <span class="text-sm">Normal</span>
                        <div class="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center">
                            <span class="text-xs text-gray-500">i</span>
                        </div>
                    </div>
                </div>


                <div class="flex flex-col justify-between items-center rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 p-3">

                    <div class="flex w-full mb-6 dark:bg-stone-800 bg-stone-200 rounded-lg">
                        <button
                            class={`px-6 py-1 rounded-lg w-1/2 text-sm font-medium ${selectedPeriod() === "24hours" ? " shadow-xl bg-blue-600 text-white" : "text-stone-900 dark:text-stone-200"
                                }`}
                            onClick={() => setSelectedPeriod("24hours")}
                        >
                            Last 24 Hours
                        </button>
                        <button
                            class={`px-6 py-1 rounded-lg w-1/2 text-sm font-medium ${selectedPeriod() === "10days" ? "shadow-xl bg-blue-600 text-white" : "text-stone-900 dark:text-stone-200"
                                }`}
                            onClick={() => setSelectedPeriod("10days")}
                        >
                            Last 10 Days
                        </button>
                    </div>


                    <div class="flex flex-col w-full justify-start">
                        <div class="text-sm">Fully Charged</div>
                        <div class="text-sm text-stone-500">Yesterday, 20:57</div>
                        <hr class="border-e mt-4 border-stone-200 dark:border-stone-700 w-full" />
                    </div>


                    <div class="w-full mr-8 mt-4 px-4">
                        <h3 class="text-sm font-medium mb-4">Battery Level</h3>
                        <div class="relative ">
                            {/* Y-axis labels */}
                            <div class="absolute -right-8 top-0 h-32 flex flex-col justify-between text-xs text-gray-400">
                                <span>100%</span>
                                <span>50%</span>
                                <span>0%</span>
                            </div>

                            {/* Chart area */}
                            <div class="h-32 flex items-end justify-between rounded p-2 gap-px">
                                <For each={batteryData}>
                                    {(level) => (
                                        <div class="bg-green-500 w-1 rounded-t" style={{ height: `${(level / 100) * 100}%` }} />
                                    )}
                                </For>
                            </div>

                            {/* X-axis labels */}
                            <div class="flex justify-between text-xs text-gray-400 mt-2">
                                <For each={timeLabels}>
                                    {(label) => (
                                        <span >{label}</span>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>


                    <div class="w-full px-4 pt-4 mr-8">
                        <h3 class="text-sm font-medium mb-4">Screen On Usage</h3>
                        <div class="relative">
                            {/* Y-axis labels */}
                            <div class="absolute -right-8 top-0 h-32 flex flex-col justify-between text-xs text-gray-400">
                                <span>60m</span>
                                <span>30m</span>
                                <span>0m</span>
                            </div>

                            {/* Chart area */}
                            <div class="h-32 flex items-end justify-between rounded p-2 gap-px">
                                <For each={screenUsageData}>
                                    {(usage) => (
                                        <div class="bg-blue-500 w-1 rounded-t" style={{ height: `${(usage / 60) * 100}%` }} />
                                    )}
                                </For>
                            </div>

                            {/* X-axis labels */}
                            <div class="flex justify-between text-xs text-gray-400 mt-2">
                                <For each={timeLabels}>
                                    {(label) => (
                                        <span>{label}</span>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <div class="text-white w-full mx-auto rounded-lg overflow-y-scroll">

                {/* Screen On Usage Chart */}
            </div>
        </>
    )
}


