import { createMemo, type JSXElement } from "solid-js";
import { Finder } from "./finder";
import { Safari } from "./safari";
import { Preferences } from "../preferences";
import { useWindowManager } from "../../hooks/window-manager";
import { SinglePanelLayout } from "../layouts/single-panel";

export type AppInfo = {
    name: string;
    icon: string;
    description?: string;
    component: JSXElement;
    windowConfig?: {
        height?: number;
        width?: number;
        x?: number;
        y?: number;
    }
}

const _2048 = () => createMemo(() => {
    return <iframe src="https://funhtml5games.com?embed=2048bit" style="width:530px;height:690px;border:none;" frameborder="0" scrolling="no"></iframe>;
});

export const AppRegistry: Record<string, AppInfo> = {
    "Finder": {
        name: "Finder",
        icon: "./apps/finder.svg",
        description: "The file manager for macOS.",
        component: <Finder />
    },
    "Safari": {
        name: "Safari",
        icon: "./apps/safari.svg",
        description: "The web browser for macOS.",
        component: <Safari />
    },
    "Preferences": {
        name: "System Preferences",
        icon: "./apps/syspref.svg",
        description: "Manage system settings and preferences.",
        component: <Preferences />
    },
    "Siri": {
        name: "Siri",
        icon: "./apps/siri.svg",
        description: "Apple's virtual assistant.",
        component: "Siri"
    },
    "Trash": {
        name: "Trash",
        icon: "./apps/trash.svg",
        description: "The trash can for deleted files.",
        component: "Trash"
    },
    "2048": {
        name: "2048",
        icon: "./apps/2048.svg",
        description: "A simple 2048 game.",
        component: <SinglePanelLayout content={[_2048()]} />,
        windowConfig: {
            height: 800,
            width: 565
        }
    }
};

const prevWinPos = {
    x: 100,
    y: 100
};

export const getAppInfo = (name: string): AppInfo | undefined => {
    return AppRegistry[name];
};

export const getAppIcon = (name: string): string => {
    const app = getAppInfo(name);
    return app ? app.icon : './apps/default-app.svg';
}

export const getAppComponent = (name: string): JSXElement => {
    const app = getAppInfo(name);
    return app ? app.component : "Not found";
}

export const launchApp = (app: AppInfo) => {
    const { windows, createWindow, focusWindow } = useWindowManager();

    const existingWindow = Object.values(windows).find(win => win.title === app.name);

    if (existingWindow) {
        focusWindow(existingWindow.id);
        return;
    }

    const windowProps = {
        title: app.name,
        x: app.windowConfig?.x ?? prevWinPos.x, // x position
        y: app.windowConfig?.y ?? prevWinPos.y, // y position
        width: app.windowConfig?.width ?? 800, // innerWidth
        height: app.windowConfig?.height ?? 600, // innerHeight
        children: app.component, // children
        icon: app.icon, // icon
    };

    createWindow(windowProps);
}
