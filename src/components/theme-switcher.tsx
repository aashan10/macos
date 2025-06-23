import { createEffect, createMemo } from "solid-js";
import { usePreferences } from "../hooks/preferences"

export const ThemeSwitcher = () => {

    const { getPreference, setPreference } = usePreferences();

    const theme = createMemo(() => getPreference('theme') || 'light');

    const toggleTheme = () => {
        const newTheme = theme() === 'light' ? 'dark' : 'light';
        setPreference('theme', newTheme);
    }

    createEffect(() => {
        document.documentElement.classList.toggle('dark', theme() === 'dark');
        document.documentElement.classList.toggle('light', theme() === 'light');
    });

    return (
        <button onClick={toggleTheme} class="p-2 text-white rounded cursor-pointer">
            {{ light: '🌞', dark: '🌜', auto: '🖥️' }[theme()]}
        </button>
    )
}
