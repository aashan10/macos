import type { JSX } from "solid-js";

type SinglePanelLayoutProps = {
    content: JSX.Element;
    class?: string;
    contentClass?: string;
};

export const SinglePanelLayout = (props: SinglePanelLayoutProps) => {
    // Set default values for props


    const rootClasses = () => `w-full h-full flex flex-row absolute top-0 left-0 ${props.class || ''}`;


    const contentClasses = () => `pt-12 px-4 h-full w-full flex-1 overflow-y-auto ${props.contentClass || ''} bg-stone-50 dark:bg-stone-800`;

    return (
        <div class={rootClasses()}>

            <div class={contentClasses()}>
                {props.content}
            </div>
        </div>
    );
};
