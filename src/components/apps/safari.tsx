import { createSignal } from "solid-js"
import { SinglePanelLayout } from "../layouts/single-panel";

export const Safari = () => {
    const [url, setUrl] = createSignal('https://example.com');
    return (
        <SinglePanelLayout content={[
            <div class="w-full h-full flex gap-2 flex-col">
                <div class="flex flex-row items-center gap-2">
                    <input
                        type="text"
                        class="flex-1 p-2 px-6 dark:bg-stone-900 rounded-full text-stone-900 dark:text-stone-200 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        placeholder="Enter URL"
                        value={url()}
                        onInput={(e) => setUrl(e.currentTarget.value)}
                    />
                </div>

                <div class="w-full h-full bg-white dark:bg-stone-800 rounded-lg shadow-md">
                    <iframe src={url()} class="w-full h-full border-none rounded-lg" title="Safari Browser"></iframe>
                </div>

            </div>
        ]} />
    )
}
