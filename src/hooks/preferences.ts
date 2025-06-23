import { createSignal } from "solid-js";

type Preferences = {
    theme: 'light' | 'dark' | 'auto'
};

const defaultPreferences: Preferences = {
    theme: 'light'
};

const [preferences, setPreferences] = createSignal<Preferences>(defaultPreferences);

const usePreferences = () => {
    const getPreferences = (): Preferences => preferences();
    const setPreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };
    const getPreference = <K extends keyof Preferences>(key: K): Preferences[K] | undefined => {
        return preferences()[key];
    }

    const resetToDefault = () => {
        setPreferences(defaultPreferences);
    }

    return {
        getPreferences,
        getPreference,
        setPreference,
        resetToDefault
    };
};

export { usePreferences }
export type { Preferences };
