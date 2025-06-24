import type { JSXElement } from "solid-js";
import { Finder } from "./finder";
import { Safari } from "./safari";
import { Preferences } from "../preferences";
import { useWindowManager } from "../../hooks/window-manager";

export type AppInfo = {
    name: string;
    icon: string;
    description?: string;
    component: JSXElement;
}

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

export const launchApp = (name: string) => {
    const { windows, createWindow, focusWindow } = useWindowManager();

    const app = getAppInfo(name);

    if (!app) {
        console.error(`App ${name} not found in registry.`);
        return;
    }

    const existingWindow = Object.values(windows).find(win => win.title === app.name);

    if (existingWindow) {
        focusWindow(existingWindow.id);
        return;
    }

    createWindow(
        app.name,
        prevWinPos.x, // x position
        prevWinPos.y, // y position
        800, // width
        600, // height
        [app.component], // children
        app.icon
    );

    prevWinPos.x += 20; // Increment x position for next app 
    prevWinPos.y += 20; // Increment y position for next app

    if (prevWinPos.x > window.innerWidth - 200) {
        prevWinPos.x = 100; // Reset x position if it exceeds window innerWidth
    }
    if (prevWinPos.y > window.innerHeight - 200) {
        prevWinPos.y = 100; // Reset y position if it exceeds window innerHeight
    }
}
