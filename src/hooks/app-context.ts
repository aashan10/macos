import { createContext, useContext, type JSXElement } from 'solid-js';
import type { WindowState } from './window-manager';

export type AppContextType = {
    requestWindow: (props: WindowState & { children: JSXElement }) => void,
    getWindowInfo: () => any
}

const AppContext = createContext<AppContextType>({
    requestWindow: (_) => {
        console.warn("AppContext.requestWindow is not implemented");
    },
    getWindowInfo: () => {
        console.warn("AppContext.getWindowInfo is not implemented");
    }
});

export const useApp = useContext(AppContext);
export const AppProvider = AppContext.Provider;
