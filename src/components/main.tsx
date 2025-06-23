import { Dock } from "./dock";
import { Toolbar } from "./toolbar";
import WindowManager from "./window-manager";

export default function Main() {

    return (
        <div class="transition-colors bg-[url('/light.jpg')] overflow-hidden dark:bg-[url('/dark.jpg')] bg-center bg-cover bg- delay-100 bg-teal-500 dark:bg-blue-700 w-full h-full">
            <Toolbar />
            <WindowManager />
            <Dock />
        </div >
    )
}
